const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE = 'https://stock-pro-warehouse-management-w4w7.vercel.app';
const TODAY = new Date().toISOString().split('T')[0];
const OUTDIR = path.join(__dirname, '..', 'docs', 'testing', 'screenshots', 'stock-' + TODAY);
fs.mkdirSync(OUTDIR, { recursive: true });

let browser, page;

async function shot(name) {
  const p = path.join(OUTDIR, name + '.png');
  await page.screenshot({ path: p, fullPage: false });
  console.log('captured: ' + name + '.png');
}
async function shotFull(name) {
  const p = path.join(OUTDIR, name + '.png');
  await page.screenshot({ path: p, fullPage: true });
  console.log('captured: ' + name + '.png (full)');
}
async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function waitForNoSpinner() {
  // Wait for common loading indicators to disappear
  try {
    await page.waitForFunction(() => {
      const spinners = document.querySelectorAll(
        '[class*="loading"], [class*="spinner"], [class*="skeleton"], [class*="shimmer"], .animate-pulse, [aria-busy="true"]'
      );
      return spinners.length === 0;
    }, { timeout: 10000 });
  } catch(e) {}
  await wait(500);
}

async function waitForTableData() {
  // Wait for table rows or data cards to appear
  try {
    await page.waitForFunction(() => {
      const rows = document.querySelectorAll('tbody tr, [class*="card"], [class*="item"], [class*="row"]');
      return rows.length > 0;
    }, { timeout: 10000 });
  } catch(e) {}
  await wait(800);
}

async function goto(route) {
  await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 });
  await wait(2000);
  await waitForNoSpinner();
  await waitForTableData();
  await wait(1000);
}

async function main() {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // ── Login ────────────────────────────────────────────────────────────────────
  console.log('\n[1] Login page');
  await page.goto(BASE + '/auth', { waitUntil: 'networkidle0', timeout: 60000 });
  await wait(2000);
  await shot('01-login');

  await page.type('input[type="email"]', 'admin@test.com');
  await page.type('input[type="password"]', '12345678');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
  await wait(3000);
  await waitForNoSpinner();
  console.log('Logged in. URL:', page.url());

  // ── Dashboard ────────────────────────────────────────────────────────────────
  console.log('\n[2] Dashboard');
  await goto('/dashboard');
  await shot('02-dashboard');
  await shotFull('02-dashboard-full');

  // ── Products ─────────────────────────────────────────────────────────────────
  console.log('\n[3] Products');
  await goto('/products');
  await shot('03-products');
  await shotFull('03-products-full');

  // Click first row for detail
  const firstRow = await page.$('tbody tr');
  if (firstRow) {
    await firstRow.click();
    await wait(2000);
    await waitForNoSpinner();
    await shot('03-product-detail');
    await page.keyboard.press('Escape');
    await wait(800);
  }

  // ── Customers ────────────────────────────────────────────────────────────────
  console.log('\n[4] Customers');
  await goto('/customers');
  await shot('04-customers');
  await shotFull('04-customers-full');

  // ── Suppliers ────────────────────────────────────────────────────────────────
  console.log('\n[5] Suppliers');
  await goto('/suppliers');
  await shot('05-suppliers');
  await shotFull('05-suppliers-full');

  // ── Inbound ──────────────────────────────────────────────────────────────────
  console.log('\n[6] Inbound products');
  await goto('/inbounds-products');
  await shot('06-inbounds');
  await shotFull('06-inbounds-full');

  // ── Outbound ─────────────────────────────────────────────────────────────────
  console.log('\n[7] Outbound products');
  await goto('/outbounds-products');
  await shot('07-outbounds');
  await shotFull('07-outbounds-full');

  // ── Mobile ───────────────────────────────────────────────────────────────────
  console.log('\n[8] Mobile views');
  await page.setViewport({ width: 375, height: 812 });

  await goto('/dashboard');
  await shot('08-mobile-dashboard');

  await goto('/products');
  await shot('08-mobile-products');

  await page.setViewport({ width: 1280, height: 800 });

  await browser.close();
  const count = fs.readdirSync(OUTDIR).filter(f => f.endsWith('.png')).length;
  console.log('\nDone! ' + count + ' screenshots → ' + OUTDIR);
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
