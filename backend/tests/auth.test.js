const request = require('supertest');
const bcrypt  = require('bcryptjs');

jest.mock('../src/config/db');
const db = require('../src/config/db');
const app = require('../src/app');

describe('POST /api/admin/login', () => {
  const hash = bcrypt.hashSync('admin1234', 10);

  test('returns 400 when body is empty', async () => {
    const res = await request(app).post('/api/admin/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Username and password required');
  });

  test('returns 401 when username not found', async () => {
    db.query.mockResolvedValueOnce([[]]);
    const res = await request(app).post('/api/admin/login').send({ username: 'nobody', password: '123' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  test('returns 401 when password is wrong', async () => {
    db.query.mockResolvedValueOnce([[{ id: 1, username: 'admin', password_hash: hash }]]);
    const res = await request(app).post('/api/admin/login').send({ username: 'admin', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  test('returns token on valid credentials', async () => {
    db.query.mockResolvedValueOnce([[{ id: 1, username: 'admin', password_hash: hash }]]);
    const res = await request(app).post('/api/admin/login').send({ username: 'admin', password: 'admin1234' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.username).toBe('admin');
  });
});
