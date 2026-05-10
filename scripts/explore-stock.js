const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE = 'https://stock-pro-warehouse-management-w4w7.vercel.app';
const OUTDIR = path.join(__dirname, '..', 'docs', 'testing', 'screenshots', 'stock-explore');
fs.mkdirSync(OUTDIR, { recursive: true });

let browser, page;

async function shot(name) {
  const p = path.join(OUTDIR, name + '.png');
  await page.screenshot({ path: p, fullPage: false });
  console.log('captured: ' + name + '.png');
}
async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Login
  console.log('Logging in...');
  await page.goto(BASE + '/auth', { waitUntil: 'networkidle0', timeout: 60000 });
  await wait(1500);
  await shot('01-login');

  await page.type('input[type="email"]', 'admin@test.com');
  await page.type('input[type="password"]', '12345678');
  await shot('02-login-filled');
  await page.click('button[type="submit"]');
  await wait(3000);
  const url = page.url();
  console.log('After login URL:', url);
  await shot('03-after-login');

  // Get current URL and explore nav links
  const navLinks = await page.$$eval('a, [href]', els =>
    els.map(e => ({ text: e.textContent.trim().slice(0, 40), href: e.href || e.getAttribute('href') }))
       .filter(l => l.href && l.href.includes('vercel') && l.text)
  );
  console.log('Nav links found:', JSON.stringify(navLinks.slice(0, 20)));

  // Get sidebar/nav items
  const sidebarItems = await page.$$eval('nav a, aside a, .sidebar a, [class*="nav"] a, [class*="menu"] a', els =>
    els.map(e => ({ text: e.textContent.trim().slice(0, 40), href: e.href })).filter(l => l.text)
  );
  console.log('Sidebar items:', JSON.stringify(sidebarItems.slice(0, 20)));

  // Full page screenshot
  await page.screenshot({ path: path.join(OUTDIR, '03-after-login-full.png'), fullPage: true });
  console.log('captured: 03-after-login-full.png');

  // Try common routes
  const routes = ['/dashboard', '/products', '/inventory', '/stock', '/orders', '/reports', '/users', '/settings', '/warehouse', '/categories', '/suppliers', '/receiving', '/shipping'];
  for (const route of routes) {
    try {
      await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 15000 });
      await wait(1000);
      const currentUrl = page.url();
      if (!currentUrl.includes('/auth')) {
        const name = 'route-' + route.replace('/', '').replace(/\//g, '-') || 'home';
        await shot(name);
        console.log('Route exists: ' + route + ' → ' + currentUrl);
      }
    } catch(e) {}
  }

  await browser.close();
  const count = fs.readdirSync(OUTDIR).filter(f => f.endsWith('.png')).length;
  console.log('\nDone! ' + count + ' screenshots in: ' + OUTDIR);
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
