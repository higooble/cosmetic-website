# Cosmetic Website — Requirements

## 1. Project Overview

A one-page cosmetic brand website with:
- Public-facing landing page (Single Page Application)
- Admin panel for content management
- Multi-language support (Thai / English)

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | Vue.js 3 | ^3.4 |
| State Management | Pinia | ^2.1 |
| Routing | Vue Router | ^4.3 |
| Multi-language | Vue i18n | ^11 |
| HTTP Client | Axios | ^1.6 |
| Build Tool | Vite | ^5.2 |
| Backend Runtime | Node.js | ^25 |
| Backend Framework | Express.js | ^4.18 |
| Authentication | JWT (jsonwebtoken) | ^9.0 |
| File Upload | Multer | ^2.1 |
| Password Hashing | bcryptjs | ^2.4 |
| Database | MySQL | 9.7 |
| Database Client | mysql2 | ^3.6 |

---

## 3. User Roles

### 3.1 Public Visitor
| Feature | Description |
|---------|-------------|
| View landing page | Browse all public sections |
| Browse products | View product grid with images |
| Filter by category | Click category tab to filter products |
| View product detail | Click product to open modal popup |
| Switch language | Toggle Thai / English via navbar button |
| Submit contact form | Send name, email, phone, message |
| LINE OA | Button to open LINE Official Account chat |

### 3.2 Admin User
| Feature | Description |
|---------|-------------|
| Login / Logout | JWT-based authentication (24h token) |
| Manage banners | Create, edit, delete, reorder banner slides |
| Manage categories | Create, edit, delete product categories |
| Manage products | Create, edit, delete products + multi-image upload |
| View contacts | Read contact form submissions, mark as read |

---

## 4. Public Site Features (One-Page Layout)

### 4.1 Navigation Bar
- Sticky (stays on top while scrolling)
- Smooth scroll to each section on click
- Language switcher button (TH / EN)
- Brand logo / name on left

### 4.2 Banner Section
- Auto-advancing image slideshow (4.5 second interval)
- Left / right arrow controls
- Dot indicator navigation
- Text overlay: title + subtitle (TH/EN per language)
- Call-to-action button (Shop Now / ช้อปเลย)

### 4.3 Catalog Section
- Display all active product categories as pill buttons
- "All" button to reset filter
- Clicking a category filters the product grid below

### 4.4 Product Grid
- Responsive grid layout (auto-fill, min 240px per card)
- Each card shows: primary image, product name, price (if set)
- Hover effect on card
- Click to open product detail modal

### 4.5 Product Detail Modal
- Full-screen overlay popup
- Image gallery with thumbnail navigation
- Left / right arrow to switch images
- Product info: name, price, description
- Optional sections: ingredients, usage instructions
- All text fields display in selected language (TH/EN)

### 4.6 Contact Section
- Form fields: Name (required), Email, Phone, Message (required)
- Submit button → POST to API → show success/error message
- LINE OA button — only visible when LINE OA URL is configured in Site Settings

### 4.7 Footer
- Brand name (from Site Settings — TH/EN per language)
- Social media icon links — only shown when URLs are configured in Site Settings
- Copyright text (from Site Settings — TH/EN per language)
- Copyright year (auto-updated)

---

## 5. Admin Panel Features

### 5.1 Authentication
- Login page at `/admin/login`
- JWT token stored in localStorage
- Token expiry: 24 hours
- Auto-redirect to login if token missing or expired
- Protected routes via Vue Router navigation guard

### 5.2 Banner Management
- List all banners in table view
- Create new banner: upload image, set title TH/EN, subtitle TH/EN, sort order
- Edit existing banner (image optional — keep current if not replaced)
- Delete banner (with confirmation prompt)
- Toggle active/inactive status

### 5.3 Category Management
- List all categories in table view
- Create: name TH/EN, slug (auto-generated from EN name if blank), sort order
- Edit existing category
- Delete category (with confirmation)
- Toggle active/inactive status

### 5.4 Product Management
- List all products with primary image, name, category, price
- Create product:
  - Assign to category
  - Name TH / EN (required)
  - Description TH / EN
  - Ingredients TH / EN
  - Usage instructions TH / EN
  - Price (optional)
  - Sort order
  - Upload up to 10 images (first = primary)
- Edit product (add new images or remove individual images)
- Delete product (with confirmation)
- Toggle active/inactive

### 5.5 Contact Management
- List all submissions newest first
- Unread count shown in header
- Highlight unread rows
- Mark individual submission as read

### 5.6 Site Settings *(added 2026-05-06)*
- Single settings page at `/admin/settings`
- **Brand Identity:** Company name (TH/EN), logo image upload with preview
- **Social Media:** LINE OA URL, Facebook URL, Instagram URL, TikTok URL
- **Footer:** Copyright text (TH/EN)
- All settings persisted in `site_settings` table (single-row)
- Public site reads settings on load — changes reflect immediately on refresh

---

## 6. Multi-language Support

### Supported Languages
| Code | Language |
|------|----------|
| `th` | Thai (default) |
| `en` | English |

### Implementation
- UI static text: stored in `src/locales/th.json` and `src/locales/en.json`
- Dynamic content (products, banners): dual columns in database
  - `name_th` / `name_en`
  - `description_th` / `description_en`
  - `title_th` / `title_en`
  - etc.
- Language preference: saved in `localStorage`, persists across sessions

---

## 7. Database Design

### Tables

#### `admin_users`
| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT PK | |
| username | VARCHAR(100) UNIQUE | |
| email | VARCHAR(255) UNIQUE | |
| password_hash | VARCHAR(255) | bcrypt hashed |
| created_at | TIMESTAMP | |

#### `banners`
| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT PK | |
| image_url | VARCHAR(500) | path to uploaded file |
| title_th | VARCHAR(255) | |
| title_en | VARCHAR(255) | |
| subtitle_th | VARCHAR(500) | |
| subtitle_en | VARCHAR(500) | |
| sort_order | INT | ascending display order |
| is_active | BOOLEAN | default TRUE |
| created_at / updated_at | TIMESTAMP | |

#### `categories`
| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT PK | |
| name_th | VARCHAR(255) | |
| name_en | VARCHAR(255) | |
| slug | VARCHAR(255) UNIQUE | URL-friendly key |
| sort_order | INT | |
| is_active | BOOLEAN | |
| created_at / updated_at | TIMESTAMP | |

#### `products`
| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT PK | |
| category_id | INT FK | references categories(id) |
| name_th / name_en | VARCHAR(255) | required |
| description_th / description_en | TEXT | |
| ingredients_th / ingredients_en | TEXT | |
| usage_th / usage_en | TEXT | |
| price | DECIMAL(10,2) | optional |
| is_active | BOOLEAN | |
| sort_order | INT | |
| created_at / updated_at | TIMESTAMP | |

#### `product_images`
| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT PK | |
| product_id | INT FK | references products(id) CASCADE DELETE |
| image_url | VARCHAR(500) | |
| is_primary | BOOLEAN | first image = primary |
| sort_order | INT | |

#### `contact_submissions`
| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT PK | |
| name | VARCHAR(255) | required |
| email | VARCHAR(255) | optional |
| phone | VARCHAR(50) | optional |
| message | TEXT | required |
| is_read | BOOLEAN | default FALSE |
| created_at | TIMESTAMP | |

---

## 8. Completed Work

| Item | Date | Status |
|------|------|--------|
| Full project scaffolding (Vue + Express + MySQL) | 2026-05-03 | ✅ Done |
| Unit tests — backend (Jest + Supertest) | 2026-05-03 | ✅ Done |
| Unit tests — frontend (Vitest + Vue Test Utils) | 2026-05-03 | ✅ Done |
| Automated screenshot capture (Puppeteer — 48 TCs) | 2026-05-03 | ✅ Done |
| English user manual (.docx with real screenshots) | 2026-05-03 | ✅ Done |
| Thai user manual (.docx with real screenshots) | 2026-05-03 | ✅ Done |
| Development & testing policy (CONTRIBUTING.md) | 2026-05-03 | ✅ Done |
| Team structure & roles (TEAM.md) | 2026-05-03 | ✅ Done |
| Sprint plan (SPRINT_PLAN.md) | 2026-05-06 | ✅ Done |
| Admin Site Settings — company name, logo, social links, footer text | 2026-05-06 | ✅ Done |
| Public site reads settings — Navbar, Footer, Contact LINE button | 2026-05-06 | ✅ Done |
| `site_settings` database table + API endpoints | 2026-05-06 | ✅ Done |
| Manual test cases TC-15 + TC-16 (Site Settings) | 2026-05-06 | ✅ Done |

---

#### `site_settings` *(added 2026-05-06)*
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK DEFAULT 1 | single row only |
| company_name_th | VARCHAR(255) | brand name in Thai |
| company_name_en | VARCHAR(255) | brand name in English |
| logo_url | VARCHAR(500) | path to uploaded logo file |
| line_oa_url | VARCHAR(500) | LINE Official Account URL |
| facebook_url | VARCHAR(500) | Facebook page URL |
| instagram_url | VARCHAR(500) | Instagram account URL |
| tiktok_url | VARCHAR(500) | TikTok account URL |
| footer_text_th | VARCHAR(500) | copyright text in Thai |
| footer_text_en | VARCHAR(500) | copyright text in English |
| updated_at | TIMESTAMP | auto-updated on change |

---

## 9. Pending Items

| Item | Blocked By | Status |
|------|-----------|--------|
| LINE OA link | Client must provide LINE OA ID | Enter via Admin → Settings |
| Company name | Client confirmation | Enter via Admin → Settings |
| Social links (Facebook, IG, TikTok) | Client must provide URLs | Enter via Admin → Settings |
| Brand logo image | Client must provide logo file | Upload via Admin → Settings |
| VPS deployment (Nginx + PM2 + SSL) | Sprint 2 | Not yet started |
