import axios, { isAxiosError } from 'axios';
import { Pool } from 'pg';

describe('POST /api/students/search', () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  beforeEach(async () => {
    await pool.query('DELETE FROM students');
  });

  afterAll(async () => {
    await pool.end();
  });

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
