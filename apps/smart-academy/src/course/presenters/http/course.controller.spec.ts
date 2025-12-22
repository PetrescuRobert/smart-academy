import { CourseService } from '../../application/course.service';
import { Course } from '../../domain/entities/course.entity';
import { CourseId } from '../../domain/value-objects/course-id.vo';
import { CourseController } from './course.controller';
import { CourseDto } from './dtos/course.dto';
import { CreateCourseDto } from './dtos/create-course.dto';

const getValidInputAndResultData = () => {
  const body: CreateCourseDto = {
    title: 'My first controller test',
    description: 'My description for the first test',
    active: false,
  };

  const savedCourse: Course = new Course(
    new CourseId('uuid'),
    'My first controller test',
    'My description for the first test',
    false
  );

  const responseDto: CourseDto = {
    id: 'uuid',
    title: 'My first controller test',
    description: 'My description for the first test',
    isActive: false,
  };
  return { body, savedCourse, responseDto };
};

// const getInvalidTitleRequest = () => {
//   const body: CreateCourseDto = {
//     title: '',
//     description: 'Valid description should be above 10 chars',
//     active: false,
//   };
//   return { body };
// };

describe('Courses controller - tests suite', () => {
  let coursesController: CourseController;
  let coursesService: CourseService;

  beforeEach(async () => {
    coursesService = {
      create: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<CourseService>;
    coursesController = new CourseController(coursesService);
  });

  it('recieves the create course request and call the service with the correct parameter', async () => {
    // ARRANGE
    const { body, savedCourse, responseDto } = getValidInputAndResultData();

    jest.spyOn(coursesService, 'create').mockResolvedValue(savedCourse);
    jest.spyOn(CourseDto, 'fromEntity').mockReturnValue(responseDto);

    // ACT
    const result = await coursesController.createCourse(body);

    // ASSERT
    expect(coursesService.create).toHaveBeenCalledTimes(1);
    expect(coursesService.create).toHaveBeenCalledWith({
      title: body.title,
      description: body.description,
      active: body.active,
    });

    expect(CourseDto.fromEntity).toHaveBeenCalledTimes(1);
    expect(CourseDto.fromEntity).toHaveBeenCalledWith(savedCourse);

    expect(result).toEqual<CourseDto>(responseDto);
  });

  it('should return CourseDto given a valid Course id', async () => {
    //Arrange
    const validCourseId = 'valid-UUID';
    const serviceFoundCourse = new Course(
      new CourseId(validCourseId),
      'Valid title',
      'Valid long description',
      false
    );
    const controllerExpectedReturn: CourseDto = {
      id: 'valid-UUID',
      title: 'Valid title',
      description: 'Valid long description',
      isActive: false,
    };

    jest
      .spyOn(coursesService, 'findById')
      .mockResolvedValue(serviceFoundCourse);
    // Act
    const result = await coursesController.getCourseById(validCourseId);

    //Assert
    expect(result).toEqual(controllerExpectedReturn);
  });
});
