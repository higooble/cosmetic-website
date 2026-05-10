const db = require('../config/db');

exports.submit = async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !message) return res.status(400).json({ message: 'Name and message required' });

  await db.query(
    'INSERT INTO contact_submissions (name,email,phone,message) VALUES (?,?,?,?)',
    [name, email || null, phone || null, message]
  );
  res.status(201).json({ message: 'Submitted successfully' });
};

exports.getAll = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
  res.json(rows);
};

exports.markRead = async (req, res) => {
  await db.query('UPDATE contact_submissions SET is_read=TRUE WHERE id=?', [req.params.id]);
  res.json({ message: 'Marked as read' });
};
