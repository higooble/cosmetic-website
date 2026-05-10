const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const TODAY = '2026-05-10';
const OUTDIR = path.join(__dirname, '..', 'docs', 'testing', 'screenshots', TODAY);
fs.mkdirSync(OUTDIR, { recursive: true });

const BASE  = 'https://cosmetic-website-six.vercel.app';
const ADMIN = BASE + '/admin';

let browser, page;

async function shot(name) {
  const p = path.join(OUTDIR, name + '.png');
  await page.screenshot({ path: p });
  console.log('captured: ' + name + '.png');
}
async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
async function scrollTop() { await page.evaluate(() => window.scrollTo(0, 0)); await wait(600); }
async function scrollToId(id) {
  await page.evaluate(i => {
    const el = document.getElementById(i);
    if (el) el.scrollIntoView({ block: 'start' });
  }, id);
  await wait(800);
}

async function main() {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // ── Public site ──────────────────────────────────────────────────────────────
  console.log('\nPublic site...');
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 60000 });
  await wait(2000);

  await scrollTop();
  await shot('TC-01-01');

  await page.evaluate(() => window.scrollTo(0, 300));
  await wait(600);
  await shot('TC-01-02');

  await scrollTop();
  await shot('TC-03-01');
  await wait(5000);
  await shot('TC-03-02');

  await scrollToId('catalog');
  await shot('TC-04-01');

  await scrollToId('products');
  await shot('TC-05-01');

  // Product modal
  await scrollToId('products');
  const card = await page.$('.product-card');
  if (card) {
    await card.click();
    await wait(1000);
    await shot('TC-06-01');
    const closeBtn = await page.$('.btn-close');
    if (closeBtn) await closeBtn.click();
    await wait(400);
  }

  // Contact
  await scrollToId('contact');
  await wait(600);
  await shot('TC-07-01');

  // Footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await wait(600);
  await shot('TC-08-01');

  // Mobile
  console.log('\nMobile...');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 60000 });
  await wait(2000);
  await scrollTop();
  await shot('TC-14-01');
  await page.setViewport({ width: 1280, height: 800 });

  // ── Admin ────────────────────────────────────────────────────────────────────
  console.log('\nAdmin...');
  await page.goto(ADMIN + '/login', { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(1000);
  await shot('TC-09-01');

  // Login
  const userInput = await page.$('input[type="text"]') || await page.$('input[autocomplete="username"]');
  const passInput = await page.$('input[type="password"]');
  if (userInput) await userInput.type('admin');
  if (passInput) await passInput.type('admin1234');
  await page.click('button[type="submit"]');
  await wait(3000);
  await shot('TC-09-04');

  await page.goto(ADMIN + '/banners', { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(1000);
  await shot('TC-10-01');

  await page.goto(ADMIN + '/categories', { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(1000);
  await shot('TC-11-01');

  await page.goto(ADMIN + '/products', { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(1000);
  await shot('TC-12-01');

  await page.goto(ADMIN + '/contacts', { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(1000);
  await shot('TC-13-01');

  await page.goto(ADMIN + '/settings', { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(1000);
  await shot('TC-15-01');

  await browser.close();
  const count = fs.readdirSync(OUTDIR).filter(f => f.endsWith('.png')).length;
  console.log('\nDone! ' + count + ' screenshots saved to: ' + OUTDIR);
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
