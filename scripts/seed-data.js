/**
 * Seed test data: banners, categories, products with generated images.
 * Run before capture-screenshots.js
 */
const axios    = require('axios');
const FormData = require('form-data');
const Jimp     = require('jimp');
const fs       = require('fs');
const path     = require('path');

const API  = 'http://localhost:3000';
const TMP  = path.join(__dirname, '../.tmp-images');

fs.mkdirSync(TMP, { recursive: true });

// ── Colour palette ────────────────────────────────────────────────────────────
const COLOURS = [
  { r: 201, g: 150, b: 122, label: 'rose'   },
  { r: 200, g: 169, b: 110, label: 'gold'   },
  { r: 180, g: 130, b: 150, label: 'mauve'  },
  { r: 160, g: 140, b: 110, label: 'nude'   },
  { r: 140, g: 175, b: 140, label: 'sage'   },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
async function makeImage(filename, w, h, colour, text) {
  const { Jimp: J, loadFont, HorizontalAlign, VerticalAlign } = require('jimp');
  const imgPath = path.join(TMP, filename);

  const hex = (colour.r << 24 | colour.g << 16 | colour.b << 8 | 0xff) >>> 0;
  const img = new J({ width: w, height: h, color: hex });
  await img.write(imgPath);
  return imgPath;
}

async function login() {
  const { data } = await axios.post(`${API}/api/admin/login`, {
    username: 'admin',
    password: 'admin1234',
  });
  return data.token;
}

async function postForm(token, endpoint, fields, filePaths = []) {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => fd.append(k, String(v)));
  filePaths.forEach(({ field, p }) => fd.append(field, fs.createReadStream(p)));
  const { data } = await axios.post(`${API}${endpoint}`, fd, {
    headers: { ...fd.getHeaders(), Authorization: `Bearer ${token}` },
  });
  return data;
}

// ── Check existing data ───────────────────────────────────────────────────────
async function hasData(token, path) {
  const { data } = await axios.get(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.length > 0;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱  Starting data seed...');
  let token;
  try {
    token = await login();
    console.log('   ✓ Admin login OK');
  } catch {
    console.error('   ✗ Cannot login. Is the backend running on port 3000?');
    process.exit(1);
  }

  // ── Banners ─────────────────────────────────────────────────────────────────
  if (await hasData(token, '/api/admin/banners')) {
    console.log('   ℹ Banners already exist — skipping');
  } else {
    const bannerData = [
      { title_th: 'ความงามที่แท้จริง',   title_en: 'True Natural Beauty',     subtitle_th: 'ค้นพบผลิตภัณฑ์ที่เหมาะกับคุณ', subtitle_en: 'Discover products made for you',     colour: COLOURS[0] },
      { title_th: 'บำรุงผิวด้วยธรรมชาติ', title_en: 'Nourished by Nature',      subtitle_th: 'สูตรธรรมชาติ ปลอดภัยสำหรับทุกผิว',  subtitle_en: 'Natural formula, safe for all skin', colour: COLOURS[1] },
    ];
    for (let i = 0; i < bannerData.length; i++) {
      const b = bannerData[i];
      const img = await makeImage(`banner${i + 1}.png`, 1200, 500, b.colour);
      await postForm(token, '/api/admin/banners', {
        title_th: b.title_th, title_en: b.title_en,
        subtitle_th: b.subtitle_th, subtitle_en: b.subtitle_en,
        sort_order: i, is_active: 'true',
      }, [{ field: 'image', p: img }]);
      console.log(`   ✓ Banner ${i + 1} created`);
    }
  }

  // ── Categories ───────────────────────────────────────────────────────────────
  let catIds = {};
  if (await hasData(token, '/api/admin/categories')) {
    console.log('   ℹ Categories already exist — skipping');
    const { data } = await axios.get(`${API}/api/categories`);
    data.forEach(c => { catIds[c.name_en] = c.id; });
  } else {
    const cats = [
      { name_th: 'ดูแลผิวหน้า', name_en: 'Face Care',  slug: 'face-care',  sort_order: 0 },
      { name_th: 'ลิปสติก',     name_en: 'Lip Color',  slug: 'lip-color',  sort_order: 1 },
      { name_th: 'บำรุงผิวกาย', name_en: 'Body Care',  slug: 'body-care',  sort_order: 2 },
    ];
    for (const c of cats) {
      const res = await axios.post(`${API}/api/admin/categories`, c, {
        headers: { Authorization: `Bearer ${token}` },
      });
      catIds[c.name_en] = res.data.id;
      console.log(`   ✓ Category "${c.name_en}" created`);
    }
  }

  // ── Products ─────────────────────────────────────────────────────────────────
  if (await hasData(token, '/api/admin/products')) {
    console.log('   ℹ Products already exist — skipping');
  } else {
    const products = [
      {
        name_th: 'เซรั่มกุหลาบ Rose Gold', name_en: 'Rose Gold Serum',
        description_th: 'เซรั่มบำรุงผิวหน้าสูตรเข้มข้น ด้วยสารสกัดจากกุหลาบ ช่วยให้ผิวกระจ่างใส',
        description_en: 'Intensive face serum with rose extract. Brightens and hydrates skin deeply.',
        ingredients_th: 'Rose Extract, Hyaluronic Acid, Vitamin C, Aloe Vera',
        ingredients_en: 'Rose Extract, Hyaluronic Acid, Vitamin C, Aloe Vera',
        usage_th: 'ทาบางๆ บนผิวหน้าที่สะอาด หลังล้างหน้า เช้าและเย็น',
        usage_en: 'Apply a thin layer on clean face, morning and evening.',
        price: '890', category: 'Face Care', colour: COLOURS[0], sort_order: 0,
      },
      {
        name_th: 'ครีมทองคำ Gold Glow',   name_en: 'Gold Glow Cream',
        description_th: 'ครีมบำรุงผิวหน้าผสมทองคำ 24K ช่วยฟื้นฟูและกระชับผิว',
        description_en: 'Face cream with 24K gold particles. Firms and revitalises tired skin.',
        ingredients_th: '24K Gold, Collagen, Retinol, Vitamin E',
        ingredients_en: '24K Gold, Collagen, Retinol, Vitamin E',
        usage_th: 'ทาในตอนเย็นหลังทำความสะอาดผิว นวดเบาๆ จนซึมเข้าผิว',
        usage_en: 'Apply at night after cleansing. Massage gently until absorbed.',
        price: '1290', category: 'Face Care', colour: COLOURS[1], sort_order: 1,
      },
      {
        name_th: 'ลิปสติก Rose Petal',    name_en: 'Rose Petal Lipstick',
        description_th: 'ลิปสติกเนื้อแมตต์ ให้ความชุ่มชื้นสูง ติดทนนาน 12 ชั่วโมง',
        description_en: 'Matte lipstick with long-lasting formula. Stays vibrant for 12 hours.',
        ingredients_th: 'Beeswax, Vitamin E, Rose Oil, Castor Oil',
        ingredients_en: 'Beeswax, Vitamin E, Rose Oil, Castor Oil',
        usage_th: 'ทาตรงๆ บนริมฝีปาก สามารถทาทับได้เพื่อเพิ่มความเข้ม',
        usage_en: 'Apply directly to lips. Layer for more intensity.',
        price: '490', category: 'Lip Color', colour: COLOURS[2], sort_order: 0,
      },
      {
        name_th: 'โลชั่นบำรุงผิวกาย Body Glow', name_en: 'Body Glow Lotion',
        description_th: 'โลชั่นบำรุงผิวกาย ให้ความชุ่มชื้นตลอดวัน กลิ่นหอมอ่อนๆ',
        description_en: 'Body lotion for all-day hydration. Light and delicate fragrance.',
        ingredients_th: 'Shea Butter, Jojoba Oil, Vitamin E, Lavender Extract',
        ingredients_en: 'Shea Butter, Jojoba Oil, Vitamin E, Lavender Extract',
        usage_th: 'ทาทั่วร่างกายหลังอาบน้ำ นวดเบาๆ จนซึมเข้าผิว',
        usage_en: 'Apply all over body after shower. Massage gently.',
        price: null, category: 'Body Care', colour: COLOURS[4], sort_order: 0,
      },
    ];

    for (const p of products) {
      // Create 2 images per product (primary + secondary)
      const img1 = await makeImage(`prod_${p.name_en.replace(/\s/g,'_')}_1.png`, 600, 600, p.colour);
      const img2 = await makeImage(`prod_${p.name_en.replace(/\s/g,'_')}_2.png`, 600, 600, { r: p.colour.r - 20, g: p.colour.g - 20, b: p.colour.b - 20 });

      const fields = {
        category_id: catIds[p.category] || '',
        name_th: p.name_th, name_en: p.name_en,
        description_th: p.description_th, description_en: p.description_en,
        ingredients_th: p.ingredients_th, ingredients_en: p.ingredients_en,
        usage_th: p.usage_th, usage_en: p.usage_en,
        sort_order: p.sort_order, is_active: 'true',
      };
      if (p.price) fields.price = p.price;

      await postForm(token, '/api/admin/products', fields, [
        { field: 'images', p: img1 },
        { field: 'images', p: img2 },
      ]);
      console.log(`   ✓ Product "${p.name_en}" created`);
    }
  }

  // ── Submit a sample contact ──────────────────────────────────────────────────
  try {
    await axios.post(`${API}/api/contact`, {
      name: 'สมใจ ใจดี', email: 'somjai@example.com',
      phone: '0812345678', message: 'สนใจสินค้า Rose Gold Serum ขอข้อมูลเพิ่มเติมได้ไหมคะ',
    });
    console.log('   ✓ Sample contact submitted');
  } catch { /* already exists or not needed */ }

  // ── Cleanup tmp ───────────────────────────────────────────────────────────────
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log('✅  Seed complete!');
}

seed().catch(e => { console.error('Seed error:', e.message); process.exit(1); });
