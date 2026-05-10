const request = require('supertest');
const jwt     = require('jsonwebtoken');

jest.mock('../src/config/db');
const db  = require('../src/config/db');
const app = require('../src/app');

const token = jwt.sign({ id: 1, username: 'admin' }, 'test_secret', { expiresIn: '1h' });
const auth  = { Authorization: `Bearer ${token}` };

describe('POST /api/contact', () => {
  test('returns 400 when name missing', async () => {
    const res = await request(app).post('/api/contact').send({ message: 'Hello' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Name and message required');
  });

  test('returns 400 when message missing', async () => {
    const res = await request(app).post('/api/contact').send({ name: 'John' });
    expect(res.status).toBe(400);
  });

  test('submits contact with name and message', async () => {
    db.query.mockResolvedValueOnce([{ insertId: 1 }]);
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'John', email: 'john@test.com', phone: '0812345678', message: 'Hello!' });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Submitted successfully');
  });

  test('submits contact with only required fields', async () => {
    db.query.mockResolvedValueOnce([{ insertId: 2 }]);
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Jane', message: 'Interested in products' });
    expect(res.status).toBe(201);
  });
});

describe('GET /api/admin/contacts', () => {
  test('returns 401 without token', async () => {
    const res = await request(app).get('/api/admin/contacts');
    expect(res.status).toBe(401);
  });

  test('returns contacts list with token', async () => {
    const mockContacts = [{ id: 1, name: 'John', message: 'Hello', is_read: false }];
    db.query.mockResolvedValueOnce([mockContacts]);
    const res = await request(app).get('/api/admin/contacts').set(auth);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('PUT /api/admin/contacts/:id/read', () => {
  test('marks submission as read', async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const res = await request(app).put('/api/admin/contacts/1/read').set(auth);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Marked as read');
  });
});
