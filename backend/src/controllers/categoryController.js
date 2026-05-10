const db = require('../config/db');

exports.getAll = async (req, res) => {
  const isAdmin = !!req.admin;
  const where   = isAdmin ? '' : 'WHERE is_active = TRUE';
  const [rows]  = await db.query(`SELECT * FROM categories ${where} ORDER BY sort_order ASC`);
  res.json(rows);
};

exports.create = async (req, res) => {
  const { name_th, name_en, slug, sort_order } = req.body;
  const [result] = await db.query(
    'INSERT INTO categories (name_th,name_en,slug,sort_order) VALUES (?,?,?,?)',
    [name_th, name_en, slug, sort_order || 0]
  );
  res.status(201).json({ id: result.insertId });
};

exports.update = async (req, res) => {
  const { name_th, name_en, slug, sort_order, is_active } = req.body;
  await db.query(
    'UPDATE categories SET name_th=?,name_en=?,slug=?,sort_order=?,is_active=? WHERE id=?',
    [name_th, name_en, slug, sort_order, is_active, req.params.id]
  );
  res.json({ message: 'Updated' });
};

exports.remove = async (req, res) => {
  await db.query('DELETE FROM categories WHERE id=?', [req.params.id]);
  res.json({ message: 'Deleted' });
};
