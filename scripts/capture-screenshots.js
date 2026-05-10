/**
 * Automated screenshot capture using Puppeteer.
 * Captures public site + admin panel and saves to docs/testing/screenshots/YYYY-MM-DD/
 */
const puppeteer = require('puppeteer');
const path      = require('path');
const fs        = require('fs');

const TODAY  = new Date().toISOString().split('T')[0];
const OUTDIR = path.join(__dirname, '..', 'docs', 'testing', 'screenshots', TODAY);
fs.mkdirSync(OUTDIR, { recursive: true });

const BASE  = 'http://localhost:5173';
const ADMIN = `${BASE}/admin`;

let browser, page;

// ── Helpers ───────────────────────────────────────────────────────────────────
async function shot(name, opts = {}) {
  const p = path.join(OUTDIR, `${name}.png`);
  await page.screenshot({ path: p, fullPage: opts.fullPage || false });
  console.log(`   📸  ${name}.png`);
}

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function scrollTo(selector) {
  await page.evaluate(sel => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, selector);
  await wait(800);
}

async function scrollToId(id) {
  await page.evaluate(i => {
    const el = document.getElementById(i);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, id);
  await wait(1000);
}

async function scrollBy(px) {
  await page.evaluate(y => window.scrollBy({ top: y, behavior: 'smooth' }), px);
  await wait(600);
}

async function scrollTop() {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await wait(600);
}

async function waitForAPI() {
  await wait(1500);
}

// ── Public site screenshots ───────────────────────────────────────────────────
async function publicSite() {
  console.log('\n📄  Public Site Screenshots');

  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
  await waitForAPI();

  // TC-01-01: Full navbar (top of page)
  await page.setViewport({ width: 1280, height: 800 });
  await scrollTop();
  await shot('TC-01-01');

  // TC-01-02: Scrolled navbar (with background)
  await page.evaluate(() => window.scrollTo({ top: 300 }));
  await wait(600);
  await shot('TC-01-02');

  // TC-02-01: Language button (go back to top, zoom to navbar)
  await scrollTop();
  await page.setViewport({ width: 1280, height: 200 });
  await shot('TC-02-01');
  await page.setViewport({ width: 1280, height: 800 });

  // TC-02-02: Switch to English
  await page.click('.lang-btn');
  await wait(500);
  await shot('TC-02-02');

  // TC-02-04: Switch back to Thai
  await page.click('.lang-btn');
  await wait(500);
  await shot('TC-02-04');

  // TC-03-01: Banner section (Thai)
  await scrollTop();
  await wait(500);
  await shot('TC-03-01');

  // TC-03-02: Banner after auto-advance (wait 5s)
  console.log('   ⏳  Waiting for banner auto-advance...');
  await wait(5000);
  await shot('TC-03-02');

  // TC-03-06: Banner text overlay close-up
  await scrollTop();
  await wait(500);
  await page.setViewport({ width: 1280, height: 600 });
  await shot('TC-03-06');
  await page.setViewport({ width: 1280, height: 800 });

  // TC-04-01: Catalog section (category pills)
  await scrollToId('catalog');
  await shot('TC-04-01');

  // TC-04-02: Category selected (click first category)
  const catPills = await page.$$('.cat-pill');
  if (catPills.length > 1) {
    await catPills[1].click();
    await wait(600);
    await shot('TC-04-02');
  }

  // TC-04-05: Active pill close-up
  await page.setViewport({ width: 1280, height: 400 });
  await scrollToId('catalog');
  await shot('TC-04-05');
  await page.setViewport({ width: 1280, height: 800 });

  // Reset to All
  await catPills[0].click();
  await wait(400);

  // TC-05-01: Product grid overview
  await scrollToId('products');
  await wait(600);
  await shot('TC-05-01');

  // TC-05-02: Product card close-up
  await page.setViewport({ width: 600, height: 700 });
  await scrollToId('products');
  await wait(400);
  await shot('TC-05-02');
  await page.setViewport({ width: 1280, height: 800 });

  // TC-06-01: Product modal open
  await scrollToId('products');
  await wait(400);
  const firstCard = await page.$('.product-card');
  if (firstCard) {
    await firstCard.click();
    await wait(800);
    await shot('TC-06-01');

    // TC-06-02: Modal with gallery
    await shot('TC-06-02');

    // TC-06-09: Modal in English
    await page.click('.lang-btn'); // switch to EN
    await wait(500);
    await shot('TC-06-09');
    await page.click('.lang-btn'); // switch back to TH
    await wait(400);

    // Close modal
    const closeBtn = await page.$('.btn-close');
    if (closeBtn) await closeBtn.click();
    await wait(400);
  }

  // TC-07-01: Contact form
  await scrollToId('contact');
  await wait(600);
  await shot('TC-07-01');

  // TC-07-02: Validation (try to submit empty)
  await page.click('.btn-primary');
  await wait(400);
  await shot('TC-07-02');

  // TC-07-04: Fill and submit contact form
  await page.type('input[type="text"]', 'ทดสอบระบบ');
  await page.type('textarea', 'ต้องการทดสอบแบบฟอร์มติดต่อ');
  await page.click('.btn-primary');
  await wait(1000);
  await shot('TC-07-04');

  // TC-08-01: Footer
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight }));
  await wait(600);
  await shot('TC-08-01');
}

// ── Admin panel screenshots ───────────────────────────────────────────────────
async function adminSite() {
  console.log('\n🔐  Admin Panel Screenshots');

  // TC-09-01: Login page
  await page.goto(`${ADMIN}/login`, { waitUntil: 'networkidle0' });
  await wait(600);
  await shot('TC-09-01');

  // TC-09-03: Wrong password error
  await page.type('input[autocomplete="username"]',         'admin');
  await page.type('input[autocomplete="current-password"]', 'wrongpass');
  await page.click('button[type="submit"]');
  await wait(1000);
  await shot('TC-09-03');

  // TC-09-04: Correct login → redirect to admin
  await page.evaluate(() => {
    document.querySelectorAll('input').forEach(i => { i.value = ''; });
  });
  await wait(300);
  await page.type('input[autocomplete="username"]',         'admin');
  await page.type('input[autocomplete="current-password"]', 'admin1234');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {});
  await wait(1000);
  await shot('TC-09-04');

  // TC-10-01: Banner management
  await page.goto(`${ADMIN}/banners`, { waitUntil: 'networkidle0' });
  await wait(800);
  await shot('TC-10-01');

  // TC-10-02: Add banner form open
  const addBannerBtn = await page.$('.btn-primary');
  if (addBannerBtn) {
    await addBannerBtn.click();
    await wait(500);
    await shot('TC-10-02');
    // Close modal
    const close = await page.$('.btn-close');
    if (close) await close.click();
    await wait(300);
  }

  // TC-10-04: Banner list with data
  await shot('TC-10-04');

  // TC-10-06: Edit banner form
  const editBtns = await page.$$('.btn-outline');
  if (editBtns.length > 0) {
    await editBtns[0].click();
    await wait(500);
    await shot('TC-10-06');
    const close = await page.$('.btn-close');
    if (close) await close.click();
    await wait(300);
  }

  // TC-11-01: Category management
  await page.goto(`${ADMIN}/categories`, { waitUntil: 'networkidle0' });
  await wait(800);
  await shot('TC-11-01');

  // TC-11-03: Add category form
  const addCatBtn = await page.$('.btn-primary');
  if (addCatBtn) {
    await addCatBtn.click();
    await wait(500);
    await shot('TC-11-03');
    const close = await page.$('.btn-close');
    if (close) await close.click();
    await wait(300);
  }

  // TC-12-01: Product management
  await page.goto(`${ADMIN}/products`, { waitUntil: 'networkidle0' });
  await wait(800);
  await shot('TC-12-01');

  // TC-12-02: Add product form
  const addProdBtn = await page.$('.btn-primary');
  if (addProdBtn) {
    await addProdBtn.click();
    await wait(500);
    await shot('TC-12-02');
    const close = await page.$('.btn-close');
    if (close) await close.click();
    await wait(300);
  }

  // TC-12-04: Product list with images
  await shot('TC-12-04');

  // TC-13-01: Contact submissions
  await page.goto(`${ADMIN}/contacts`, { waitUntil: 'networkidle0' });
  await wait(800);
  await shot('TC-13-01');

  // TC-13-03: Unread row highlighted
  await shot('TC-13-03');

  // TC-13-04: Mark as read
  const markReadBtn = await page.$('button.badge');
  if (markReadBtn) {
    await markReadBtn.click();
    await wait(600);
    await shot('TC-13-04');
  }

  // TC-15-01: Site Settings page
  await page.goto(`${ADMIN}/settings`, { waitUntil: 'networkidle0' });
  await wait(800);
  await shot('TC-15-01');

  // TC-15-02: Brand Identity section close-up
  await page.setViewport({ width: 1280, height: 500 });
  await shot('TC-15-02');
  await page.setViewport({ width: 1280, height: 800 });

  // TC-15-03: Fill company name and save
  const nameTH = await page.$('input[placeholder*="Rose Gold"]');
  const nameEN = await page.$('input[placeholder*="Rose Gold Beauty"]');
  if (nameTH) {
    await nameTH.click({ clickCount: 3 });
    await nameTH.type('ร้านความงาม Rose Gold');
  }
  if (nameEN) {
    await nameEN.click({ clickCount: 3 });
    await nameEN.type('Rose Gold Beauty');
  }
  const saveBtn = await page.$('.save-btn');
  if (saveBtn) {
    await saveBtn.click();
    await wait(1200);
    await shot('TC-15-03');
  }

  // TC-15-04: Reload settings — data persists
  await page.reload({ waitUntil: 'networkidle0' });
  await wait(800);
  await shot('TC-15-04');

  // TC-15-08: Fill social media links
  await page.goto(`${ADMIN}/settings`, { waitUntil: 'networkidle0' });
  await wait(600);
  const lineInput = await page.$('input[placeholder*="lin.ee"]');
  const fbInput   = await page.$('input[placeholder*="facebook"]');
  if (lineInput) { await lineInput.click({ clickCount: 3 }); await lineInput.type('https://lin.ee/example'); }
  if (fbInput)   { await fbInput.click({ clickCount: 3 }); await fbInput.type('https://facebook.com/example'); }
  const saveBtn2 = await page.$('.save-btn');
  if (saveBtn2) { await saveBtn2.click(); await wait(1200); }
  await shot('TC-15-08');

  // TC-09-06: Logout
  const logoutBtn = await page.$('.logout-btn');
  if (logoutBtn) {
    await logoutBtn.click();
    await wait(800);
    await shot('TC-09-06');
  }
}

// ── Public site banner screenshot (after login confirm banner is live) ─────────
async function publicAfterData() {
  console.log('\n🌐  Public Site — After Data');

  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
  await waitForAPI();

  // TC-10-05: Banner visible on public site
  await scrollTop();
  await shot('TC-10-05');

  // TC-11-04: Category pills on public site
  await scrollToId('catalog');
  await wait(600);
  await shot('TC-11-04');

  // TC-12-05: Product grid with real products
  await scrollToId('products');
  await wait(600);
  await shot('TC-12-05');

  // TC-12-06: Product modal from real data
  const cards = await page.$$('.product-card');
  if (cards.length > 0) {
    await cards[0].click();
    await wait(800);
    await shot('TC-12-06');
    // TC-12-08: With price visible
    await shot('TC-12-08');
    const closeBtn = await page.$('.btn-close');
    if (closeBtn) await closeBtn.click();
    await wait(300);
  }

  // TC-07-07: Contact section with LINE button
  await scrollToId('contact');
  await wait(400);
  await shot('TC-07-07');

  // TC-16-01: Navbar shows brand name from settings
  await scrollTop();
  await wait(400);
  await page.setViewport({ width: 1280, height: 200 });
  await shot('TC-16-01');
  await page.setViewport({ width: 1280, height: 800 });

  // TC-16-02: Brand name switches with language
  await page.click('.lang-btn');
  await wait(500);
  await page.setViewport({ width: 1280, height: 200 });
  await shot('TC-16-02');
  await page.setViewport({ width: 1280, height: 800 });
  await page.click('.lang-btn');
  await wait(400);

  // TC-16-04: Footer with brand name and social icons
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight }));
  await wait(600);
  await shot('TC-16-04');

  // TC-16-06: Footer social icons close-up
  await page.setViewport({ width: 1280, height: 300 });
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight }));
  await wait(400);
  await shot('TC-16-06');
  await page.setViewport({ width: 1280, height: 800 });

  // TC-16-11: LINE button in contact section
  await scrollToId('contact');
  await wait(600);
  await shot('TC-16-11');
}

// ── Responsive screenshots ────────────────────────────────────────────────────
async function responsive() {
  console.log('\n📱  Responsive Screenshots');

  const mobile = { width: 375, height: 812 };
  const tablet = { width: 768, height: 1024 };

  await page.setViewport(mobile);
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await waitForAPI();

  // TC-14-01: Mobile homepage
  await scrollTop();
  await shot('TC-14-01');

  // TC-14-02: Mobile navbar
  await page.setViewport({ width: 375, height: 200 });
  await shot('TC-14-02');
  await page.setViewport(mobile);

  // TC-14-03: Mobile product grid
  await scrollToId('products');
  await shot('TC-14-03');

  // TC-14-04: Mobile product modal
  const card = await page.$('.product-card');
  if (card) {
    await card.click();
    await wait(700);
    await shot('TC-14-04');
    const closeBtn = await page.$('.btn-close');
    if (closeBtn) await closeBtn.click();
    await wait(300);
  }

  // TC-14-05: Mobile contact form
  await scrollToId('contact');
  await shot('TC-14-05');

  // TC-14-06: Tablet admin
  await page.setViewport(tablet);
  await page.goto(`${ADMIN}/banners`, { waitUntil: 'networkidle0' });
  await wait(800);
  await shot('TC-14-06');

  // Reset viewport
  await page.setViewport({ width: 1280, height: 800 });
}

// ── Entry point ───────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🚀  Capturing screenshots → ${OUTDIR}\n`);

  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Set default navigation timeout
  page.setDefaultNavigationTimeout(30000);
  page.setDefaultTimeout(15000);

  try {
    await publicSite();
    await adminSite();
    await publicAfterData();
    await responsive();
    console.log(`\n✅  Done! ${fs.readdirSync(OUTDIR).length} screenshots saved to:\n    ${OUTDIR}\n`);
  } catch (err) {
    console.error('\n❌  Error:', err.message);
    await shot('ERROR_last-state').catch(() => {});
  } finally {
    await browser.close();
  }
}

main();
