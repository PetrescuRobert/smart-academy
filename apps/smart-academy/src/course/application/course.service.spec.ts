import { CourseService } from './course.service';
import { CourseRepository } from './ports/course.repository';
import { CourseFactory } from '../domain/factories/course.factory';
import { CreateCourseCommand } from './commands/create-course-command';
import { Course } from '../domain/entities/course.entity';
import { DomainException } from '../domain/exceptions/domain.exception';
import { BadRequestException } from '@nestjs/common';

describe('CourseService', () => {
  let service: CourseService;
  let repository: jest.Mocked<CourseRepository>;
  let factory: jest.Mocked<CourseFactory>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
    } as unknown as jest.Mocked<CourseRepository>;
    factory = { create: jest.fn() } as unknown as jest.Mocked<CourseFactory>;
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
    const savedCourse = Course.reconstruct({
      id: 'uuid-123',
      title: cmd.title,
      description: cmd.description,
      active: cmd.active,
    });

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
});
