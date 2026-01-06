import { Test, TestingModule } from '@nestjs/testing';
import { StudentRepositoryImpl } from './student-impl.repository';
import { StudentFactory } from './student.factory';
import { DATA_SOURCE } from '../../common/database/constants';
import { StudentModel } from './students.table';
import { StudentId } from '../domain/value-objects/student-id.vo';
import { PersistanceException } from '../../common/exceptions/persistance.exception';

describe('StudentRepositoryImpl', () => {
  let repository: StudentRepositoryImpl;

  // typed DB mock
  interface DbQueryMock {
    select: jest.Mock<DbQueryMock, []>;
    from: jest.Mock<DbQueryMock, []>;
    where: jest.Mock<Promise<StudentModel[]>, [unknown?]>;
  }

  let dbMock: DbQueryMock;
  let module: TestingModule;

  beforeAll(async () => {
    dbMock = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn(),
    };

    module = await Test.createTestingModule({
      providers: [
        StudentRepositoryImpl,
        StudentFactory,
        { provide: DATA_SOURCE, useValue: dbMock },
      ],
    }).compile();

    repository = module.get<StudentRepositoryImpl>(StudentRepositoryImpl);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
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
});
