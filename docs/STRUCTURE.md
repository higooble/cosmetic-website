# Cosmetic Website — Project Structure

## Directory Overview

```
cosmetic-website/
├── CONTRIBUTING.md                ← dev & test policy (branch, commit, release gate)
├── package.json                   ← root scripts: seed, screenshot, manual
├── generate-manual.js             ← generates English user manual (.docx)
├── generate-manual-th.js          ← generates Thai user manual (.docx)
├── scripts/
│   ├── seed-data.js               ← seed banners, categories, products via API
│   └── capture-screenshots.js     ← Puppeteer: 48 automated TC screenshots
├── docs/                          ← project documentation
│   ├── REQUIREMENTS.md
│   ├── STRUCTURE.md
│   ├── CONFIG.md
│   ├── TEAM.md
│   ├── Cosmetic_User_Manual.docx  ← English user manual (generated)
│   ├── คู่มือการใช้งาน_Cosmetic.docx ← Thai user manual (generated)
│   └── testing/
│       ├── MANUAL_TEST_CASES.md
│       ├── TEST_REPORT_TEMPLATE.md
│       └── screenshots/
│           └── YYYY-MM-DD/        ← TC-XX-XX.png per test run
├── database/
│   └── schema.sql                 ← MySQL database schema (6 tables)
├── backend/                       ← Express.js REST API (port 3000)
│   ├── .env                       ← environment variables (not in git)
│   ├── .env.example               ← env template for new developers
│   ├── package.json
│   ├── uploads/                   ← uploaded image files (served statically)
│   ├── tests/
│   │   ├── setup.js               ← Jest env vars (PORT=3001, test JWT_SECRET)
│   │   ├── auth.test.js
│   │   ├── banners.test.js
│   │   ├── categories.test.js
│   │   ├── products.test.js
│   │   └── contacts.test.js
│   └── src/
│       ├── app.js                 ← Express config: middleware, routes (no listen)
│       ├── server.js              ← entry point: loads app.js + calls app.listen()
│       ├── config/
│       │   ├── db.js              ← MySQL connection pool
│       │   └── __mocks__/
│       │       └── db.js          ← Jest auto-mock for database
│       ├── middleware/
│       │   ├── auth.js            ← JWT verification middleware
│       │   └── upload.js          ← Multer file upload config
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── bannerController.js
│       │   ├── categoryController.js
│       │   ├── productController.js
│       │   └── contactController.js
│       └── routes/
│           ├── public.js          ← open API routes (no auth)
│           └── admin.js           ← protected API routes (JWT required)
└── frontend/                      ← Vue.js SPA (port 5173)
    ├── index.html                 ← HTML entry point + Google Fonts
    ├── vite.config.js             ← Vite config + API proxy
    ├── package.json
    └── src/
        ├── main.js                ← app bootstrap (Vue + Pinia + Router + i18n)
        ├── App.vue                ← root component
        ├── router/
        │   └── index.js           ← route definitions + auth guard
        ├── stores/
        │   ├── auth.js            ← admin login state (Pinia)
        │   └── content.js         ← banners/categories/products (Pinia)
        ├── services/
        │   └── api.js             ← axios instance + JWT interceptor
        ├── locales/
        │   ├── th.json            ← Thai UI translations
        │   └── en.json            ← English UI translations
        ├── assets/
        │   └── styles/
        │       └── main.css       ← global CSS + Rose Gold theme variables
        ├── views/
        │   ├── PublicHome.vue     ← one-page public layout
        │   ├── AdminLayout.vue    ← admin shell with sidebar
        │   └── admin/
        │       └── LoginView.vue  ← admin login page
        ├── __tests__/
        │   ├── stores/
        │   │   └── auth.test.js
        │   └── components/
        │       └── NavBar.test.js
        └── components/
            ├── public/            ← public-facing components
            │   ├── NavBar.vue
            │   ├── BannerSection.vue
            │   ├── CatalogSection.vue
            │   ├── ProductGrid.vue
            │   ├── ProductModal.vue
            │   ├── ContactSection.vue
            │   └── FooterSection.vue
            └── admin/             ← admin CMS components
                ├── BannerManager.vue
                ├── CategoryManager.vue
                ├── ProductManager.vue
                └── ContactViewer.vue
```

---

## Frontend Architecture

### Routing

| Path | Component | Auth Required |
|------|-----------|--------------|
| `/` | PublicHome.vue | No |
| `/admin/login` | LoginView.vue | No |
| `/admin` | AdminLayout.vue | Yes |
| `/admin/banners` | BannerManager.vue | Yes |
| `/admin/categories` | CategoryManager.vue | Yes |
| `/admin/products` | ProductManager.vue | Yes |
| `/admin/contacts` | ContactViewer.vue | Yes |

### State Management (Pinia)

```
auth store
├── token         ← JWT token (from localStorage)
├── username      ← logged-in admin name
├── isLoggedIn    ← computed getter
├── login()       ← POST /api/admin/login → store token
└── logout()      ← clear token + redirect

content store
├── banners[]     ← fetched from GET /api/banners
├── categories[]  ← fetched from GET /api/categories
├── products[]    ← fetched from GET /api/products
├── loading       ← loading state flag
├── fetchAll()    ← fetch all 3 in parallel
└── fetchProducts(categoryId) ← filter by category
```

### API Service (Axios)

```
api.js
├── baseURL: /api              ← proxied to localhost:3000 in dev
├── request interceptor        ← attach Authorization: Bearer <token>
└── response interceptor       ← on 401 → clear token → redirect to login
```

### i18n Flow

```
User clicks TH/EN toggle
→ locale.value changes
→ localStorage saves preference
→ all t('key') calls re-render in new language
→ dynamic content (products/banners) reads name_th or name_en from API data
```

---

## Backend Architecture

### app.js vs server.js Split

`app.js` configures Express (middleware, routes) and exports the app — it never calls `app.listen()`.  
`server.js` imports the app and calls `app.listen()`. This split is required so Jest/Supertest can import the app without starting a real server and causing port conflicts between test files.

### Request Flow

```
HTTP Request
→ Express Router (app.js)
→ Middleware (CORS, JSON parser, static /uploads)
→ Route match
    → Public route   → Controller → MySQL query → JSON response
    → Admin route    → auth.js (verify JWT) → Controller → MySQL → JSON
```

### File Upload Flow

```
Admin uploads image
→ POST multipart/form-data
→ upload.js (Multer)
    → validate: jpeg/jpg/png/webp only, max 5MB
    → save to: backend/uploads/<timestamp>-<random>.<ext>
→ Controller saves /uploads/<filename> path to DB
→ Frontend reads image via GET /uploads/<filename>
```

### JWT Authentication Flow

```
Admin login
→ POST /api/admin/login { username, password }
→ bcrypt.compare(password, hash)
→ jwt.sign({ id, username }, JWT_SECRET, { expiresIn: '24h' })
→ return { token, username }

Subsequent admin requests
→ Authorization: Bearer <token> header
→ auth middleware: jwt.verify(token, JWT_SECRET)
→ attach req.admin = decoded payload
→ pass to controller
```

---

## Database Relationships

```
categories ──< products >── product_images
                │
                (category_id FK, SET NULL on delete)

products ──< product_images
              (product_id FK, CASCADE DELETE)

admin_users    (standalone)
banners        (standalone)
contact_submissions (standalone)
```

---

## CSS Theme System

All colors defined as CSS custom properties in `main.css`:

```css
:root {
  --primary:   #C9967A;   /* Dusty Rose */
  --accent:    #C8A96E;   /* Warm Gold */
  --bg:        #FAF7F5;   /* Ivory White */
  --text:      #2C2C2C;   /* Deep Charcoal */
  --muted:     #9A8F8A;   /* Warm Gray */
  --white:     #FFFFFF;
  --border:    #E8DDD9;
  --shadow:    0 4px 20px rgba(201,150,122,0.15);
  --radius:    12px;
  --transition: 0.3s ease;
}
```

Fonts (Google Fonts):
- `Playfair Display` — headings (English)
- `Inter` — body text (English)
- `Sarabun` — Thai text

---

## Port Map

| Port | Service | Notes |
|------|---------|-------|
| 5173 | Vue.js dev server | Browser access point |
| 3000 | Express API | Internal, not opened in browser |
| 3306 | MySQL | Internal only |

In production (VPS), Nginx replaces port 5173 and proxies `/api` to port 3000.
