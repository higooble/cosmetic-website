const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, AlignmentType,
  BorderStyle, ShadingType, PageBreak, ImageRun,
  convertInchesToTwip,
} = require('docx');
const fs   = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, 'docs', 'testing', 'screenshots', 'stock-2026-05-10');

function getImg(filename) {
  const p = path.join(SCREENSHOTS_DIR, filename);
  return fs.existsSync(p) ? fs.readFileSync(p) : null;
}

// ── Colors ────────────────────────────────────────────────────────────────────
const BLUE  = '1E40AF';
const DARK  = '1F2937';
const MUTED = '6B7280';
const WHITE = 'FFFFFF';
const BORDER = 'E5E7EB';
const LIGHT = 'F9FAFB';

// ── Helpers ───────────────────────────────────────────────────────────────────
const font = 'Sarabun';

function h1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLUE } },
  });
}

function h2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 160 },
  });
}

function h3(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
  });
}

function body(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font, color: DARK })],
    spacing: { after: 120 },
  });
}

function bullet(text) {
  return new Paragraph({
    children: [new TextRun({ text: '• ' + text, size: 22, font, color: DARK })],
    spacing: { after: 80 },
    indent: { left: convertInchesToTwip(0.3) },
  });
}

function note(text) {
  return new Paragraph({
    children: [
      new TextRun({ text: 'หมายเหตุ: ', bold: true, size: 20, font, color: BLUE }),
      new TextRun({ text, size: 20, font, color: MUTED }),
    ],
    spacing: { after: 120, before: 80 },
    indent: { left: convertInchesToTwip(0.2) },
    shading: { type: ShadingType.CLEAR, fill: 'EFF6FF' },
  });
}

function img(filename, w, h) {
  const data = getImg(filename);
  if (!data) {
    return new Paragraph({
      children: [new TextRun({ text: '[ Screenshot: ' + filename + ' ]', size: 20, font, color: MUTED, italics: true })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 160 },
      border: {
        top:    { style: BorderStyle.DASHED, size: 2, color: BORDER },
        bottom: { style: BorderStyle.DASHED, size: 2, color: BORDER },
        left:   { style: BorderStyle.DASHED, size: 2, color: BORDER },
        right:  { style: BorderStyle.DASHED, size: 2, color: BORDER },
      },
    });
  }
  return new Paragraph({
    children: [new ImageRun({ data, transformation: { width: w || 480, height: h || 300 }, type: 'png' })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 160, after: 80 },
  });
}

function caption(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 18, font, color: MUTED, italics: true })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  });
}

function infoTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(([label, value]) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: 'EFF6FF' },
            children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, font, color: BLUE })] })],
          }),
          new TableCell({
            width: { size: 65, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, font, color: DARK })] })],
          }),
        ],
      })
    ),
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER } },
    spacing: { before: 200, after: 200 },
  });
}

// ── Document ──────────────────────────────────────────────────────────────────
const sections = [

  // Cover
  new Paragraph({
    children: [new TextRun({ text: 'Stock Pro', bold: true, size: 72, font, color: BLUE })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 1200, after: 200 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'คู่มือการใช้งานระบบจัดการคลังสินค้า', size: 36, font, color: DARK })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  }),
  new Paragraph({
    children: [new TextRun({ text: 'Warehouse Management System — User Manual', size: 26, font, color: MUTED })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
  }),
  infoTable([
    ['เวอร์ชัน',      '1.0.0'],
    ['วันที่จัดทำ',   '10 พฤษภาคม 2569'],
    ['URL ระบบ',      'https://stock-pro-warehouse-management-w4w7.vercel.app'],
    ['ผู้ดูแลระบบ',   'admin@test.com'],
    ['ภาษา',          'ภาษาไทย'],
  ]),
  pageBreak(),

  // 1. Introduction
  h1('1. ภาพรวมระบบ (System Overview)'),
  body('Stock Pro คือระบบจัดการคลังสินค้าออนไลน์ที่ช่วยให้ผู้ดูแลระบบสามารถติดตามสินค้า ลูกค้า ซัพพลายเออร์ และการเคลื่อนไหวของสินค้าเข้า-ออกได้อย่างมีประสิทธิภาพ'),
  new Paragraph({ spacing: { after: 160 } }),
  infoTable([
    ['หน้าหลัก (Dashboard)',      'แสดงสรุปข้อมูลสำคัญของระบบ'],
    ['สินค้า (Products)',          'จัดการรายการสินค้าในคลัง'],
    ['ลูกค้า (Customers)',         'จัดการข้อมูลลูกค้า'],
    ['ซัพพลายเออร์ (Suppliers)',   'จัดการข้อมูลผู้จัดจำหน่าย'],
    ['นำเข้าสินค้า (Inbound)',     'บันทึกสินค้าที่รับเข้าคลัง'],
    ['ส่งออกสินค้า (Outbound)',    'บันทึกสินค้าที่ออกจากคลัง'],
  ]),
  pageBreak(),

  // 2. Login
  h1('2. การเข้าสู่ระบบ (Login)'),
  body('เปิดเบราว์เซอร์และไปที่ URL: https://stock-pro-warehouse-management-w4w7.vercel.app/auth'),
  new Paragraph({ spacing: { after: 80 } }),
  img('01-login.png', 500, 320),
  caption('หน้าเข้าสู่ระบบ (Login Page)'),

  h2('ขั้นตอนการเข้าสู่ระบบ'),
  bullet('กรอก Email ในช่อง "name@company.com"'),
  bullet('กรอก Password ในช่องรหัสผ่าน'),
  bullet('กดปุ่ม "เข้าสู่ระบบ"'),
  bullet('ระบบจะนำไปยังหน้า Dashboard โดยอัตโนมัติ'),
  new Paragraph({ spacing: { after: 120 } }),
  note('หากลืมรหัสผ่าน กดปุ่ม "ลืมรหัสผ่าน?" ด้านบนปุ่มเข้าสู่ระบบ'),
  pageBreak(),

  // 3. Dashboard
  h1('3. หน้าหลัก (Dashboard)'),
  body('หน้าหลักแสดงสรุปข้อมูลสำคัญของระบบ ได้แก่ จำนวนสินค้า ลูกค้า ซัพพลายเออร์ และสินค้าเคลื่อนไหวประจำเดือน'),
  new Paragraph({ spacing: { after: 80 } }),
  img('02-dashboard.png', 500, 320),
  caption('หน้าหลัก (Dashboard)'),

  img('02-dashboard-full.png', 500, 400),
  caption('หน้าหลัก — แสดงผลเต็มหน้า'),

  h2('ข้อมูลที่แสดงบนหน้าหลัก'),
  bullet('สินค้าทั้งหมด — จำนวนสินค้าในระบบ'),
  bullet('ลูกค้าทั้งหมด — จำนวนลูกค้าที่ลงทะเบียน'),
  bullet('ซัพพลายเออร์ — จำนวนผู้จัดจำหน่าย'),
  bullet('สินค้าเข้า (เดือนนี้) — จำนวนสินค้าที่รับเข้าเดือนปัจจุบัน'),
  bullet('สินค้าออก (เดือนนี้) — จำนวนสินค้าที่ออกเดือนปัจจุบัน'),
  bullet('สต็อกใกล้หมด — สินค้าที่ปริมาณต่ำกว่าเกณฑ์'),
  pageBreak(),

  // 4. Products
  h1('4. จัดการสินค้า (Products)'),
  body('หน้าสินค้าแสดงรายการสินค้าทั้งหมดในคลัง พร้อมข้อมูลปริมาณและสถานะ'),
  new Paragraph({ spacing: { after: 80 } }),
  img('03-products.png', 500, 320),
  caption('หน้าจัดการสินค้า'),

  img('03-products-full.png', 500, 400),
  caption('รายการสินค้าทั้งหมด'),

  h2('การดูรายละเอียดสินค้า'),
  body('คลิกที่แถวสินค้าเพื่อดูข้อมูลรายละเอียด'),
  img('03-product-detail.png', 500, 320),
  caption('หน้ารายละเอียดสินค้า'),

  h2('ฟังก์ชันในหน้าสินค้า'),
  bullet('ดูรายการสินค้าทั้งหมด'),
  bullet('ค้นหาสินค้าด้วยชื่อหรือรหัส'),
  bullet('ดูปริมาณสต็อกปัจจุบัน'),
  bullet('ตรวจสอบสินค้าที่ใกล้หมด'),
  pageBreak(),

  // 5. Customers
  h1('5. จัดการลูกค้า (Customers)'),
  body('หน้าลูกค้าแสดงรายชื่อลูกค้าทั้งหมดพร้อมข้อมูลติดต่อ'),
  new Paragraph({ spacing: { after: 80 } }),
  img('04-customers.png', 500, 320),
  caption('หน้าจัดการลูกค้า'),

  img('04-customers-full.png', 500, 400),
  caption('รายการลูกค้าทั้งหมด'),

  h2('ฟังก์ชันในหน้าลูกค้า'),
  bullet('ดูรายชื่อลูกค้าทั้งหมด'),
  bullet('ค้นหาลูกค้าด้วยชื่อหรือข้อมูลติดต่อ'),
  bullet('เพิ่ม/แก้ไข/ลบข้อมูลลูกค้า'),
  pageBreak(),

  // 6. Suppliers
  h1('6. จัดการซัพพลายเออร์ (Suppliers)'),
  body('หน้าซัพพลายเออร์แสดงรายชื่อผู้จัดจำหน่ายสินค้าทั้งหมด'),
  new Paragraph({ spacing: { after: 80 } }),
  img('05-suppliers.png', 500, 320),
  caption('หน้าจัดการซัพพลายเออร์'),

  img('05-suppliers-full.png', 500, 400),
  caption('รายการซัพพลายเออร์ทั้งหมด'),

  h2('ฟังก์ชันในหน้าซัพพลายเออร์'),
  bullet('ดูรายชื่อซัพพลายเออร์ทั้งหมด'),
  bullet('ข้อมูลติดต่อผู้จัดจำหน่าย'),
  bullet('เพิ่ม/แก้ไข/ลบข้อมูลซัพพลายเออร์'),
  pageBreak(),

  // 7. Inbound
  h1('7. นำเข้าสินค้า (Inbound Products)'),
  body('หน้านำเข้าสินค้าใช้สำหรับบันทึกสินค้าที่รับเข้าคลัง'),
  new Paragraph({ spacing: { after: 80 } }),
  img('06-inbounds.png', 500, 320),
  caption('หน้านำเข้าสินค้า'),

  img('06-inbounds-full.png', 500, 400),
  caption('รายการนำเข้าสินค้า'),

  h2('ขั้นตอนการบันทึกสินค้าเข้า'),
  bullet('กดปุ่มเพิ่มรายการนำเข้า'),
  bullet('เลือกสินค้าและซัพพลายเออร์'),
  bullet('กรอกจำนวนที่รับเข้า'),
  bullet('บันทึกข้อมูล — ระบบจะอัปเดตสต็อกอัตโนมัติ'),
  pageBreak(),

  // 8. Outbound
  h1('8. ส่งออกสินค้า (Outbound Products)'),
  body('หน้าส่งออกสินค้าใช้สำหรับบันทึกสินค้าที่ออกจากคลัง'),
  new Paragraph({ spacing: { after: 80 } }),
  img('07-outbounds.png', 500, 320),
  caption('หน้าส่งออกสินค้า'),

  img('07-outbounds-full.png', 500, 400),
  caption('รายการส่งออกสินค้า'),

  h2('ขั้นตอนการบันทึกสินค้าออก'),
  bullet('กดปุ่มเพิ่มรายการส่งออก'),
  bullet('เลือกสินค้าและลูกค้า'),
  bullet('กรอกจำนวนที่ส่งออก'),
  bullet('บันทึกข้อมูล — ระบบจะหักสต็อกอัตโนมัติ'),
  pageBreak(),

  // 9. Mobile
  h1('9. การใช้งานบนมือถือ (Mobile)'),
  body('ระบบรองรับการใช้งานบนอุปกรณ์มือถือและแท็บเล็ต'),
  new Paragraph({ spacing: { after: 80 } }),
  img('08-mobile-dashboard.png', 300, 480),
  caption('หน้าหลักบนมือถือ (375px)'),

  img('08-mobile-products.png', 300, 480),
  caption('หน้าสินค้าบนมือถือ'),
  pageBreak(),

  // 10. Quick Reference
  h1('10. ข้อมูลอ้างอิงด่วน (Quick Reference)'),
  h2('URL ของระบบ'),
  infoTable([
    ['เข้าสู่ระบบ',      'https://stock-pro-warehouse-management-w4w7.vercel.app/auth'],
    ['หน้าหลัก',         'https://stock-pro-warehouse-management-w4w7.vercel.app/dashboard'],
    ['สินค้า',           'https://stock-pro-warehouse-management-w4w7.vercel.app/products'],
    ['ลูกค้า',           'https://stock-pro-warehouse-management-w4w7.vercel.app/customers'],
    ['ซัพพลายเออร์',     'https://stock-pro-warehouse-management-w4w7.vercel.app/suppliers'],
    ['นำเข้าสินค้า',     'https://stock-pro-warehouse-management-w4w7.vercel.app/inbounds-products'],
    ['ส่งออกสินค้า',     'https://stock-pro-warehouse-management-w4w7.vercel.app/outbounds-products'],
  ]),
  new Paragraph({ spacing: { after: 240 } }),
  h2('เบราว์เซอร์ที่รองรับ'),
  bullet('Google Chrome (แนะนำ)'),
  bullet('Mozilla Firefox'),
  bullet('Microsoft Edge'),
  bullet('Safari (iOS/macOS)'),
];

const doc = new Document({
  sections: [{ properties: {}, children: sections }],
  styles: {
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', run: { bold: true, size: 32, color: BLUE, font } },
      { id: 'Heading2', name: 'Heading 2', run: { bold: true, size: 26, color: DARK, font } },
      { id: 'Heading3', name: 'Heading 3', run: { bold: true, size: 22, color: DARK, font } },
    ],
  },
});

Packer.toBuffer(doc).then(buf => {
  const out = path.join(__dirname, 'docs', 'Stock_Pro_User_Manual.docx');
  fs.writeFileSync(out, buf);
  console.log('Generated: ' + out);
}).catch(e => console.error('Error:', e.message));
