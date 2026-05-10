const db = require('../config/db');

exports.getAll = async (req, res) => {
  const isAdmin = !!req.admin;
  const where   = isAdmin ? '' : 'WHERE is_active = TRUE';
  const [rows]  = await db.query(`SELECT * FROM banners ${where} ORDER BY sort_order ASC`);
  res.json(rows);
};

exports.create = async (req, res) => {
  const { title_th, title_en, subtitle_th, subtitle_en, sort_order } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  if (!image_url) return res.status(400).json({ message: 'Image required' });

  const [result] = await db.query(
    'INSERT INTO banners (image_url,title_th,title_en,subtitle_th,subtitle_en,sort_order) VALUES (?,?,?,?,?,?)',
    [image_url, title_th, title_en, subtitle_th, subtitle_en, sort_order || 0]
  );
  res.status(201).json({ id: result.insertId });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { title_th, title_en, subtitle_th, subtitle_en, sort_order, is_active } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  const fields = ['title_th=?','title_en=?','subtitle_th=?','subtitle_en=?','sort_order=?','is_active=?'];
  const values = [title_th, title_en, subtitle_th, subtitle_en, sort_order, is_active];

  if (image_url) { fields.push('image_url=?'); values.push(image_url); }
  values.push(id);

  await db.query(`UPDATE banners SET ${fields.join(',')} WHERE id=?`, values);
  res.json({ message: 'Updated' });
};

exports.remove = async (req, res) => {
  await db.query('DELETE FROM banners WHERE id=?', [req.params.id]);
  res.json({ message: 'Deleted' });
};
