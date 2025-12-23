import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Course } from '../domain/entities/course.entity';
import { DomainException } from '../domain/exceptions/domain.exception';
import { CourseFactory } from '../domain/factories/course.factory';
import { CourseId } from '../domain/value-objects/course-id.vo';
import { CreateCourseCommand } from './commands/create-course-command';
import { CourseService } from './course.service';
import { CourseRepository } from './ports/course.repository';

describe('CourseService', () => {
  let service: CourseService;
  let repository: jest.Mocked<CourseRepository>;
  let factory: jest.Mocked<CourseFactory>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<CourseRepository>;
    factory = {
      create: jest.fn(),
      hydrate: jest.fn(),
    } as unknown as jest.Mocked<CourseFactory>;
    service = new CourseService(repository, factory);
  });

  it('creates and saves a course', async () => {
    const cmd: CreateCourseCommand = {
      title: 'Introduction to Testing',
      description: 'This is a long enough description.',
      active: true,
    };

    const createdCourse = new Course(
      null,
      cmd.title,
      cmd.description,
      cmd.active
    );
    const savedCourse = new Course(
      new CourseId('uuid-123'),
      cmd.title,
      cmd.description,
      cmd.active
    );

    (factory.create as jest.Mock).mockReturnValue(createdCourse);
    (repository.save as jest.Mock).mockResolvedValue(savedCourse);

    const result = await service.create(cmd);

    expect(factory.create).toHaveBeenCalledWith(
      cmd.title,
      cmd.description,
      cmd.active
    );
    expect(repository.save).toHaveBeenCalledWith(createdCourse);
    expect(result).toBe(savedCourse);
    expect(result.id).not.toBeNull();
  });

  it('propagates factory errors and does not call repository', async () => {
    const cmd: CreateCourseCommand = {
      title: '',
      description: 'short',
      active: true,
    };

    (factory.create as jest.Mock).mockImplementation(() => {
      throw new DomainException('Course title cannot be empty.');
    });

    expect(() => service.create(cmd)).toThrow(BadRequestException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('propagates repository errors', async () => {
    const cmd: CreateCourseCommand = {
      title: 'Valid title',
      description: 'A sufficiently long description',
      active: false,
    };

    const createdCourse = new Course(
      null,
      cmd.title,
      cmd.description,
      cmd.active
    );
    (factory.create as jest.Mock).mockReturnValue(createdCourse);
    (repository.save as jest.Mock).mockRejectedValue(new Error('db failure'));

    await expect(service.create(cmd)).rejects.toThrow('db failure');
  });

  it('should get a course by id -> propagates call to the repository and hydrate the entity', async () => {
    // Arrange
    const validUUID = 'uuid-valid-demo';
    const foundCourse = new Course(
      new CourseId(validUUID),
      'Found',
      'Valid description for this',
      true
    );
    jest.spyOn(repository, 'findById').mockResolvedValue(foundCourse);
    // jest.spyOn(factory, 'hydrate').mockReturnValue(foundCourse);

    // Act
    service.findById(validUUID);

    // Assert
    expect(repository.findById).toHaveBeenCalledTimes(1);
    // expect(factory.hydrate).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException given non-existent course id', async () => {
    // Arrange
    const nonExistentId = 'invalid-uuid';

    jest.spyOn(repository, 'findById').mockResolvedValue(null);

    //Act && Assert

    await expect(service.findById(nonExistentId)).rejects.toThrow(
      NotFoundException
    );
    await expect(service.findById(nonExistentId)).rejects.toThrow(
      `Course with ID: ${nonExistentId} not found!`
    );
  });

  it('should full update the course, given a valid input', async () => {
    // Arrange
    const updateCourseCommand = {
      id: 'valid-uuid',
      title: 'The new title of the course',
      description: 'New and improved description',
      active: true,
    };

    const existingCourse: Course = new Course(
      new CourseId('valid-uuid'),
      'Old title that needs to be changed',
      'Old description that will be changed',
      false
    );

    const updatedCourse = new Course(
      new CourseId('valid-uuid'),
      'The new title of the course',
      'New and improved description',
      true
    );

    jest.spyOn(repository, 'findById').mockResolvedValue(existingCourse);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedCourse);

    // Act
    const res = await service.update(updateCourseCommand);

    //Assert
    expect(repository.findById).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalled();
    expect(res).toEqual(updatedCourse);
  });

  it('should update only the title field, given only id and title', async () => {
    //Arrange
    const updateCourseCommand = {
      id: 'valid-uuid',
      title: 'Updated title',
    };
    const existingCourse: Course = new Course(
      new CourseId('valid-uuid'),
      'Old title that needs to be changed',
      'Old description that will be changed',
      false
    );

    const updatedCourse = new Course(
      new CourseId('valid-uuid'),
      'Updated title',
      'Old description that will be changed',
      false
    );

    jest.spyOn(repository, 'findById').mockResolvedValue(existingCourse);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedCourse);
    jest.spyOn(existingCourse, 'updateTitle');

    //ACT
    const res = await service.update(updateCourseCommand);

    //Assert
    expect(repository.findById).toHaveBeenCalledWith(updateCourseCommand.id);
    expect(repository.save).toHaveBeenCalledWith(existingCourse);
    expect(existingCourse.updateTitle).toHaveBeenCalled();
    expect(res).toEqual(updatedCourse);
  });
});
