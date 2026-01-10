import axios, { isAxiosError } from 'axios';

describe('POST /api/courses', () => {
  it('should return the newly created course, given a valid input', async () => {
    const creacteCourseDto = {
      title: 'My very first e2e',
      description: 'Long description to be a valid input',
      active: false,
    };
    const res = await axios.post(`/api/courses`, creacteCourseDto);

    expect(res.status).toBe(201);
    expect(res.data.data).toHaveProperty('id');
  });

  it('POST /courses -> 400 when payload is invalid', async () => {
    const invalidCreateCoursePayload = {
      title: '',
      description: 'short',
      active: false,
    };

    let res;
    try {
      await axios.post('/api/courses', invalidCreateCoursePayload);
      fail('Request should have failed with 400');
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        res = error.response;
      } else {
        throw error;
      }
    }

    expect(res.status).toBe(400);
    expect(res.data.message).toEqual(
      expect.arrayContaining([
        'The course title should not be empty',
        'Description should be min. 10 characters long',
      ])
    );
  });
});

describe('GET /api/courses', () => {
  type CourseDto = {
    id: string;
    title: string;
    description: string;
    isActive: boolean;
  };
  let existingCourse: CourseDto;

  const initialiseCourseDb = async () => {
    const createCourseDto = {
      title: 'My very first e2e',
      description: 'Long description to be a valid input',
      active: false,
    };
    const res = await axios.post(`/api/courses`, createCourseDto);

    return res.data.data;
  };

  beforeAll(async () => {
    existingCourse = await initialiseCourseDb();
  });

  it('should get an existing course by ID, given a valid course id', async () => {
    // arrange
    const validCourseId = existingCourse.id;
    // act
    const res = await axios.get(`/api/courses/${validCourseId}`);
    //assert
    expect(res.status).toBe(200);
    expect(res.data.data).toEqual(existingCourse);
  });

  it('should get a bad request, given an invalid uuid as course id', async () => {
    const invalidUUID = 'invalid-uuid';
    //Act
    let res;
    try {
      await axios.get(`/api/courses/${invalidUUID}`);
      fail('Request should have failed with 400');
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        res = error.response;
      } else {
        throw error;
      }
    }
    expect(res.status).toBe(400);
    expect(res.data.message).toEqual('Validation failed (uuid is expected)');
  });
});
