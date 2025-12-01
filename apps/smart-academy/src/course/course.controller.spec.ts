import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import {
  CreateCourseService,
  CreateCourseCommand,
  GetCourseService,
} from '@smart-academy/core';

describe('CourseController', () => {
  let controller: CourseController;

  const mockCreateResult = {
    id: 'generated-id',
    name: 'Course title',
    description: 'Description',
  };
  const mockCreateCourseService = {
    execute: jest.fn().mockResolvedValue(mockCreateResult),
  };

  const mockGetResult = {
    id: 'existing-id',
    name: 'Existing Course',
    description: 'Existing description',
  };
  const mockGetCourseService = {
    execute: jest.fn().mockResolvedValue(mockGetResult),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        {
          provide: CreateCourseService,
          useValue: mockCreateCourseService,
        },
        {
          provide: GetCourseService,
          useValue: mockGetCourseService,
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

    const result = await controller.createCourse(command);

    expect(mockCreateCourseService.execute).toHaveBeenCalledTimes(1);
    expect(mockCreateCourseService.execute).toHaveBeenCalledWith(command);
    expect(result).toBe(mockCreateResult);
  });

  it('should call GetCourseService.execute with the provided id and return the result', async () => {
    const id = 'existing-id';

    const result = await controller.getCourseById(id);

    expect(mockGetCourseService.execute).toHaveBeenCalledTimes(1);
    expect(mockGetCourseService.execute).toHaveBeenCalledWith(id);
    expect(result).toBe(mockGetResult);
  });
});
