const request = require('supertest');
const jwt     = require('jsonwebtoken');

jest.mock('../src/config/db');
const db  = require('../src/config/db');
const app = require('../src/app');

const token = jwt.sign({ id: 1, username: 'admin' }, 'test_secret', { expiresIn: '1h' });
const auth  = { Authorization: `Bearer ${token}` };

const mockBanners = [
  { id: 1, image_url: '/uploads/a.jpg', title_th: 'แบนเนอร์', title_en: 'Banner', sort_order: 0, is_active: true },
];

describe('GET /api/banners', () => {
  test('returns active banners', async () => {
    db.query.mockResolvedValueOnce([mockBanners]);
    const res = await request(app).get('/api/banners');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/admin/banners', () => {
  test('returns 401 without token', async () => {
    const res = await request(app).get('/api/admin/banners');
    expect(res.status).toBe(401);
  });

  test('returns all banners with valid token', async () => {
    db.query.mockResolvedValueOnce([mockBanners]);
    const res = await request(app).get('/api/admin/banners').set(auth);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('DELETE /api/admin/banners/:id', () => {
  test('returns 401 without token', async () => {
    const res = await request(app).delete('/api/admin/banners/1');
    expect(res.status).toBe(401);
  });

  test('deletes banner with valid token', async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const res = await request(app).delete('/api/admin/banners/1').set(auth);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Deleted');
  });
});
