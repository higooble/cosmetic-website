const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, AlignmentType,
  BorderStyle, ShadingType, PageBreak, TableOfContents,
  LevelFormat, convertInchesToTwip, Header, Footer,
  PageNumber, NumberFormat, ImageRun,
} = require('docx');
const fs   = require('fs');
const path = require('path');

// ─── Screenshot resolver ──────────────────────────────────────────────────────
const TODAY          = new Date().toISOString().split('T')[0];
const SCREENSHOTS_DIR = path.join(__dirname, 'docs', 'testing', 'screenshots', TODAY);

function getScreenshot(filename) {
  const p = path.join(SCREENSHOTS_DIR, filename);
  return fs.existsSync(p) ? fs.readFileSync(p) : null;
}

// ─── Colors ───────────────────────────────────────────────────────────────────
const ROSE   = 'C9967A';
const GOLD   = 'C8A96E';
const DARK   = '2C2C2C';
const LIGHT  = 'FAF7F5';
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

function body(text, options = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: 'Sarabun', color: DARK, ...options })],
    spacing: { after: 120 },
  });
}

function bold(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 22, font: 'Sarabun', color: DARK })],
    spacing: { after: 100 },
  });
}

function bullet(text) {
  return new Paragraph({
    children: [new TextRun({ text: `• ${text}`, size: 22, font: 'Sarabun', color: DARK })],
    spacing: { after: 80 },
    indent: { left: convertInchesToTwip(0.3) },
  });
}

function numbered(num, text) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${num}.  `, bold: true, size: 22, font: 'Sarabun', color: ROSE }),
      new TextRun({ text, size: 22, font: 'Sarabun', color: DARK }),
    ],
    spacing: { after: 100 },
    indent: { left: convertInchesToTwip(0.3) },
  });
}

function note(text) {
  return new Paragraph({
    children: [
      new TextRun({ text: '📌 Note: ', bold: true, size: 20, font: 'Sarabun', color: ROSE }),
      new TextRun({ text, size: 20, font: 'Sarabun', color: MUTED }),
    ],
    spacing: { after: 120, before: 80 },
    indent: { left: convertInchesToTwip(0.2) },
    shading: { type: ShadingType.CLEAR, fill: 'FFF8F5' },
  });
}

function screenshotPlaceholder(label) {
  const filename = label.split(' ')[0]; // e.g. "TC-01-01.png"
  const imgData  = getScreenshot(filename);

  if (imgData) {
    // Real screenshot found — embed it
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

  // Fallback placeholder
  return new Paragraph({
    children: [
      new TextRun({
        text: `[ Screenshot: ${label} ]`,
        size: 20,
        font: 'Courier New',
        color: MUTED,
        italics: true,
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
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: 'F5EDE8' },
            children: [new Paragraph({
              children: [new TextRun({ text: label, bold: true, size: 20, font: 'Sarabun', color: ROSE })],
            })],
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
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
        children: ['Step', 'Action', 'Expected Result'].map(h =>
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

// ─── Cover Page ───────────────────────────────────────────────────────────────
function coverPage() {
  return [
    new Paragraph({ spacing: { before: 1200 } }),
    new Paragraph({
      children: [new TextRun({ text: '✦  COSMETIC', size: 64, bold: true, font: 'Playfair Display', color: ROSE })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'USER MANUAL', size: 40, font: 'Sarabun', color: GOLD, characterSpacing: 200 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'คู่มือการใช้งาน', size: 32, font: 'Sarabun', color: MUTED })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    divider(),
    new Paragraph({ spacing: { after: 120 } }),
    infoTable([
      ['Version',       '1.0.0'],
      ['Date',          '2026-05-01'],
      ['Prepared by',   'Development Team'],
      ['Document type', 'User Manual — Public Site & Admin Panel'],
    ]),
    pageBreak(),
  ];
}

// ─── Document sections ────────────────────────────────────────────────────────
const sections = [

  // ── 1. Introduction ──────────────────────────────────────────────────────
  h1('1. Introduction'),
  body('This manual describes how to use the Cosmetic website — both the public-facing pages and the admin management panel.'),
  body('คู่มือนี้อธิบายวิธีการใช้งานเว็บไซต์ Cosmetic ทั้งหน้าสาธารณะและแผงการจัดการสำหรับผู้ดูแลระบบ'),
  new Paragraph({ spacing: { after: 160 } }),
  infoTable([
    ['Public URL',  'https://cosmetic-website-six.vercel.app/'],
    ['Admin URL',   'https://cosmetic-website-six.vercel.app/admin/login'],
    ['Languages',   'Thai (TH) / English (EN)'],
    ['Browser',     'Chrome, Firefox, Edge (latest version)'],
  ]),
  pageBreak(),

  // ── 2. Public Website ─────────────────────────────────────────────────────
  h1('2. Public Website'),
  body('The public website is a single-page application. All content is on one page — use the navigation bar to jump between sections.'),

  // 2.1 Navigation
  h2('2.1  Navigation Bar'),
  screenshotPlaceholder('TC-01-01.png — Full navigation bar'),
  body('The navigation bar stays fixed at the top of the screen as you scroll. It contains:'),
  bullet('Brand name (left)'),
  bullet('Menu links: Home, Catalog, Products, Contact'),
  bullet('Language switcher button (right)'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'Click any menu link (e.g. "Products")', 'Page scrolls smoothly to that section'],
    [2, 'Scroll down the page', 'Navbar gets a white background and shadow'],
    [3, 'Click "Home"', 'Page scrolls back to the top'],
  ]),
  screenshotPlaceholder('TC-01-02.png — Sticky navbar after scroll'),

  // 2.2 Language Switcher
  h2('2.2  Language Switcher'),
  screenshotPlaceholder('TC-02-01.png — Language button in navbar'),
  body('The website supports Thai and English. The language button is in the top-right corner of the navigation bar.'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'Find the language button (shows "EN" when site is in Thai)', 'Button visible in navbar'],
    [2, 'Click the button', 'All text switches to English. Button now shows "TH"'],
    [3, 'Reload the page', 'Language stays as English (preference is saved)'],
    [4, 'Click again to switch back', 'Text returns to Thai'],
  ]),
  screenshotPlaceholder('TC-02-02.png — Site in English after switch'),
  note('Language preference is saved in your browser. It will stay the same next time you visit.'),

  // 2.3 Banner
  h2('2.3  Banner Slider'),
  screenshotPlaceholder('TC-03-01.png — Banner with image and text overlay'),
  body('The banner section is a full-screen image slideshow at the top of the page.'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'Load the homepage', 'First banner image displays with title and subtitle'],
    [2, 'Wait 4–5 seconds', 'Slider automatically advances to the next image'],
    [3, 'Click the right arrow (›)', 'Advances to the next slide manually'],
    [4, 'Click the left arrow (‹)', 'Goes back to the previous slide'],
    [5, 'Click a dot at the bottom', 'Jumps directly to that banner'],
    [6, 'Click "Shop Now" button', 'Page scrolls to the Products section'],
  ]),
  screenshotPlaceholder('TC-03-02.png — Slider advanced to second banner'),

  // 2.4 Catalog Filter
  h2('2.4  Category Filter'),
  screenshotPlaceholder('TC-04-01.png — Category pills'),
  body('The catalog section shows product category buttons. Click a category to filter which products appear below.'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'Scroll to the Catalog section', 'Category buttons (pills) are displayed'],
    [2, 'Click any category (e.g. "Face Care")', 'Products grid updates to show only that category'],
    [3, 'Click "All"', 'All products are shown again'],
    [4, 'Active category', 'Selected button turns rose gold to show selection'],
  ]),
  screenshotPlaceholder('TC-04-02.png — Category selected, filtered products shown'),

  // 2.5 Product Grid
  h2('2.5  Product Grid'),
  screenshotPlaceholder('TC-05-01.png — Product grid overview'),
  body('Products are displayed in a responsive grid. Each card shows the product image, name, and price (if available).'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'Scroll to the Products section', 'Products displayed in grid layout'],
    [2, 'Hover over a product card', 'Card lifts with a subtle shadow effect'],
    [3, 'Click any product card', 'Product detail popup opens'],
  ]),
  screenshotPlaceholder('TC-05-02.png — Single product card close-up'),

  // 2.6 Product Detail
  h2('2.6  Product Detail Popup'),
  screenshotPlaceholder('TC-06-01.png — Product modal open'),
  body('Clicking a product opens a popup with full product details, image gallery, and descriptions.'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'Click any product card', 'Popup opens. Left side shows images, right side shows info'],
    [2, 'Click the right/left arrows in the image area', 'Switch between product images'],
    [3, 'Click a thumbnail image below', 'Main image changes to that thumbnail'],
    [4, 'Read product details', 'Name, price, description, ingredients, usage shown in current language'],
    [5, 'Click outside the popup (dark overlay)', 'Popup closes'],
    [6, 'Click the ✕ button (top-right)', 'Popup closes'],
  ]),
  screenshotPlaceholder('TC-06-02.png — Product detail with image gallery'),
  note('Product text (name, description) will display in whichever language is currently selected.'),

  // 2.7 Contact
  h2('2.7  Contact Form'),
  screenshotPlaceholder('TC-07-01.png — Contact form'),
  body('Use the contact form to send a message. Required fields are Name and Message.'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'Scroll to Contact section', 'Form with Name, Email, Phone, Message fields is visible'],
    [2, 'Fill in Name (required)', 'Text entered in Name field'],
    [3, 'Fill in Email (optional)', 'Text entered in Email field'],
    [4, 'Fill in Phone (optional)', 'Text entered in Phone field'],
    [5, 'Fill in Message (required)', 'Text entered in Message field'],
    [6, 'Click "Send Message"', 'Green success message appears. Form resets.'],
    [7, 'Click "Chat on LINE"', 'Opens LINE Official Account chat'],
  ]),
  screenshotPlaceholder('TC-07-04.png — Success message after form submit'),
  note('If you see a red error message, the server may not be running. Contact your administrator.'),

  // 2.8 Footer
  h2('2.8  Footer'),
  screenshotPlaceholder('TC-08-01.png — Footer section'),
  body('The footer is at the bottom of the page. It contains:'),
  bullet('Brand name'),
  bullet('Facebook and Instagram icon links'),
  bullet('Copyright year'),
  pageBreak(),

  // ── 3. Admin Panel ────────────────────────────────────────────────────────
  h1('3. Admin Panel'),
  body('The admin panel allows authorised staff to manage all website content. Access requires a username and password.'),
  note('Admin panel URL: https://cosmetic-website-six.vercel.app/admin/login'),

  // 3.1 Login
  h2('3.1  Login'),
  screenshotPlaceholder('TC-09-01.png — Admin login page'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'Go to https://cosmetic-website-six.vercel.app/admin/login', 'Login page shows with username and password fields'],
    [2, 'Enter username: admin', 'Username typed in field'],
    [3, 'Enter password: admin1234', 'Password typed (hidden as dots)'],
    [4, 'Click "Login"', 'Redirected to Admin panel — Banners page'],
  ]),
  screenshotPlaceholder('TC-09-04.png — Admin panel after successful login'),
  new Paragraph({ spacing: { after: 120 } }),
  infoTable([
    ['Default username', 'admin'],
    ['Default password', 'admin1234'],
    ['Session duration', '24 hours (auto logout after 24h)'],
  ]),
  note('Change the default password immediately after first login for security.'),

  // 3.2 Sidebar
  h2('3.2  Admin Sidebar'),
  body('After login, the left sidebar has navigation links to each management section:'),
  bullet('Banners — manage homepage slider images'),
  bullet('Categories — manage product categories'),
  bullet('Products — manage products and images'),
  bullet('Contacts — view contact form submissions'),
  body('Click "Logout" at the bottom of the sidebar to sign out.'),

  // 3.3 Banners
  h2('3.3  Banner Management'),
  screenshotPlaceholder('TC-10-01.png — Banner management list'),
  body('Manage the homepage image slider. You can add, edit, delete, and reorder banners.'),

  h3('Add New Banner'),
  stepTable([
    [1, 'Click "+ Add Banner"', 'Form popup opens'],
    [2, 'Click "Choose File" and select an image', 'Image selected (JPEG, PNG, or WebP, max 5MB)'],
    [3, 'Fill in Title TH (Thai title)', 'Thai title entered'],
    [4, 'Fill in Title EN (English title)', 'English title entered'],
    [5, 'Fill in Subtitle TH / EN (optional)', 'Subtitle entered'],
    [6, 'Set Sort Order (0 = first)', 'Number entered'],
    [7, 'Check "Active" checkbox', 'Banner will be visible on public site'],
    [8, 'Click "Save"', 'Banner added to list. Appears on homepage immediately.'],
  ]),
  screenshotPlaceholder('TC-10-04.png — New banner in admin list'),
  screenshotPlaceholder('TC-10-05.png — Banner visible on public homepage'),

  h3('Edit Banner'),
  stepTable([
    [1, 'Click "Edit" next to the banner', 'Form opens pre-filled with current data'],
    [2, 'Change any fields', 'Updated values entered'],
    [3, 'To replace image: select new file', 'New image chosen (leave blank to keep current)'],
    [4, 'Click "Save"', 'Changes saved and reflected on homepage'],
  ]),

  h3('Delete Banner'),
  stepTable([
    [1, 'Click "Delete" next to the banner', 'Confirmation dialog appears'],
    [2, 'Click "OK" to confirm', 'Banner permanently deleted'],
  ]),
  note('Deleted banners cannot be recovered.'),

  // 3.4 Categories
  h2('3.4  Category Management'),
  screenshotPlaceholder('TC-11-01.png — Category management list'),
  body('Categories group your products. They appear as filter buttons on the public site.'),

  h3('Add New Category'),
  stepTable([
    [1, 'Click "+ Add Category"', 'Form popup opens'],
    [2, 'Enter Name TH (Thai name)', 'e.g. ดูแลผิวหน้า'],
    [3, 'Enter Name EN (English name)', 'e.g. Face Care'],
    [4, 'Enter Slug (or leave blank for auto)', 'e.g. face-care (auto-generated from EN name)'],
    [5, 'Set Sort Order', 'Lower number = shown first'],
    [6, 'Click "Save"', 'Category added. Appears as filter button on public site.'],
  ]),
  screenshotPlaceholder('TC-11-04.png — New category pill on public site'),

  // 3.5 Products
  h2('3.5  Product Management'),
  screenshotPlaceholder('TC-12-01.png — Product management list'),
  body('Manage all products including their names, descriptions, images, and pricing.'),

  h3('Add New Product'),
  stepTable([
    [1,  'Click "+ Add Product"', 'Form popup opens'],
    [2,  'Select Category (optional)', 'Choose from dropdown list'],
    [3,  'Enter Name TH (required)', 'Thai product name'],
    [4,  'Enter Name EN (required)', 'English product name'],
    [5,  'Enter Description TH / EN', 'Product description in both languages'],
    [6,  'Enter Ingredients TH / EN (optional)', 'List of ingredients'],
    [7,  'Enter Usage TH / EN (optional)', 'How to use the product'],
    [8,  'Enter Price (optional)', 'Leave blank if price is not displayed'],
    [9,  'Set Sort Order', 'Display position in grid'],
    [10, 'Click "Choose Files" — select up to 10 images', 'Images selected. First image = primary (shown in grid)'],
    [11, 'Click "Save Product"', 'Product created and visible on public site'],
  ]),
  screenshotPlaceholder('TC-12-04.png — Product with uploaded images in admin'),
  screenshotPlaceholder('TC-12-05.png — Product visible on public product grid'),

  h3('Edit Product'),
  stepTable([
    [1, 'Click "Edit" next to product', 'Form opens with existing data'],
    [2, 'Update any fields', 'Changes entered'],
    [3, 'To add more images: select files', 'New images added to existing gallery'],
    [4, 'To remove an image: click ✕ on thumbnail', 'Image removed immediately'],
    [5, 'Click "Save Product"', 'Changes saved'],
  ]),
  screenshotPlaceholder('TC-12-06.png — Product detail modal with gallery'),

  h3('Delete Product'),
  stepTable([
    [1, 'Click "Delete" next to product', 'Confirmation dialog'],
    [2, 'Click "OK"', 'Product and all its images permanently deleted'],
  ]),

  // 3.6 Contacts
  h2('3.6  Contact Submissions'),
  screenshotPlaceholder('TC-13-01.png — Contact submissions list'),
  body('View messages submitted via the public contact form.'),
  new Paragraph({ spacing: { after: 120 } }),
  stepTable([
    [1, 'Click "Contacts" in sidebar', 'All submissions listed, newest first'],
    [2, 'Unread count shown in header', 'Number of unread messages displayed'],
    [3, 'Unread rows highlighted', 'Rows with unread messages have light background'],
    [4, 'Click "Mark Read" on a submission', 'Status changes to green "Read" badge'],
  ]),
  screenshotPlaceholder('TC-13-04.png — Contact marked as read'),
  note('Contact submissions cannot be deleted from the admin panel in this version.'),
  pageBreak(),

  // 3.7 Site Settings
  h2('3.7  Site Settings'),
  screenshotPlaceholder('TC-15-01.png — Site Settings page overview'),
  body('Configure your brand identity, social media links, and footer text. Changes reflect on the public site immediately after saving.'),
  new Paragraph({ spacing: { after: 120 } }),

  h3('How to Open Settings'),
  stepTable([
    [1, 'Log in to the admin panel', 'Admin dashboard opens'],
    [2, 'Click "⚙️ Settings" in the left sidebar', 'Site Settings page opens with 3 sections'],
  ]),

  h3('Brand Identity'),
  screenshotPlaceholder('TC-15-02.png — Brand Identity section'),
  stepTable([
    [1, 'Enter Company Name (Thai) — e.g. ร้านความงาม Rose Gold', 'Shown in Navbar and Footer when language is Thai'],
    [2, 'Enter Company Name (English) — e.g. Rose Gold Beauty', 'Shown in Navbar and Footer when language is English'],
    [3, 'Click "เลือกไฟล์รูปโลโก้" to upload a logo image', 'Logo preview appears in the box'],
    [4, 'Click "💾 บันทึกการตั้งค่า"', 'Success message shown. Navbar now displays logo'],
  ]),
  screenshotPlaceholder('TC-15-03.png — Success message after saving'),
  note('Logo image should be horizontal (landscape). Recommended size: 200×60 px. Accepted formats: JPG, PNG, WebP (max 5 MB).'),

  h3('Social Media & Contact'),
  stepTable([
    [1, 'Enter LINE OA URL (from LINE Official Account Manager)', 'LINE button appears in Contact section on public site'],
    [2, 'Enter Facebook URL', 'Facebook icon appears in Footer'],
    [3, 'Enter Instagram URL', 'Instagram icon appears in Footer'],
    [4, 'Enter TikTok URL', 'TikTok icon appears in Footer'],
    [5, 'Click "💾 บันทึกการตั้งค่า"', 'Success message. Public site updated.'],
  ]),
  screenshotPlaceholder('TC-15-08.png — Social media links saved'),
  note('Social icons only appear in the Footer when a URL is entered. Leave blank to hide.'),

  h3('Footer Text'),
  stepTable([
    [1, 'Enter copyright text (Thai) — e.g. สงวนลิขสิทธิ์', 'Shown in Footer when language is Thai'],
    [2, 'Enter copyright text (English) — e.g. All rights reserved', 'Shown in Footer when language is English'],
    [3, 'Click "💾 บันทึกการตั้งค่า"', 'Success message shown'],
  ]),
  pageBreak(),

  // ── 4. Troubleshooting ────────────────────────────────────────────────────
  h1('4. Troubleshooting'),
  new Paragraph({ spacing: { after: 120 } }),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: ['Problem', 'Possible Cause', 'Solution'].map(h =>
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: DARK },
            children: [new Paragraph({
              children: [new TextRun({ text: h, bold: true, size: 20, font: 'Sarabun', color: WHITE })],
            })],
          })
        ),
      }),
      ...([
        ['Products / banners not loading', 'Backend server not running', 'Start backend: cd backend && npm run dev'],
        ['Contact form shows error', 'Backend not running or DB offline', 'Check both backend and MySQL are running'],
        ['Admin login fails', 'Wrong credentials or backend down', 'Verify username/password. Check backend is running.'],
        ['Images not showing', 'Backend static files not served', 'Restart backend server'],
        ['Language not switching', 'localStorage blocked by browser', 'Check browser privacy settings'],
        ['White page / no content', 'Frontend build error', 'Check browser console (F12) for errors'],
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

  // ── 5. Quick Reference ────────────────────────────────────────────────────
  h1('5. Quick Reference'),

  h2('5.1  URLs'),
  infoTable([
    ['Public Website',     'https://cosmetic-website-six.vercel.app/'],
    ['Admin Panel',        'https://cosmetic-website-six.vercel.app/admin/login'],
    ['Admin — Banners',    'https://cosmetic-website-six.vercel.app/admin/banners'],
    ['Admin — Categories', 'https://cosmetic-website-six.vercel.app/admin/categories'],
    ['Admin — Products',   'https://cosmetic-website-six.vercel.app/admin/products'],
    ['Admin — Contacts',   'https://cosmetic-website-six.vercel.app/admin/contacts'],
    ['Admin — Settings',   'https://cosmetic-website-six.vercel.app/admin/settings'],
  ]),

  new Paragraph({ spacing: { after: 240 } }),

  h2('5.2  Image Upload Limits'),
  infoTable([
    ['Max file size',      '5 MB per image'],
    ['Allowed formats',    'JPEG, JPG, PNG, WebP'],
    ['Max images/product', '10 images'],
    ['Banner image',       '1 image per banner (replace to update)'],
  ]),

  new Paragraph({ spacing: { after: 240 } }),

  h2('5.3  Admin Credentials'),
  infoTable([
    ['Default username', 'admin'],
    ['Default password', 'admin1234'],
    ['Session expires',  '24 hours after login'],
  ]),
  note('Change the default password after first use.'),
];

// ─── Build Document ───────────────────────────────────────────────────────────
async function build() {
  const doc = new Document({
    title:    'Cosmetic Website User Manual',
    author:   'Development Team',
    creator:  'Cosmetic Website',
    styles: {
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          run: { size: 36, bold: true, color: ROSE, font: 'Sarabun' },
          paragraph: { spacing: { before: 400, after: 200 } },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          run: { size: 28, bold: true, color: DARK, font: 'Sarabun' },
          paragraph: { spacing: { before: 320, after: 160 } },
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          basedOn: 'Normal',
          next: 'Normal',
          run: { size: 24, bold: true, color: GOLD, font: 'Sarabun' },
          paragraph: { spacing: { before: 240, after: 120 } },
        },
      ],
    },
    sections: [
      {
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
                  new TextRun({ text: '✦ Cosmetic  —  User Manual', size: 18, font: 'Sarabun', color: MUTED }),
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
                  new TextRun({ text: 'Version 1.0.0  |  2026-05-01  |  Page ', size: 18, font: 'Sarabun', color: MUTED }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 18, font: 'Sarabun', color: ROSE }),
                  new TextRun({ text: ' of ', size: 18, font: 'Sarabun', color: MUTED }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, font: 'Sarabun', color: ROSE }),
                ],
                alignment: AlignmentType.CENTER,
                border: { top: { style: BorderStyle.SINGLE, size: 1, color: BORDER } },
              }),
            ],
          }),
        },
        children: [...coverPage(), ...sections],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(__dirname, 'docs', 'Cosmetic_User_Manual.docx');
  fs.writeFileSync(outPath, buffer);
  console.log(`✅  Generated: ${outPath}`);
}

build().catch(err => { console.error(err); process.exit(1); });
