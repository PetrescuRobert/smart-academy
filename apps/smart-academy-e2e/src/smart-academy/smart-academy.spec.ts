import axios from 'axios';

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
    } catch (error: any) {
      if (error.response) {
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
