const db   = require('../config/db');
const path = require('path');
const fs   = require('fs');

exports.get = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM site_settings WHERE id = 1');
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {
      company_name_th, company_name_en,
      line_oa_url, facebook_url, instagram_url, tiktok_url,
      footer_text_th, footer_text_en,
    } = req.body;

    let logo_url = req.body.logo_url ?? null;

    if (req.file) {
      const [current] = await db.query('SELECT logo_url FROM site_settings WHERE id = 1');
      const oldUrl = current[0]?.logo_url;
      if (oldUrl) {
        const oldPath = path.join(__dirname, '../../uploads', path.basename(oldUrl));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      logo_url = `/uploads/${req.file.filename}`;
    }

    await db.query(
      `INSERT INTO site_settings
         (id, company_name_th, company_name_en, logo_url,
          line_oa_url, facebook_url, instagram_url, tiktok_url,
          footer_text_th, footer_text_en)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         company_name_th = VALUES(company_name_th),
         company_name_en = VALUES(company_name_en),
         logo_url        = VALUES(logo_url),
         line_oa_url     = VALUES(line_oa_url),
         facebook_url    = VALUES(facebook_url),
         instagram_url   = VALUES(instagram_url),
         tiktok_url      = VALUES(tiktok_url),
         footer_text_th  = VALUES(footer_text_th),
         footer_text_en  = VALUES(footer_text_en)`,
      [company_name_th, company_name_en, logo_url,
       line_oa_url, facebook_url, instagram_url, tiktok_url,
       footer_text_th, footer_text_en]
    );

    const [updated] = await db.query('SELECT * FROM site_settings WHERE id = 1');
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
