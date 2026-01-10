import axios, { AxiosError, isAxiosError } from 'axios';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';

describe('POST /api/students', () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  beforeEach(async () => {
    await pool.query('DELETE FROM students');
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('Get student by ID', () => {
    it('should return the user given a valid student id', async () => {
      // arrange
      const existingStudent = await pool.query(
        'INSERT INTO students ("firstName", "lastName", "email", "profilePicture") VALUES ($1, $2, $3, $4) RETURNING *',
        ['John', 'Doe', 'john@example.com', '']
      );

      // act
      const res = await axios.get(
        `/api/students/${existingStudent.rows[0].id}`
      );

      // assert
      expect(res.status).toBe(200);
      expect(res.data.data).toEqual(
        expect.objectContaining({
          id: existingStudent.rows[0].id,
          firstName: existingStudent.rows[0].firstName,
          lastName: existingStudent.rows[0].lastName,
          profilePicture: existingStudent.rows[0].profilePicture,
        })
      );
    });

    it('should return 404 - not found if there is no user with the given id - valid uuid', async () => {
      const validUuid = randomUUID();

      let res: AxiosError;
      try {
        await axios.get(`/api/students/${validUuid}`);
        fail('Request should have failed with status 404');
      } catch (e) {
        if (isAxiosError(e)) {
          res = e;
        } else {
          throw e;
        }
      }

      expect(res.status).toBe(404);
    });

    it('should return 400 - bad request given an invalid uuid as a student id', async () => {
      const invalidUuid = 'invalid-uuid';

      let res: AxiosError;
      try {
        await axios.get(`/api/students/${invalidUuid}`);
        fail('Request should have failed with status 400');
      } catch (e) {
        if (isAxiosError(e)) {
          res = e;
        } else {
          throw e;
        }
      }

      expect(res.status).toBe(400);
    });
  });

  describe('Create student', () => {
    it('should return the newly created student when given a valid input', async () => {
      // arrange
      const createStudentDto = {
        firstName: 'Ion',
        lastName: 'Popescu',
        email: 'popescu.ion@gmail.com',
        profilePicture: null,
      };
      //act
      const res = await axios.post('/api/students', createStudentDto);
      const createdStudent = res.data.data;
      //assert
      expect(res.status).toBe(201);
      expect(createdStudent).toHaveProperty('id');
      expect(createdStudent.firstName).toBe(createStudentDto.firstName);
    });

    it('should return - 400 bad request given invalid object as input', async () => {
      const invalidCreateStudentBody = {
        name: 'Ion Popescu',
        age: 16,
      };

      let res: AxiosError;
      try {
        await axios.post('/api/students', invalidCreateStudentBody);
        fail('Request should have failed with 400');
      } catch (e) {
        if (isAxiosError(e)) {
          res = e;
        } else {
          throw e;
        }
      }

      expect(res.status).toBe(400);
    });
  });

  describe('Search: ', () => {
    it('should return matching students given an eq filter', async () => {
      const insert1 = await pool.query(
        'INSERT INTO students ("firstName", "lastName", "email", "profilePicture") VALUES ($1, $2, $3, $4) RETURNING *',
        ['John', 'Doe', 'john@example.com', '']
      );

      await pool.query(
        'INSERT INTO students ("firstName", "lastName", "email", "profilePicture") VALUES ($1, $2, $3, $4) RETURNING *',
        ['Alice', 'Smith', 'alice@example.com', '']
      );

      const body = {
        filters: [{ field: 'firstName', operator: 'eq', value: 'John' }],
        sort: 'asc',
        pageIndex: 0,
        pageSize: 10,
      };

      const res = await axios.post('/api/students/search', body);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data.data)).toBe(true);
      expect(res.data.data).toHaveLength(1);
      expect(res.data.data[0]).toEqual(
        expect.objectContaining({
          firstName: insert1.rows[0].firstName,
          lastName: insert1.rows[0].lastName,
          email: insert1.rows[0].email,
        })
      );
    });

    it('should return 400 when filter has invalid field', async () => {
      const body = {
        filters: [{ field: 'unknown', operator: 'eq', value: 'x' }],
        pageIndex: 0,
        pageSize: 10,
      };

      let res;
      try {
        await axios.post('/api/students/search', body);
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
        expect.arrayContaining([expect.stringContaining('field')])
      );
    });

    it('should return all students when filters is empty array', async () => {
      await pool.query(
        'INSERT INTO students ("firstName", "lastName", "email", "profilePicture") VALUES ($1, $2, $3, $4)',
        ['John', 'Doe', 'john@example.com', '']
      );

      await pool.query(
        'INSERT INTO students ("firstName", "lastName", "email", "profilePicture") VALUES ($1, $2, $3, $4)',
        ['Alice', 'Smith', 'alice@example.com', '']
      );

      const body = { filters: [], pageIndex: 0, pageSize: 10 };

      const res = await axios.post('/api/students/search', body);

      expect(res.status).toBe(200);
      expect(res.data.data.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Update student feature', () => {
    it('should return the student given a valid update student request', async () => {
      // arrange
      const updateStudentDto = {
        email: 'new.ion.popescu@gmail.com',
        firstName: 'Vasile',
      };

      const existingStudent = await pool.query(
        'INSERT INTO students ("firstName", "lastName", "email", "profilePicture") VALUES ($1, $2, $3, $4) RETURNING *',
        ['Ion', 'Popescu', 'ion@popescu.com', '']
      );

      // act
      const res = await axios.patch(
        `/api/students/${existingStudent.rows[0].id}`,
        updateStudentDto
      );

      // assert
      expect(res.status).toBe(200);
      expect(res.data.data).toEqual(
        expect.objectContaining({
          id: existingStudent.rows[0].id,
          email: updateStudentDto.email,
          firstName: updateStudentDto.firstName,
          lastName: 'Popescu',
          profilePicture: existingStudent.rows[0].profilePicture,
        })
      );
    });

    it('should return BadRequest 400 given a non existing student id', async () => {
      // arrange
      const nonExistingStudentId = 'e71b44cf-98f8-481a-b3c8-b26e77a4a5f2'; // still valid uuid
      const updateStudentDto = {
        firstName: 'NewName',
      };

      // act
      let res: AxiosError;
      try {
        await axios.patch(
          `/api/students/${nonExistingStudentId}`,
          updateStudentDto
        );
        fail('Request should failed with status 400');
      } catch (e) {
        console.log(e);
        res = e;
      }

      // assert
      expect(res.status).toBe(400);
    });
  });
});
