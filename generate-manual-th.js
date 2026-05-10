const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, AlignmentType,
  BorderStyle, ShadingType, PageBreak,
  convertInchesToTwip, Header, Footer,
  PageNumber, ImageRun,
} = require('docx');
const fs   = require('fs');
const path = require('path');

// ─── Screenshot resolver ──────────────────────────────────────────────────────
const TODAY           = new Date().toISOString().split('T')[0];
const SCREENSHOTS_DIR = path.join(__dirname, 'docs', 'testing', 'screenshots', TODAY);

function getScreenshot(filename) {
  const p = path.join(SCREENSHOTS_DIR, filename);
  return fs.existsSync(p) ? fs.readFileSync(p) : null;
}

// ─── สี (Colors) ──────────────────────────────────────────────────────────────
const ROSE   = 'C9967A';
const GOLD   = 'C8A96E';
const DARK   = '2C2C2C';
const MUTED  = '9A8F8A';
const WHITE  = 'FFFFFF';
const BORDER = 'E8DDD9';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function h1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ROSE } },
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
    children: [new TextRun({ text, size: 22, font: 'Sarabun', color: DARK })],
    spacing: { after: 120 },
  });
}

function bullet(text) {
  return new Paragraph({
    children: [new TextRun({ text: `• ${text}`, size: 22, font: 'Sarabun', color: DARK })],
    spacing: { after: 80 },
    indent: { left: convertInchesToTwip(0.3) },
  });
}

function note(text) {
  return new Paragraph({
    children: [
      new TextRun({ text: '📌 หมายเหตุ: ', bold: true, size: 20, font: 'Sarabun', color: ROSE }),
      new TextRun({ text, size: 20, font: 'Sarabun', color: MUTED }),
    ],
    spacing: { after: 120, before: 80 },
    indent: { left: convertInchesToTwip(0.2) },
    shading: { type: ShadingType.CLEAR, fill: 'FFF8F5' },
  });
}

function screenshotPlaceholder(label) {
  const filename = label.split(' ')[0];
  const imgData  = getScreenshot(filename);

  if (imgData) {
    return new Paragraph({
      children: [
        new ImageRun({
          data: imgData,
          transformation: { width: 480, height: 300 },
          type: 'png',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 80 },
    });
  }

  return new Paragraph({
    children: [
      new TextRun({
        text: `[ ภาพหน้าจอ: ${label} ]`,
        size: 20, font: 'Sarabun', color: MUTED, italics: true,
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 160, after: 160 },
    border: {
      top:    { style: BorderStyle.DASHED, size: 2, color: BORDER },
      bottom: { style: BorderStyle.DASHED, size: 2, color: BORDER },
      left:   { style: BorderStyle.DASHED, size: 2, color: BORDER },
      right:  { style: BorderStyle.DASHED, size: 2, color: BORDER },
    },
    shading: { type: ShadingType.CLEAR, fill: 'FAFAFA' },
  });
}

function caption(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 18, font: 'Sarabun', color: MUTED, italics: true })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 40, after: 160 },
  });
}

function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER } },
    spacing: { before: 200, after: 200 },
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function infoTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(([label, value]) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 32, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: 'F5EDE8' },
            children: [new Paragraph({
              children: [new TextRun({ text: label, bold: true, size: 20, font: 'Sarabun', color: ROSE })],
            })],
          }),
          new TableCell({
            width: { size: 68, type: WidthType.PERCENTAGE },
            children: [new Paragraph({
              children: [new TextRun({ text: value, size: 20, font: 'Sarabun', color: DARK })],
            })],
          }),
        ],
      })
    ),
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
  });
}

function stepTable(steps) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: ['ขั้นตอน', 'การดำเนินการ', 'ผลลัพธ์ที่คาดหวัง'].map(h =>
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: ROSE },
            children: [new Paragraph({
              children: [new TextRun({ text: h, bold: true, size: 20, font: 'Sarabun', color: WHITE })],
              alignment: AlignmentType.CENTER,
            })],
          })
        ),
      }),
      ...steps.map(([step, action, result], i) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 8, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? WHITE : 'FDF9F7' },
              children: [new Paragraph({
                children: [new TextRun({ text: String(step), bold: true, size: 20, font: 'Sarabun', color: ROSE })],
                alignment: AlignmentType.CENTER,
              })],
            }),
            new TableCell({
              width: { size: 46, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? WHITE : 'FDF9F7' },
              children: [new Paragraph({
                children: [new TextRun({ text: action, size: 20, font: 'Sarabun', color: DARK })],
              })],
            }),
            new TableCell({
              width: { size: 46, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? WHITE : 'FDF9F7' },
              children: [new Paragraph({
                children: [new TextRun({ text: result, size: 20, font: 'Sarabun', color: DARK })],
              })],
            }),
          ],
        })
      ),
    ],
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
  });
}

// ─── หน้าปก (Cover Page) ──────────────────────────────────────────────────────
function coverPage() {
  return [
    new Paragraph({ spacing: { before: 1200 } }),
    new Paragraph({
      children: [new TextRun({ text: '✦  คอสเมติก', size: 64, bold: true, font: 'Sarabun', color: ROSE })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'คู่มือการใช้งาน', size: 44, font: 'Sarabun', color: GOLD, characterSpacing: 100 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'USER MANUAL', size: 28, font: 'Sarabun', color: MUTED, characterSpacing: 200 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    divider(),
    new Paragraph({ spacing: { after: 120 } }),
    infoTable([
      ['เวอร์ชัน',          '1.0.0'],
      ['วันที่จัดทำ',        '1 พฤษภาคม 2569'],
      ['จัดทำโดย',          'ทีมพัฒนา'],
      ['ประเภทเอกสาร',      'คู่มือการใช้งาน — เว็บไซต์สาธารณะและแผงผู้ดูแลระบบ'],
    ]),
    pageBreak(),
  ];
}

// ─── สารบัญ (Table of Contents placeholder) ──────────────────────────────────
function tableOfContents() {
  return [
    h1('สารบัญ'),
    infoTable([
      ['1.  บทนำ',                                '3'],
      ['2.  เว็บไซต์สาธารณะ',                    '4'],
      ['    2.1  แถบนำทาง',                       '4'],
      ['    2.2  ปุ่มเปลี่ยนภาษา',               '4'],
      ['    2.3  แบนเนอร์สไลด์',                 '5'],
      ['    2.4  ตัวกรองหมวดหมู่',               '5'],
      ['    2.5  ตารางสินค้า',                    '6'],
      ['    2.6  หน้าต่างรายละเอียดสินค้า',      '6'],
      ['    2.7  แบบฟอร์มติดต่อ',                '7'],
      ['    2.8  ส่วนท้ายหน้า',                  '7'],
      ['3.  แผงผู้ดูแลระบบ',                     '8'],
      ['    3.1  เข้าสู่ระบบ',                   '8'],
      ['    3.2  แถบด้านข้าง',                   '8'],
      ['    3.3  จัดการแบนเนอร์',               '9'],
      ['    3.4  จัดการหมวดหมู่',               '10'],
      ['    3.5  จัดการสินค้า',                  '10'],
      ['    3.6  ข้อความติดต่อ',                '12'],
      ['4.  การแก้ไขปัญหาเบื้องต้น',            '13'],
      ['5.  ข้อมูลอ้างอิงด่วน',                 '14'],
    ]),
    pageBreak(),
  ];
}

// ─── เนื้อหาเอกสาร (Document Sections) ──────────────────────────────────────
const sections = [

  // ── 1. บทนำ ──────────────────────────────────────────────────────────────
  h1('1. บทนำ'),
  body('คู่มือนี้อธิบายวิธีการใช้งานเว็บไซต์คอสเมติก ครอบคลุมทั้งหน้าเว็บไซต์สาธารณะที่ลูกค้าใช้งาน และแผงผู้ดูแลระบบสำหรับเจ้าหน้าที่จัดการเนื้อหา'),
  new Paragraph({ spacing: { after: 160 } }),
  infoTable([
    ['ที่อยู่เว็บไซต์',        'https://cosmetic-website-six.vercel.app/'],
    ['ที่อยู่แผงผู้ดูแล',      'https://cosmetic-website-six.vercel.app/admin/login'],
    ['ภาษาที่รองรับ',          'ภาษาไทย (TH) / ภาษาอังกฤษ (EN)'],
    ['เบราว์เซอร์ที่รองรับ',   'Chrome, Firefox, Edge (เวอร์ชันล่าสุด)'],
  ]),
  pageBreak(),

  // ── 2. เว็บไซต์สาธารณะ ───────────────────────────────────────────────────
  h1('2. เว็บไซต์สาธารณะ'),
  body('เว็บไซต์เป็นแบบหน้าเดียว (Single Page) ทุกเนื้อหาอยู่ในหน้าเดียวกัน ใช้แถบนำทางเพื่อเลื่อนไปยังแต่ละส่วน'),

  // 2.1 แถบนำทาง
  h2('2.1  แถบนำทาง'),
  screenshotPlaceholder('TC-01-01.png — แถบนำทางด้านบน'),
  caption('รูปที่ 1: แถบนำทางด้านบนของเว็บไซต์'),
  body('แถบนำทางจะอยู่ที่ด้านบนสุดของหน้าจอตลอดเวลาขณะเลื่อนหน้า ประกอบด้วย:'),
  bullet('ชื่อแบรนด์ (ด้านซ้าย)'),
  bullet('ลิงก์เมนู: หน้าแรก, หมวดหมู่, สินค้า, ติดต่อเรา'),
  bullet('ปุ่มเปลี่ยนภาษา (ด้านขวา)'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'คลิกลิงก์เมนูใดก็ได้ เช่น "สินค้า"',      'หน้าจอเลื่อนไปยังส่วนสินค้าอย่างราบรื่น'],
    [2, 'เลื่อนหน้าลงมา',                            'แถบนำทางเปลี่ยนเป็นพื้นหลังสีขาวและมีเงา'],
    [3, 'คลิก "หน้าแรก"',                            'หน้าจอเลื่อนกลับขึ้นไปด้านบน'],
  ]),
  screenshotPlaceholder('TC-01-02.png — แถบนำทางหลังเลื่อนหน้า'),
  caption('รูปที่ 2: แถบนำทางเมื่อเลื่อนหน้าลงมา'),

  // 2.2 ปุ่มเปลี่ยนภาษา
  h2('2.2  ปุ่มเปลี่ยนภาษา'),
  screenshotPlaceholder('TC-02-01.png — ปุ่มเปลี่ยนภาษา'),
  caption('รูปที่ 3: ปุ่มเปลี่ยนภาษาที่แถบนำทาง'),
  body('เว็บไซต์รองรับ 2 ภาษา คือ ภาษาไทย และภาษาอังกฤษ ปุ่มเปลี่ยนภาษาอยู่ที่มุมขวาของแถบนำทาง'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'สังเกตปุ่มภาษา (แสดง "EN" เมื่อเว็บเป็นภาษาไทย)', 'ปุ่มแสดงผลที่แถบนำทาง'],
    [2, 'คลิกปุ่ม',                                           'ข้อความทั้งหมดเปลี่ยนเป็นภาษาอังกฤษ ปุ่มแสดง "TH"'],
    [3, 'โหลดหน้าใหม่',                                      'ภาษายังคงเป็นภาษาอังกฤษ (บันทึกไว้ในเบราว์เซอร์)'],
    [4, 'คลิกปุ่มอีกครั้ง',                                  'ข้อความเปลี่ยนกลับเป็นภาษาไทย'],
  ]),
  screenshotPlaceholder('TC-02-02.png — เว็บไซต์ภาษาอังกฤษ'),
  caption('รูปที่ 4: เว็บไซต์หลังจากเปลี่ยนเป็นภาษาอังกฤษ'),
  note('ความพึงพอใจในภาษาจะถูกบันทึกในเบราว์เซอร์ ครั้งถัดไปที่เข้าชมจะแสดงภาษาเดิม'),

  // 2.3 แบนเนอร์สไลด์
  h2('2.3  แบนเนอร์สไลด์'),
  screenshotPlaceholder('TC-03-01.png — แบนเนอร์หน้าแรก'),
  caption('รูปที่ 5: แบนเนอร์สไลด์ที่ด้านบนของหน้า'),
  body('แบนเนอร์เป็นภาพสไลด์แบบเต็มหน้าจอที่ด้านบนของเว็บไซต์ เลื่อนอัตโนมัติทุก 4-5 วินาที'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'โหลดหน้าแรก',                         'ภาพแบนเนอร์แรกปรากฏพร้อมข้อความ'],
    [2, 'รอ 4-5 วินาที',                        'สไลด์เลื่อนไปยังภาพถัดไปอัตโนมัติ'],
    [3, 'คลิกลูกศรขวา (›)',                     'เลื่อนไปยังสไลด์ถัดไป'],
    [4, 'คลิกลูกศรซ้าย (‹)',                    'ย้อนกลับไปสไลด์ก่อนหน้า'],
    [5, 'คลิกจุดด้านล่าง',                      'กระโดดไปยังแบนเนอร์ที่ต้องการ'],
    [6, 'คลิกปุ่ม "ช้อปเลย"',                   'หน้าจอเลื่อนไปยังส่วนสินค้า'],
  ]),
  screenshotPlaceholder('TC-03-02.png — สไลด์ที่สอง'),
  caption('รูปที่ 6: แบนเนอร์เลื่อนไปยังสไลด์ถัดไป'),

  // 2.4 ตัวกรองหมวดหมู่
  h2('2.4  ตัวกรองหมวดหมู่'),
  screenshotPlaceholder('TC-04-01.png — ปุ่มหมวดหมู่'),
  caption('รูปที่ 7: ปุ่มหมวดหมู่สินค้า'),
  body('ส่วนหมวดหมู่แสดงปุ่มกรองสินค้า คลิกหมวดหมู่ที่ต้องการเพื่อกรองสินค้าด้านล่าง'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'เลื่อนไปยังส่วนหมวดหมู่',                    'ปุ่มหมวดหมู่ทั้งหมดแสดงขึ้น รวมถึงปุ่ม "ทั้งหมด"'],
    [2, 'คลิกหมวดหมู่ใดก็ได้ เช่น "ดูแลผิวหน้า"',     'ตารางสินค้าอัปเดตแสดงเฉพาะสินค้าในหมวดนั้น'],
    [3, 'คลิก "ทั้งหมด"',                              'สินค้าทั้งหมดแสดงขึ้นอีกครั้ง'],
    [4, 'หมวดหมู่ที่เลือก',                             'ปุ่มที่เลือกเปลี่ยนเป็นสีโรสโกลด์'],
  ]),
  screenshotPlaceholder('TC-04-02.png — หมวดหมู่ที่เลือก'),
  caption('รูปที่ 8: สินค้าที่กรองตามหมวดหมู่ที่เลือก'),

  // 2.5 ตารางสินค้า
  h2('2.5  ตารางสินค้า'),
  screenshotPlaceholder('TC-05-01.png — ตารางสินค้าทั้งหมด'),
  caption('รูปที่ 9: ตารางสินค้าแบบ Grid'),
  body('สินค้าแสดงในรูปแบบตาราง แต่ละการ์ดแสดงรูปภาพ ชื่อสินค้า และราคา (ถ้ามี)'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'เลื่อนไปยังส่วนสินค้า',      'สินค้าแสดงในรูปแบบตาราง'],
    [2, 'วางเมาส์บนการ์ดสินค้า',      'การ์ดยกตัวขึ้นพร้อมเงา'],
    [3, 'คลิกการ์ดสินค้าใดก็ได้',     'หน้าต่างรายละเอียดสินค้าเปิดขึ้น'],
  ]),
  screenshotPlaceholder('TC-05-02.png — การ์ดสินค้า'),
  caption('รูปที่ 10: การ์ดสินค้าแสดงภาพ ชื่อ และราคา'),

  // 2.6 หน้าต่างรายละเอียดสินค้า
  h2('2.6  หน้าต่างรายละเอียดสินค้า'),
  screenshotPlaceholder('TC-06-01.png — หน้าต่างสินค้าเปิด'),
  caption('รูปที่ 11: หน้าต่าง Popup รายละเอียดสินค้า'),
  body('คลิกสินค้าเพื่อเปิดหน้าต่างรายละเอียดที่แสดงรูปภาพ Gallery และข้อมูลสินค้าครบถ้วน'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'คลิกการ์ดสินค้า',                      'หน้าต่างเปิดขึ้น ด้านซ้ายเป็นรูปภาพ ด้านขวาเป็นข้อมูล'],
    [2, 'คลิกลูกศรในส่วนรูปภาพ',               'เปลี่ยนรูปภาพสินค้า'],
    [3, 'คลิกรูปภาพขนาดเล็กด้านล่าง',           'รูปภาพหลักเปลี่ยนตาม'],
    [4, 'อ่านรายละเอียดสินค้า',                 'ชื่อ ราคา คำอธิบาย ส่วนประกอบ และวิธีใช้'],
    [5, 'คลิกพื้นที่สีดำด้านนอก',               'หน้าต่างปิด'],
    [6, 'คลิกปุ่ม ✕ มุมบนขวา',                 'หน้าต่างปิด'],
  ]),
  screenshotPlaceholder('TC-06-02.png — รายละเอียดสินค้าพร้อม Gallery'),
  caption('รูปที่ 12: หน้าต่างรายละเอียดสินค้าพร้อมภาพ Gallery'),
  note('ข้อความสินค้า (ชื่อ คำอธิบาย) จะแสดงตามภาษาที่เลือกไว้ในขณะนั้น'),

  // 2.7 แบบฟอร์มติดต่อ
  h2('2.7  แบบฟอร์มติดต่อ'),
  screenshotPlaceholder('TC-07-01.png — แบบฟอร์มติดต่อ'),
  caption('รูปที่ 13: แบบฟอร์มติดต่อ'),
  body('ใช้แบบฟอร์มนี้เพื่อส่งข้อความหาทีมงาน ช่อง ชื่อ และ ข้อความ เป็นช่องบังคับ'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'เลื่อนไปยังส่วนติดต่อเรา',                    'แบบฟอร์มปรากฏพร้อมช่องกรอกข้อมูล'],
    [2, 'กรอกชื่อ (บังคับ)',                            'พิมพ์ชื่อในช่อง'],
    [3, 'กรอกอีเมล (ไม่บังคับ)',                        'พิมพ์อีเมลในช่อง'],
    [4, 'กรอกเบอร์โทร (ไม่บังคับ)',                     'พิมพ์เบอร์โทรในช่อง'],
    [5, 'กรอกข้อความ (บังคับ)',                         'พิมพ์ข้อความที่ต้องการ'],
    [6, 'คลิก "ส่งข้อความ"',                            'ข้อความสำเร็จสีเขียวปรากฏ แบบฟอร์มถูกล้าง'],
    [7, 'คลิก "แชทผ่าน LINE"',                          'เปิด LINE Official Account'],
  ]),
  screenshotPlaceholder('TC-07-04.png — ส่งข้อความสำเร็จ'),
  caption('รูปที่ 14: ข้อความแจ้งส่งสำเร็จ'),
  note('หากเห็นข้อความแสดงข้อผิดพลาดสีแดง อาจเกิดจากเซิร์ฟเวอร์ไม่ทำงาน กรุณาติดต่อผู้ดูแลระบบ'),

  // 2.8 ส่วนท้ายหน้า
  h2('2.8  ส่วนท้ายหน้า'),
  screenshotPlaceholder('TC-08-01.png — ส่วนท้ายหน้า'),
  caption('รูปที่ 15: ส่วนท้ายหน้าเว็บไซต์'),
  body('ส่วนท้ายหน้าประกอบด้วย:'),
  bullet('ชื่อแบรนด์'),
  bullet('ไอคอนลิงก์โซเชียลมีเดีย (Facebook, Instagram)'),
  bullet('ลิขสิทธิ์และปีปัจจุบัน'),
  pageBreak(),

  // ── 3. แผงผู้ดูแลระบบ ────────────────────────────────────────────────────
  h1('3. แผงผู้ดูแลระบบ'),
  body('แผงผู้ดูแลระบบให้เจ้าหน้าที่ที่ได้รับอนุญาตจัดการเนื้อหาทั้งหมดของเว็บไซต์ จำเป็นต้องมีชื่อผู้ใช้และรหัสผ่าน'),
  note('ที่อยู่แผงผู้ดูแล: https://cosmetic-website-six.vercel.app/admin/login'),

  // 3.1 เข้าสู่ระบบ
  h2('3.1  เข้าสู่ระบบ'),
  screenshotPlaceholder('TC-09-01.png — หน้าเข้าสู่ระบบ'),
  caption('รูปที่ 16: หน้าเข้าสู่ระบบผู้ดูแลระบบ'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'ไปที่ https://cosmetic-website-six.vercel.app/admin/login', 'หน้าเข้าสู่ระบบแสดงขึ้น'],
    [2, 'กรอกชื่อผู้ใช้: admin',                  'พิมพ์ในช่องชื่อผู้ใช้'],
    [3, 'กรอกรหัสผ่าน: admin1234',                'พิมพ์รหัสผ่าน (แสดงเป็นจุด)'],
    [4, 'คลิก "เข้าสู่ระบบ"',                     'เข้าสู่แผงผู้ดูแล — หน้าจัดการแบนเนอร์'],
  ]),
  screenshotPlaceholder('TC-09-04.png — แผงผู้ดูแลระบบ'),
  caption('รูปที่ 17: แผงผู้ดูแลระบบหลังเข้าสู่ระบบสำเร็จ'),
  new Paragraph({ spacing: { after: 120 } }),
  infoTable([
    ['ชื่อผู้ใช้เริ่มต้น',  'admin'],
    ['รหัสผ่านเริ่มต้น',   'admin1234'],
    ['อายุการใช้งาน',      '24 ชั่วโมง (ออกจากระบบอัตโนมัติ)'],
  ]),
  note('กรุณาเปลี่ยนรหัสผ่านเริ่มต้นทันทีหลังจากเข้าสู่ระบบครั้งแรก'),

  // 3.2 แถบด้านข้าง
  h2('3.2  แถบเมนูด้านข้าง'),
  body('หลังจากเข้าสู่ระบบ แถบเมนูด้านซ้ายมีลิงก์ไปยังแต่ละส่วนการจัดการ:'),
  bullet('แบนเนอร์ — จัดการภาพสไลด์หน้าแรก'),
  bullet('หมวดหมู่ — จัดการหมวดหมู่สินค้า'),
  bullet('สินค้า — จัดการสินค้าและรูปภาพ'),
  bullet('ข้อความ — ดูข้อความจากแบบฟอร์มติดต่อ'),
  body('คลิก "ออกจากระบบ" ที่ด้านล่างของแถบเมนูเพื่อออกจากระบบ'),

  // 3.3 จัดการแบนเนอร์
  h2('3.3  จัดการแบนเนอร์'),
  screenshotPlaceholder('TC-10-01.png — รายการแบนเนอร์'),
  caption('รูปที่ 18: หน้าจัดการแบนเนอร์'),
  body('จัดการภาพสไลด์หน้าแรก สามารถเพิ่ม แก้ไข ลบ และเรียงลำดับแบนเนอร์ได้'),

  h3('เพิ่มแบนเนอร์ใหม่'),
  stepTable([
    [1, 'คลิก "+ เพิ่มแบนเนอร์"',                       'ฟอร์ม Popup เปิดขึ้น'],
    [2, 'คลิก "เลือกไฟล์" และเลือกรูปภาพ',              'เลือกไฟล์ภาพ (JPEG, PNG, WebP ขนาดไม่เกิน 5MB)'],
    [3, 'กรอกหัวข้อภาษาไทย',                            'ใส่ชื่อแบนเนอร์ภาษาไทย'],
    [4, 'กรอกหัวข้อภาษาอังกฤษ',                         'ใส่ชื่อแบนเนอร์ภาษาอังกฤษ'],
    [5, 'กรอกหัวข้อย่อย TH / EN (ไม่บังคับ)',           'ใส่คำอธิบายเพิ่มเติม'],
    [6, 'ตั้งค่าลำดับการแสดง (0 = แรกสุด)',              'ใส่ตัวเลข'],
    [7, 'เปิดสถานะ "ใช้งาน"',                            'แบนเนอร์จะแสดงบนเว็บไซต์'],
    [8, 'คลิก "บันทึก"',                                 'แบนเนอร์ถูกเพิ่มในรายการ แสดงบนหน้าแรกทันที'],
  ]),
  screenshotPlaceholder('TC-10-04.png — แบนเนอร์ใหม่ในรายการ'),
  caption('รูปที่ 19: แบนเนอร์ใหม่ปรากฏในรายการ'),
  screenshotPlaceholder('TC-10-05.png — แบนเนอร์บนเว็บไซต์'),
  caption('รูปที่ 20: แบนเนอร์แสดงบนหน้าแรก'),

  h3('แก้ไขแบนเนอร์'),
  stepTable([
    [1, 'คลิก "แก้ไข" ข้างแบนเนอร์ที่ต้องการ',         'ฟอร์มเปิดพร้อมข้อมูลเดิม'],
    [2, 'แก้ไขข้อมูลที่ต้องการ',                         'ใส่ข้อมูลใหม่'],
    [3, 'เปลี่ยนรูปภาพ (ไม่บังคับ)',                     'เลือกไฟล์ใหม่ (ถ้าไม่เลือกจะใช้รูปเดิม)'],
    [4, 'คลิก "บันทึก"',                                 'การเปลี่ยนแปลงถูกบันทึก'],
  ]),

  h3('ลบแบนเนอร์'),
  stepTable([
    [1, 'คลิก "ลบ" ข้างแบนเนอร์ที่ต้องการ', 'กล่องยืนยันการลบปรากฏ'],
    [2, 'คลิก "ตกลง"',                        'แบนเนอร์ถูกลบถาวร'],
  ]),
  note('แบนเนอร์ที่ลบแล้วไม่สามารถกู้คืนได้'),

  // 3.4 จัดการหมวดหมู่
  h2('3.4  จัดการหมวดหมู่'),
  screenshotPlaceholder('TC-11-01.png — รายการหมวดหมู่'),
  caption('รูปที่ 21: หน้าจัดการหมวดหมู่'),
  body('หมวดหมู่ใช้สำหรับจัดกลุ่มสินค้า แสดงเป็นปุ่มกรองบนเว็บไซต์'),

  h3('เพิ่มหมวดหมู่ใหม่'),
  stepTable([
    [1, 'คลิก "+ เพิ่มหมวดหมู่"',                    'ฟอร์ม Popup เปิดขึ้น'],
    [2, 'กรอกชื่อภาษาไทย (บังคับ)',                   'เช่น ดูแลผิวหน้า'],
    [3, 'กรอกชื่อภาษาอังกฤษ (บังคับ)',                'เช่น Face Care'],
    [4, 'กรอก Slug (หรือปล่อยว่างให้สร้างอัตโนมัติ)', 'เช่น face-care'],
    [5, 'ตั้งลำดับการแสดง',                           'เลขน้อยแสดงก่อน'],
    [6, 'คลิก "บันทึก"',                              'หมวดหมู่ถูกเพิ่ม แสดงเป็นปุ่มบนเว็บไซต์'],
  ]),
  screenshotPlaceholder('TC-11-04.png — หมวดหมู่บนเว็บไซต์'),
  caption('รูปที่ 22: หมวดหมู่ใหม่แสดงเป็นปุ่มกรองบนเว็บไซต์'),

  // 3.5 จัดการสินค้า
  h2('3.5  จัดการสินค้า'),
  screenshotPlaceholder('TC-12-01.png — รายการสินค้า'),
  caption('รูปที่ 23: หน้าจัดการสินค้า'),
  body('จัดการสินค้าทั้งหมด รวมถึงชื่อ คำอธิบาย รูปภาพ และราคา'),

  h3('เพิ่มสินค้าใหม่'),
  stepTable([
    [1,  'คลิก "+ เพิ่มสินค้า"',                          'ฟอร์ม Popup เปิดขึ้น'],
    [2,  'เลือกหมวดหมู่ (ไม่บังคับ)',                      'เลือกจากรายการ Dropdown'],
    [3,  'กรอกชื่อภาษาไทย (บังคับ)',                      'ชื่อสินค้าภาษาไทย'],
    [4,  'กรอกชื่อภาษาอังกฤษ (บังคับ)',                   'ชื่อสินค้าภาษาอังกฤษ'],
    [5,  'กรอกคำอธิบาย TH / EN',                          'รายละเอียดสินค้าทั้งสองภาษา'],
    [6,  'กรอกส่วนประกอบ TH / EN (ไม่บังคับ)',            'รายการส่วนประกอบ'],
    [7,  'กรอกวิธีใช้ TH / EN (ไม่บังคับ)',               'วิธีการใช้งานสินค้า'],
    [8,  'กรอกราคา (ไม่บังคับ)',                           'ปล่อยว่างหากไม่ต้องการแสดงราคา'],
    [9,  'ตั้งลำดับการแสดง',                               'ลำดับในตารางสินค้า'],
    [10, 'คลิก "เลือกไฟล์" — เลือกรูปภาพสูงสุด 10 รูป',  'รูปแรกจะเป็นภาพหลักในตาราง'],
    [11, 'คลิก "บันทึกสินค้า"',                           'สินค้าถูกสร้าง แสดงบนเว็บไซต์'],
  ]),
  screenshotPlaceholder('TC-12-04.png — สินค้าพร้อมรูปภาพ'),
  caption('รูปที่ 24: สินค้าพร้อมรูปภาพในแผงผู้ดูแล'),
  screenshotPlaceholder('TC-12-05.png — สินค้าบนเว็บไซต์'),
  caption('รูปที่ 25: สินค้าแสดงบนตารางสินค้าของเว็บไซต์'),
  screenshotPlaceholder('TC-12-06.png — หน้าต่างรายละเอียดสินค้า'),
  caption('รูปที่ 26: หน้าต่างรายละเอียดสินค้าพร้อม Gallery'),

  h3('แก้ไขสินค้า'),
  stepTable([
    [1, 'คลิก "แก้ไข" ข้างสินค้าที่ต้องการ', 'ฟอร์มเปิดพร้อมข้อมูลเดิม'],
    [2, 'แก้ไขข้อมูลที่ต้องการ',               'ใส่ข้อมูลใหม่'],
    [3, 'เพิ่มรูปภาพ: เลือกไฟล์ใหม่',          'รูปใหม่จะถูกเพิ่มเข้า Gallery เดิม'],
    [4, 'ลบรูปภาพ: คลิก ✕ บนรูปภาพ',          'รูปภาพถูกลบออก'],
    [5, 'คลิก "บันทึกสินค้า"',                 'การเปลี่ยนแปลงถูกบันทึก'],
  ]),

  h3('ลบสินค้า'),
  stepTable([
    [1, 'คลิก "ลบ" ข้างสินค้า', 'กล่องยืนยันการลบปรากฏ'],
    [2, 'คลิก "ตกลง"',          'สินค้าและรูปภาพทั้งหมดถูกลบถาวร'],
  ]),

  // 3.6 ข้อความติดต่อ
  h2('3.6  ข้อความติดต่อ'),
  screenshotPlaceholder('TC-13-01.png — รายการข้อความ'),
  caption('รูปที่ 27: รายการข้อความจากแบบฟอร์มติดต่อ'),
  body('ดูข้อความที่ส่งมาจากแบบฟอร์มติดต่อบนเว็บไซต์'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'คลิก "ข้อความ" ในแถบเมนู',              'รายการข้อความทั้งหมดแสดง เรียงล่าสุดก่อน'],
    [2, 'จำนวนข้อความที่ยังไม่ได้อ่าน',           'แสดงตัวเลขในส่วนหัว'],
    [3, 'แถวที่ยังไม่ได้อ่านมีพื้นหลังสีอ่อน',    'ข้อความที่ยังไม่อ่านมีพื้นหลังสีส้มอ่อน'],
    [4, 'คลิก "ทำเครื่องหมายว่าอ่านแล้ว"',       'สถานะเปลี่ยนเป็น "อ่านแล้ว" สีเขียว'],
  ]),
  screenshotPlaceholder('TC-13-04.png — ข้อความที่อ่านแล้ว'),
  caption('รูปที่ 28: ข้อความถูกทำเครื่องหมายว่าอ่านแล้ว'),
  note('ไม่สามารถลบข้อความได้ในเวอร์ชันนี้'),
  pageBreak(),

  // 3.7 ตั้งค่าเว็บไซต์
  h2('3.7  ตั้งค่าเว็บไซต์ (Site Settings)'),
  screenshotPlaceholder('TC-15-01.png — หน้าตั้งค่าเว็บไซต์'),
  caption('รูปที่ 29: หน้าตั้งค่าเว็บไซต์ มี 3 ส่วนหลัก'),
  body('ตั้งค่าข้อมูลแบรนด์ โซเชียลมีเดีย และข้อความท้ายหน้า การเปลี่ยนแปลงจะแสดงบนเว็บไซต์สาธารณะทันทีหลังบันทึก'),
  new Paragraph({ spacing: { after: 120 } }),

  h3('วิธีเปิดหน้าตั้งค่า'),
  stepTable([
    [1, 'เข้าสู่ระบบแผงผู้ดูแล', 'หน้า Admin เปิดขึ้น'],
    [2, 'คลิก "⚙️ Settings" ในแถบเมนูซ้าย', 'หน้าตั้งค่าเปิดขึ้น มี 3 ส่วน'],
  ]),

  h3('ข้อมูลแบรนด์ (Brand Identity)'),
  screenshotPlaceholder('TC-15-02.png — ส่วนข้อมูลแบรนด์'),
  caption('รูปที่ 30: ส่วนข้อมูลแบรนด์ — ชื่อบริษัทและโลโก้'),
  stepTable([
    [1, 'กรอกชื่อบริษัท/แบรนด์ (ไทย) เช่น ร้านความงาม Rose Gold', 'แสดงบน Navbar และ Footer เมื่อใช้ภาษาไทย'],
    [2, 'กรอกชื่อบริษัท/แบรนด์ (อังกฤษ) เช่น Rose Gold Beauty', 'แสดงบน Navbar และ Footer เมื่อใช้ภาษาอังกฤษ'],
    [3, 'คลิก "เลือกไฟล์รูปโลโก้" เพื่ออัปโหลดโลโก้', 'ตัวอย่างโลโก้แสดงในกล่องแสดงตัวอย่าง'],
    [4, 'คลิก "💾 บันทึกการตั้งค่า"', 'ข้อความสำเร็จแสดงขึ้น Navbar จะแสดงโลโก้ใหม่'],
  ]),
  screenshotPlaceholder('TC-15-03.png — ข้อความสำเร็จหลังบันทึก'),
  caption('รูปที่ 31: ข้อความยืนยันการบันทึกสำเร็จ'),
  note('โลโก้ควรเป็นภาพแนวนอน ขนาดที่แนะนำ 200×60 px รูปแบบที่รองรับ: JPG, PNG, WebP (ขนาดสูงสุด 5 MB)'),

  h3('โซเชียลมีเดีย & ช่องทางติดต่อ'),
  stepTable([
    [1, 'กรอก LINE OA URL (จาก LINE Official Account Manager)', 'ปุ่ม LINE ปรากฏในส่วน Contact บนเว็บไซต์'],
    [2, 'กรอก Facebook URL', 'ไอคอน Facebook ปรากฏในส่วน Footer'],
    [3, 'กรอก Instagram URL', 'ไอคอน Instagram ปรากฏในส่วน Footer'],
    [4, 'กรอก TikTok URL', 'ไอคอน TikTok ปรากฏในส่วน Footer'],
    [5, 'คลิก "💾 บันทึกการตั้งค่า"', 'ข้อความสำเร็จแสดงขึ้น เว็บไซต์อัปเดตทันที'],
  ]),
  screenshotPlaceholder('TC-15-08.png — ลิงก์โซเชียลมีเดียบันทึกแล้ว'),
  caption('รูปที่ 32: ลิงก์โซเชียลมีเดียถูกบันทึกแล้ว'),
  note('ไอคอนโซเชียลจะแสดงบน Footer เฉพาะเมื่อมีการกรอก URL เท่านั้น หากไม่กรอกจะไม่แสดง'),

  h3('ข้อความท้ายหน้า (Footer Text)'),
  stepTable([
    [1, 'กรอกข้อความลิขสิทธิ์ (ไทย) เช่น สงวนลิขสิทธิ์', 'แสดงใน Footer เมื่อใช้ภาษาไทย'],
    [2, 'กรอกข้อความลิขสิทธิ์ (อังกฤษ) เช่น All rights reserved', 'แสดงใน Footer เมื่อใช้ภาษาอังกฤษ'],
    [3, 'คลิก "💾 บันทึกการตั้งค่า"', 'ข้อความสำเร็จแสดงขึ้น'],
  ]),
  pageBreak(),

  // ── 4. การแก้ไขปัญหาเบื้องต้น ────────────────────────────────────────────
  h1('4. การแก้ไขปัญหาเบื้องต้น'),
  new Paragraph({ spacing: { after: 120 } }),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: ['ปัญหา', 'สาเหตุที่เป็นไปได้', 'วิธีแก้ไข'].map(h =>
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: DARK },
            children: [new Paragraph({
              children: [new TextRun({ text: h, bold: true, size: 20, font: 'Sarabun', color: WHITE })],
            })],
          })
        ),
      }),
      ...([
        ['สินค้า / แบนเนอร์ไม่โหลด',          'เซิร์ฟเวอร์หลังไม่ทำงาน',              'เริ่มเซิร์ฟเวอร์: cd backend && npm run dev'],
        ['แบบฟอร์มติดต่อแสดงข้อผิดพลาด',      'Backend หรือฐานข้อมูลไม่ทำงาน',         'ตรวจสอบทั้ง Backend และ MySQL'],
        ['เข้าสู่ระบบ Admin ไม่ได้',           'ชื่อผู้ใช้/รหัสผ่านผิด หรือ Backend ดาวน์', 'ตรวจสอบข้อมูลการเข้าสู่ระบบ'],
        ['รูปภาพไม่แสดง',                      'ไฟล์ Static ไม่ถูก Serve',              'รีสตาร์ทเซิร์ฟเวอร์ Backend'],
        ['ภาษาไม่เปลี่ยน',                     'เบราว์เซอร์บล็อก localStorage',          'ตรวจสอบการตั้งค่าความเป็นส่วนตัวของเบราว์เซอร์'],
        ['หน้าขาว / ไม่มีเนื้อหา',             'Frontend build error',                  'เปิด Console (F12) เพื่อดู error'],
        ['Session หมดอายุ',                    'ล็อกอินเกิน 24 ชั่วโมง',               'เข้าสู่ระบบใหม่'],
      ]).map(([problem, cause, solution], i) =>
        new TableRow({
          children: [problem, cause, solution].map(text =>
            new TableCell({
              shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? WHITE : 'FDF9F7' },
              children: [new Paragraph({
                children: [new TextRun({ text, size: 20, font: 'Sarabun', color: DARK })],
              })],
            })
          ),
        })
      ),
    ],
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
  }),
  pageBreak(),

  // ── 5. ข้อมูลอ้างอิงด่วน ─────────────────────────────────────────────────
  h1('5. ข้อมูลอ้างอิงด่วน'),

  h2('5.1  ที่อยู่เว็บไซต์'),
  infoTable([
    ['เว็บไซต์สาธารณะ',     'https://cosmetic-website-six.vercel.app/'],
    ['แผงผู้ดูแลระบบ',      'https://cosmetic-website-six.vercel.app/admin/login'],
    ['จัดการแบนเนอร์',      'https://cosmetic-website-six.vercel.app/admin/banners'],
    ['จัดการหมวดหมู่',      'https://cosmetic-website-six.vercel.app/admin/categories'],
    ['จัดการสินค้า',         'https://cosmetic-website-six.vercel.app/admin/products'],
    ['ข้อความติดต่อ',        'https://cosmetic-website-six.vercel.app/admin/contacts'],
    ['ตั้งค่าเว็บไซต์',      'https://cosmetic-website-six.vercel.app/admin/settings'],
  ]),

  new Paragraph({ spacing: { after: 240 } }),

  h2('5.2  ขีดจำกัดการอัปโหลดรูปภาพ'),
  infoTable([
    ['ขนาดไฟล์สูงสุด',         '5 MB ต่อรูป'],
    ['รูปแบบไฟล์ที่รองรับ',    'JPEG, JPG, PNG, WebP'],
    ['จำนวนรูปภาพต่อสินค้า',   'สูงสุด 10 รูป'],
    ['รูปภาพแบนเนอร์',          '1 รูปต่อแบนเนอร์'],
  ]),

  new Paragraph({ spacing: { after: 240 } }),

  h2('5.3  ข้อมูลการเข้าสู่ระบบ'),
  infoTable([
    ['ชื่อผู้ใช้เริ่มต้น',     'admin'],
    ['รหัสผ่านเริ่มต้น',       'admin1234'],
    ['อายุ Session',           '24 ชั่วโมงหลังจากเข้าสู่ระบบ'],
  ]),
  note('กรุณาเปลี่ยนรหัสผ่านเริ่มต้นหลังจากใช้งานครั้งแรก'),
];

// ─── สร้างเอกสาร (Build Document) ────────────────────────────────────────────
async function build() {
  const doc = new Document({
    title:   'คู่มือการใช้งานเว็บไซต์คอสเมติก',
    author:  'ทีมพัฒนา',
    creator: 'Cosmetic Website',
    styles: {
      paragraphStyles: [
        {
          id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal',
          run: { size: 36, bold: true, color: ROSE, font: 'Sarabun' },
          paragraph: { spacing: { before: 400, after: 200 } },
        },
        {
          id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal',
          run: { size: 28, bold: true, color: DARK, font: 'Sarabun' },
          paragraph: { spacing: { before: 320, after: 160 } },
        },
        {
          id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal',
          run: { size: 24, bold: true, color: GOLD, font: 'Sarabun' },
          paragraph: { spacing: { before: 240, after: 120 } },
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top:    convertInchesToTwip(1),
            right:  convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left:   convertInchesToTwip(1),
          },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: '✦ คอสเมติก  —  คู่มือการใช้งาน', size: 18, font: 'Sarabun', color: MUTED }),
              ],
              alignment: AlignmentType.RIGHT,
              border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER } },
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'เวอร์ชัน 1.0.0  |  1 พฤษภาคม 2569  |  หน้าที่ ', size: 18, font: 'Sarabun', color: MUTED }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18, font: 'Sarabun', color: ROSE }),
                new TextRun({ text: ' จาก ', size: 18, font: 'Sarabun', color: MUTED }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, font: 'Sarabun', color: ROSE }),
              ],
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 1, color: BORDER } },
            }),
          ],
        }),
      },
      children: [
        ...coverPage(),
        ...tableOfContents(),
        ...sections,
      ],
    }],
  });

  const buffer  = await Packer.toBuffer(doc);
  const outPath = path.join(__dirname, 'docs', 'คู่มือการใช้งาน_Cosmetic.docx');
  fs.writeFileSync(outPath, buffer);
  console.log(`✅  สร้างเอกสารสำเร็จ: ${outPath}`);
}

build().catch(err => { console.error(err); process.exit(1); });
