const db = require('../config/db');

exports.getAll = async (req, res) => {
  const isAdmin    = !!req.admin;
  const conditions = isAdmin ? [] : ['p.is_active = TRUE'];
  if (req.query.category_id) conditions.push(`p.category_id = ${db.escape(req.query.category_id)}`);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [products] = await db.query(
    `SELECT p.*, c.name_th AS category_name_th, c.name_en AS category_name_en
     FROM products p LEFT JOIN categories c ON p.category_id = c.id
     ${where} ORDER BY p.sort_order ASC`
  );
  const ids = products.map(p => p.id);
  if (!ids.length) return res.json([]);

  const [images] = await db.query(
    `SELECT * FROM product_images WHERE product_id IN (?) ORDER BY sort_order ASC`,
    [ids]
  );
  const imageMap = {};
  images.forEach(img => {
    if (!imageMap[img.product_id]) imageMap[img.product_id] = [];
    imageMap[img.product_id].push(img);
  });
  products.forEach(p => { p.images = imageMap[p.id] || []; });
  res.json(products);
};

exports.getOne = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM products WHERE id=?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: 'Not found' });
  const [images] = await db.query(
    'SELECT * FROM product_images WHERE product_id=? ORDER BY sort_order ASC',
    [req.params.id]
  );
  res.json({ ...rows[0], images });
};

exports.create = async (req, res) => {
  const { category_id, name_th, name_en, description_th, description_en,
          ingredients_th, ingredients_en, usage_th, usage_en, price, sort_order } = req.body;

  const [result] = await db.query(
    `INSERT INTO products
     (category_id,name_th,name_en,description_th,description_en,
      ingredients_th,ingredients_en,usage_th,usage_en,price,sort_order)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [category_id, name_th, name_en, description_th, description_en,
     ingredients_th, ingredients_en, usage_th, usage_en, price || null, sort_order || 0]
  );

  const productId = result.insertId;
  if (req.files && req.files.length) {
    const imageRows = req.files.map((f, i) => [productId, `/uploads/${f.filename}`, i === 0, i]);
    await db.query('INSERT INTO product_images (product_id,image_url,is_primary,sort_order) VALUES ?', [imageRows]);
  }
  res.status(201).json({ id: productId });
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { category_id, name_th, name_en, description_th, description_en,
          ingredients_th, ingredients_en, usage_th, usage_en, price, sort_order, is_active } = req.body;

  await db.query(
    `UPDATE products SET category_id=?,name_th=?,name_en=?,description_th=?,description_en=?,
     ingredients_th=?,ingredients_en=?,usage_th=?,usage_en=?,price=?,sort_order=?,is_active=? WHERE id=?`,
    [category_id, name_th, name_en, description_th, description_en,
     ingredients_th, ingredients_en, usage_th, usage_en, price || null, sort_order, is_active, id]
  );

  if (req.files && req.files.length) {
    const [existing] = await db.query('SELECT COUNT(*) AS cnt FROM product_images WHERE product_id=?', [id]);
    const offset = existing[0].cnt;
    const imageRows = req.files.map((f, i) => [id, `/uploads/${f.filename}`, false, offset + i]);
    await db.query('INSERT INTO product_images (product_id,image_url,is_primary,sort_order) VALUES ?', [imageRows]);
  }
  res.json({ message: 'Updated' });
};

exports.remove = async (req, res) => {
  await db.query('DELETE FROM products WHERE id=?', [req.params.id]);
  res.json({ message: 'Deleted' });
};

exports.removeImage = async (req, res) => {
  await db.query('DELETE FROM product_images WHERE id=?', [req.params.imageId]);
  res.json({ message: 'Image deleted' });
};
