import { Test, TestingModule } from '@nestjs/testing';
import { StudentRepositoryImpl } from './student-impl.repository';
import { StudentFactory } from './student.factory';
import { DATA_SOURCE } from '../../common/database/constants';
import { StudentModel } from './students.table';
import { StudentId } from '../domain/value-objects/student-id.vo';
import { PersistanceException } from '../../common/exceptions/persistance.exception';
import { Student } from '../domain/student.entity';

describe('StudentRepositoryImpl', () => {
  let repository: StudentRepositoryImpl;
  let factory: StudentFactory;

  // typed DB mock (extended for insert/update)
  interface DbQueryMock {
    select: jest.Mock<DbQueryMock, []>;
    from: jest.Mock<DbQueryMock, []>;
    where: jest.Mock<Promise<StudentModel[]>, [unknown?]>;

    // insert/update helpers
    insert: jest.Mock<DbQueryMock, []>;
    values: jest.Mock<DbQueryMock, [unknown?]>;
    returning: jest.Mock<Promise<StudentModel[]>, []>;

    update: jest.Mock<DbQueryMock, []>;
    onConflictDoUpdate: jest.Mock<DbQueryMock, []>;
    set: jest.Mock<DbQueryMock, [unknown?]>;
  }

  let dbMock: DbQueryMock;
  let module: TestingModule;

  beforeAll(async () => {
    dbMock = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn(),

      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn(),

      update: jest.fn().mockReturnThis(),
      onConflictDoUpdate: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
    };

    module = await Test.createTestingModule({
      providers: [
        StudentRepositoryImpl,
        StudentFactory,
        { provide: DATA_SOURCE, useValue: dbMock },
      ],
    }).compile();

    repository = module.get<StudentRepositoryImpl>(StudentRepositoryImpl);
    factory = module.get<StudentFactory>(StudentFactory);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // prevent logger output during tests
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('findById -- should return a student given a valid id', async () => {
    // arrange
    const id = '11111111-1111-1111-1111-111111111111';
    const studentModel: StudentModel = {
      id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      profilePicture: null,
    };
    dbMock.where.mockResolvedValue([studentModel]);

    // act
    const student = await repository.findById(new StudentId(id));

    // assert
    expect(dbMock.select).toHaveBeenCalled();
    expect(dbMock.from).toHaveBeenCalled();
    expect(dbMock.where).toHaveBeenCalled();
    expect(student).not.toBeNull();
    expect(student.getId.value).toBe(id);
    expect(student.getFirstName).toBe('John');
    expect(student.getLastName).toBe('Doe');
    expect(student.getEmail.value).toBe('john@example.com');
  });

  it('findById -- should return null when student not found', async () => {
    dbMock.where.mockResolvedValue([]);

    const student = await repository.findById(
      new StudentId('22222222-2222-2222-2222-222222222222')
    );

    expect(student).toBeNull();
  });

  it('findById -- should throw PersistanceException when DB throws', async () => {
    dbMock.where.mockRejectedValue(new Error('db failure'));

    await expect(
      repository.findById(new StudentId('33333333-3333-3333-3333-333333333333'))
    ).rejects.toBeInstanceOf(PersistanceException);
  });

  // ----- SAVE tests -----

  it('save -- should insert new student when no id present', async () => {
    // arrange
    const insertedModel: StudentModel = {
      id: 'aaaaaaa1-1111-1111-1111-111111111111',
      firstName: 'Jane',
      lastName: 'Roe',
      email: 'jane@example.com',
      profilePicture: null,
    };

    // DB insert returns the inserted row
    dbMock.returning.mockResolvedValue([insertedModel]);

    const studentToInsert = {
      // no id -> considered new
      getId: new StudentId(null),
      getFirstName: 'Jane',
      getLastName: 'Roe',
      getEmail: { value: 'jane@example.com' },
      getProfilePicture: null,
    } as Student;

    const hydratedStudent = {
      getId: { value: insertedModel.id },
      getFirstName: insertedModel.firstName,
      getLastName: insertedModel.lastName,
      getEmail: { value: insertedModel.email },
      getProfilePicture: null,
    };

    jest.spyOn(factory, 'hydrate').mockReturnValue(hydratedStudent as Student);

    // act
    const result = await repository.save(studentToInsert);

    // assert
    expect(dbMock.insert).toHaveBeenCalled();
    expect(dbMock.values).toHaveBeenCalledWith({
      id: null,
      firstName: 'Jane',
      lastName: 'Roe',
      email: 'jane@example.com',
      profilePicture: null,
    });
    expect(dbMock.returning).toHaveBeenCalled();
    expect(factory.hydrate).toHaveBeenCalledWith(insertedModel);
    expect(result).toBe(hydratedStudent);
  });

  it('save -- should update existing student when id exists in db', async () => {
    // arrange
    const id = 'bbbbbbb2-2222-2222-2222-222222222222';

    const updatedModel: StudentModel = {
      id,
      firstName: 'New',
      lastName: 'Name',
      email: 'new@example.com',
      profilePicture: null,
    };

    // update chain returns the updated row
    dbMock.returning.mockResolvedValue([updatedModel]);

    const studentToUpdate = {
      getId: { value: id },
      getFirstName: 'New',
      getLastName: 'Name',
      getEmail: { value: 'new@example.com' },
      getProfilePicture: null,
    } as Student;

    const hydratedStudent = {
      getId: { value: id },
      getFirstName: updatedModel.firstName,
      getLastName: updatedModel.lastName,
      getEmail: { value: updatedModel.email },
      getProfilePicture: null,
    };

    jest.spyOn(factory, 'hydrate').mockReturnValue(hydratedStudent as Student);

    // act
    const result = await repository.save(studentToUpdate);

    // assert: identical to insert
    expect(dbMock.insert).toHaveBeenCalled();
    expect(dbMock.values).toHaveBeenCalledWith({
      id,
      firstName: 'New',
      lastName: 'Name',
      email: 'new@example.com',
      profilePicture: null,
    });
    expect(dbMock.returning).toHaveBeenCalled();
    expect(dbMock.onConflictDoUpdate).toHaveBeenCalled();
    expect(factory.hydrate).toHaveBeenCalledWith(updatedModel);
    expect(result).toBe(hydratedStudent);
  });

  it('save -- should throw when trying to update a non-existing student id', async () => {
    // arrange
    const id = 'ccccccc3-3333-3333-3333-333333333333';
    // existence check returns empty -> not found
    dbMock.where.mockResolvedValue([]);

    const studentToUpdate = {
      getId: { value: id },
      getFirstName: 'Someone',
      getLastName: 'Else',
      getEmail: { value: 'someone@example.com' },
      getProfilePicture: null,
    } as Student;

    // act/assert
    await expect(repository.save(studentToUpdate)).rejects.toBeInstanceOf(
      Error
    );
    // ensure no update was attempted
    expect(dbMock.update).not.toHaveBeenCalled();
  });
});
