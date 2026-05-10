const request = require('supertest');
const jwt     = require('jsonwebtoken');

jest.mock('../src/config/db');
const db  = require('../src/config/db');
const app = require('../src/app');

const token = jwt.sign({ id: 1, username: 'admin' }, 'test_secret', { expiresIn: '1h' });
const auth  = { Authorization: `Bearer ${token}` };

const mockCategories = [
  { id: 1, name_th: 'ดูแลผิวหน้า', name_en: 'Face Care', slug: 'face-care', sort_order: 0, is_active: true },
];

describe('GET /api/categories', () => {
  test('returns active categories', async () => {
    db.query.mockResolvedValueOnce([mockCategories]);
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /api/admin/categories', () => {
  test('returns 401 without token', async () => {
    const res = await request(app).post('/api/admin/categories').send({});
    expect(res.status).toBe(401);
  });

  test('creates category with valid data', async () => {
    db.query.mockResolvedValueOnce([{ insertId: 2 }]);
    const res = await request(app)
      .post('/api/admin/categories')
      .set(auth)
      .send({ name_th: 'ลิปสติก', name_en: 'Lipstick', slug: 'lipstick', sort_order: 1 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});

describe('PUT /api/admin/categories/:id', () => {
  test('updates category', async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const res = await request(app)
      .put('/api/admin/categories/1')
      .set(auth)
      .send({ name_th: 'ดูแลผิวหน้า', name_en: 'Face Care Updated', slug: 'face-care', sort_order: 0, is_active: true });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Updated');
  });
});

describe('DELETE /api/admin/categories/:id', () => {
  test('deletes category', async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const res = await request(app).delete('/api/admin/categories/1').set(auth);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Deleted');
  });
});
