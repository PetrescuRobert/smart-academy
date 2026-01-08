import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentRepository } from './ports/student.repository';
import { StudentFactory } from '../infrastructure/student.factory';
import { CreateStudentCommand } from './commands/create-student.command';
import { Student } from '../domain/student.entity';
import { StudentId } from '../domain/value-objects/student-id.vo';
import { Email } from '../domain/value-objects/email.vo';
import { PersistanceException } from '../../common/exceptions/persistance.exception';
import { DomainException } from '../../common/exceptions/domain.exception';

describe('StudentService', () => {
  let service: StudentService;
  let repositoryMock: jest.Mocked<StudentRepository>;
  let factoryMock: jest.Mocked<StudentFactory>;

  beforeEach(async () => {
    repositoryMock = {
      findById: jest.fn() as unknown as jest.MockedFunction<
        StudentRepository['findById']
      >,
      save: jest.fn() as unknown as jest.MockedFunction<
        StudentRepository['save']
      >,
    } as jest.Mocked<StudentRepository>;

    factoryMock = {
      create: jest.fn(),
      hydrate: jest.fn(),
    } as jest.Mocked<StudentFactory>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        { provide: StudentRepository, useValue: repositoryMock },
        { provide: StudentFactory, useValue: factoryMock },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createStudent -- returns saved student on success', async () => {
    // arrange
    const command: CreateStudentCommand = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      profilePicture: null,
    };

    const newStudent = new Student(
      new StudentId(''),
      command.firstName,
      command.lastName,
      new Email(command.email),
      command.profilePicture
    );

    const savedStudent = new Student(
      new StudentId('generated-id'),
      command.firstName,
      command.lastName,
      new Email(command.email),
      command.profilePicture
    );

    factoryMock.create.mockReturnValue(newStudent);
    repositoryMock.save.mockResolvedValue(savedStudent);

    // act
    const result = await service.createStudent(command);

    // assert
    expect(factoryMock.create).toHaveBeenCalledWith(command);
    expect(repositoryMock.save).toHaveBeenCalledWith(newStudent);
    expect(result).toBe(savedStudent);
  });

  it('createStudent -- translates PersistanceException to ServiceUnavailableException', async () => {
    // arrange
    const command: CreateStudentCommand = {
      firstName: 'Bob',
      lastName: 'White',
      email: 'bob@example.com',
      profilePicture: null,
    };

    const newStudent = new Student(
      new StudentId(''),
      command.firstName,
      command.lastName,
      new Email(command.email),
      command.profilePicture
    );

    factoryMock.create.mockReturnValue(newStudent);
    repositoryMock.save.mockRejectedValue(new PersistanceException('db fail'));

    // act/assert
    await expect(service.createStudent(command)).rejects.toBeInstanceOf(
      ServiceUnavailableException
    );
  });

  it('createStudent -- translates DomainException to BadRequestException', async () => {
    // arrange
    const command: CreateStudentCommand = {
      firstName: '', // invalid -> factory will throw
      lastName: 'Brown',
      email: 'invalid-email',
      profilePicture: null,
    };

    factoryMock.create.mockImplementation(() => {
      throw new DomainException('Invalid data');
    });

    // act/assert
    await expect(service.createStudent(command)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it('findById -- should return a student given a valid id of an existing student', async () => {
    // arrange
    const validId = 'uuid-jnajsdn-asda';
    const foundStudent = new Student(
      new StudentId(validId),
      'Ion',
      'Popescu',
      new Email('ion.popescu@email.com'),
      null
    );

    jest.spyOn(repositoryMock, 'findById').mockResolvedValue(foundStudent);
    // act
    const student = await service.findById(validId);
    // assert

    expect(repositoryMock.findById).toHaveBeenCalled();
    expect(student).toBe(foundStudent);
  });

  it('findById -- should throw not found given a valid id but non existing student', async () => {
    // arrange
    const validId = 'uuid-jnajsdn-asda';

    jest.spyOn(repositoryMock, 'findById').mockResolvedValue(null);

    // act && assert
    await expect(service.findById(validId)).rejects.toThrow(NotFoundException);
  });

  it('findById -- should throw exception given a null id', async () => {
    // arrange
    const nullId = null;

    jest.spyOn(repositoryMock, 'findById');

    // act & assert
    await expect(service.findById(nullId)).rejects.toBeInstanceOf(
      BadRequestException
    );
    expect(repositoryMock.findById).not.toHaveBeenCalled();
  });
});
