import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CreateCourseService, CreateCourseCommand } from '@smart-academy/core';

describe('CourseController', () => {
  let controller: CourseController;
  const mockResult = {
    id: 'generated-id',
    name: 'Course title',
    description: 'Description',
  };
  const mockCreateCourseService = {
    execute: jest.fn().mockResolvedValue(mockResult),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        {
          provide: CreateCourseService,
          useValue: mockCreateCourseService,
        },
      ],
    }).compile();

    controller = module.get<CourseController>(CourseController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call CreateCourseService.execute with the provided command and return the result', async () => {
    const command: CreateCourseCommand = {
      name: 'Course title',
      description: 'Description',
    };

    const result = await controller.getCourseById(command);

    expect(mockCreateCourseService.execute).toHaveBeenCalledTimes(1);
    expect(mockCreateCourseService.execute).toHaveBeenCalledWith(command);
    expect(result).toBe(mockResult);
  });
});
