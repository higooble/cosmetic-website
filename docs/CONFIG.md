# Cosmetic Website — Configuration Guide

## 1. Prerequisites

| Software | Minimum Version | Download |
|----------|----------------|---------|
| Node.js | 18+ | nodejs.org |
| npm | 9+ | included with Node.js |
| MySQL | 8+ | mysql.com |

---

## 2. Environment Variables (Backend)

File location: `backend/.env`

Copy from template:
```bash
cp backend/.env.example backend/.env
```

| Variable | Example Value | Description |
|----------|--------------|-------------|
| `PORT` | `3000` | Express server port |
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | `root` | MySQL username |
| `DB_PASSWORD` | `your_password` | MySQL password |
| `DB_NAME` | `cosmetic_db` | Database name |
| `JWT_SECRET` | `long_random_string` | Secret key for JWT signing — keep private |
| `UPLOAD_DIR` | `uploads` | Directory for uploaded images (relative to backend/) |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin |

> **Important:** Never commit `.env` to git. It is already in `.gitignore`.

### JWT Secret
Generate a strong secret for production:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 3. Database Setup

### Step 1 — Create database and tables
```bash
# Windows (PowerShell)
Get-Content database/schema.sql | & "C:\Program Files\MySQL\MySQL Server 9.7\bin\mysql.exe" -u root -p

# Mac / Linux
mysql -u root -p < database/schema.sql
```

### Step 2 — Verify tables created
```sql
USE cosmetic_db;
SHOW TABLES;
```
Expected output:
```
admin_users
banners
categories
contact_submissions
product_images
products
```

### Step 3 — Default admin account
| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin1234` |
| Email | `admin@cosmetic.com` |

> **Change the default password after first login** — update via the DB or add a change-password feature.

---

## 4. Local Development Setup

### Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Start servers

```bash
# Terminal 1 — Backend API
cd backend
npm run dev        # nodemon, auto-restarts on file changes

# Terminal 2 — Frontend
cd frontend
npm run dev        # Vite hot-reload dev server
```

### Access URLs

| URL | Purpose |
|-----|---------|
| `http://localhost:5173/` | Public website |
| `http://localhost:5173/admin/login` | Admin panel login |
| `http://localhost:3000/api/banners` | API test (browser) |

---

## 5. Frontend Configuration

### Vite Proxy (`frontend/vite.config.js`)

In development, Vite proxies API calls so the frontend doesn't need to know the backend URL:

```js
proxy: {
  '/api':     { target: 'http://localhost:3000', changeOrigin: true },
  '/uploads': { target: 'http://localhost:3000', changeOrigin: true },
}
```

This means:
- Frontend calls `/api/banners`
- Vite forwards it to `http://localhost:3000/api/banners`
- No CORS issues in development

### Language Default

Change the default language in `frontend/src/main.js`:
```js
locale: localStorage.getItem('lang') || 'th',   // change 'th' to 'en' for English default
```

---

## 6. Image Upload Configuration

| Setting | Value | Location |
|---------|-------|----------|
| Max file size | 5 MB | `backend/src/middleware/upload.js` |
| Allowed types | jpeg, jpg, png, webp | `backend/src/middleware/upload.js` |
| Max images per product | 10 | `backend/src/routes/admin.js` |
| Storage location | `backend/uploads/` | `.env → UPLOAD_DIR` |
| Public URL | `/uploads/<filename>` | served by Express static |

To change max file size (e.g. 10 MB):
```js
// backend/src/middleware/upload.js
limits: { fileSize: 10 * 1024 * 1024 }
```

---

## 7. Admin Panel Configuration

### Change Admin Password
Run in `backend/` directory:
```bash
node -e "
require('dotenv').config();
const db = require('./src/config/db');
const b  = require('bcryptjs');
b.hash('YOUR_NEW_PASSWORD', 10).then(async hash => {
  await db.query('UPDATE admin_users SET password_hash=? WHERE username=?', [hash, 'admin']);
  console.log('Password updated');
  process.exit(0);
});
"
```

### Add New Admin User
```bash
node -e "
require('dotenv').config();
const db = require('./src/config/db');
const b  = require('bcryptjs');
b.hash('PASSWORD', 10).then(async hash => {
  await db.query('INSERT INTO admin_users (username, email, password_hash) VALUES (?,?,?)', ['newadmin', 'email@example.com', hash]);
  console.log('Admin created');
  process.exit(0);
});
"
```

---

## 8. LINE OA Configuration

When LINE OA link is confirmed, update `frontend/src/components/public/ContactSection.vue`:

```html
<!-- Find this line and replace # with your LINE OA URL -->
<a href="https://line.me/ti/p/YOUR_LINE_ID" class="btn btn-outline line-btn" target="_blank">
```

---

## 9. Customize Brand Info

### Company name & social links
Edit `frontend/src/components/public/FooterSection.vue`:
```html
<div class="brand">✦ YOUR BRAND NAME</div>

<!-- Update social media hrefs -->
<a href="https://facebook.com/yourpage" aria-label="Facebook">
<a href="https://instagram.com/yourpage" aria-label="Instagram">
```

### Website title
Edit `frontend/index.html`:
```html
<title>Your Brand Name</title>
```

### Brand name in navbar
Edit `frontend/src/components/public/NavBar.vue`:
```html
<span class="brand">✦ Your Brand Name</span>
```

---

## 10. Production Deployment (VPS)

### Server Requirements
- Ubuntu 20.04+ or Debian 11+
- Node.js 18+
- MySQL 8+
- Nginx
- PM2 (process manager)
- SSL certificate (Let's Encrypt / Certbot)

### Step 1 — Build frontend
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

### Step 2 — Install PM2
```bash
npm install -g pm2
cd backend
pm2 start src/server.js --name cosmetic-api
pm2 save
pm2 startup
```

### Step 3 — Nginx config
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve Vue SPA static files
    root /var/www/cosmetic/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to Express
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Serve uploaded images
    location /uploads/ {
        alias /var/www/cosmetic/backend/uploads/;
    }
}
```

### Step 4 — SSL (HTTPS)
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

### Environment variables for production
Update `backend/.env`:
```
PORT=3000
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=<strong_random_secret>
```

---

## 11. Color Theme Customization

All colors are in `frontend/src/assets/styles/main.css`:

```css
:root {
  --primary:   #C9967A;   /* main brand color — buttons, links, accents */
  --accent:    #C8A96E;   /* secondary accent — gradients */
  --bg:        #FAF7F5;   /* page background */
  --text:      #2C2C2C;   /* body text */
  --muted:     #9A8F8A;   /* secondary text, labels */
  --border:    #E8DDD9;   /* input borders, dividers */
}
```

Change only these 6 variables to completely retheme the site.

---

## 12. Scripts Reference

### Backend & Frontend

| Command | Directory | Description |
|---------|-----------|-------------|
| `npm run dev` | `backend/` | Start API with auto-reload (nodemon) |
| `npm start` | `backend/` | Start API (production) |
| `npm test` | `backend/` | Run Jest unit tests |
| `npm run dev` | `frontend/` | Start Vite dev server |
| `npm run build` | `frontend/` | Build for production |
| `npm run preview` | `frontend/` | Preview production build locally |
| `npm test` | `frontend/` | Run Vitest unit tests |

### Root-level (documentation pipeline)

| Command | Directory | Description |
|---------|-----------|-------------|
| `npm run seed` | root | Seed test data via API (banners, categories, products) |
| `npm run screenshot` | root | Capture 48 screenshots via Puppeteer |
| `npm run manual` | root | Full pipeline: seed → screenshot → English manual |
| `node generate-manual.js` | root | Generate English user manual (.docx) |
| `node generate-manual-th.js` | root | Generate Thai user manual (.docx) |

> Both servers (port 3000 and 5173) must be running before executing `seed` or `screenshot`.
