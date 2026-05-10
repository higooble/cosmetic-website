# Sprint Plan — Cosmetic Website

**Last Updated:** 2026-05-06
**Current Sprint:** Sprint 1 — Content & Branding

---

## What's Already Done (Sprint 0 — Completed)

| Area | Status |
|---|---|
| Frontend — all public pages (Banner, Products, Categories, Contact, Footer) | ✅ |
| Admin panel — CRUD for Banners, Categories, Products, Contacts | ✅ |
| Backend API — all endpoints (Express + MySQL) | ✅ |
| Authentication — JWT login/logout | ✅ |
| Thai/English bilingual support | ✅ |
| File upload — product images | ✅ |
| Unit tests — frontend + backend | ✅ |
| User manuals — Thai + English (auto-generated) | ✅ |
| Database schema | ✅ |

---

## Sprint 1 — Content & Branding (1 week)

> **Goal:** Fill in real client content so the site looks like a real brand

| # | Task | Who | Status | Notes |
|---|---|---|---|---|
| 1.1 | Build Site Settings admin page | Frontend Dev | ✅ Done (2026-05-06) | Admin → ⚙️ Settings page created |
| 1.2 | Backend settings API + DB table | Backend Dev | ✅ Done (2026-05-06) | `site_settings` table + GET/PUT endpoints |
| 1.3 | Public site reads settings (Navbar, Footer, Contact) | Frontend Dev | ✅ Done (2026-05-06) | Brand name, logo, social links, LINE OA |
| 1.4 | Update manual test cases (TC-15, TC-16) | QA | ✅ Done (2026-05-06) | Added to MANUAL_TEST_CASES.md |
| 1.5 | Update REQUIREMENTS.md + SPRINT_PLAN.md | Team Lead | ✅ Done (2026-05-06) | Docs reflect new feature |
| 1.6 | Client fills company name in Settings | Admin (Client) | ⏳ Pending client | Use Admin → ⚙️ Settings |
| 1.7 | Client uploads brand logo | Admin (Client) | ⏳ Pending client | Upload via Admin → ⚙️ Settings |
| 1.8 | Client adds LINE OA + social links | Admin (Client) | ⏳ Pending client | Enter via Admin → ⚙️ Settings |
| 1.9 | Replace seed/sample products with real products | Admin (Client) | ⏳ Pending client | Use Master Data Template Excel |
| 1.10 | Upload real banner images | Admin (Client) | ⏳ Pending client | 3 banners recommended |
| 1.11 | Final content review with client | Team Lead | ⏳ Pending client | Sign-off before Sprint 2 |

---

## Sprint 2 — Deployment (1 week)

> **Goal:** Get the site live on Oracle Cloud Free VPS

| # | Task | Who | Notes |
|---|---|---|---|
| 2.1 | Create Oracle Cloud Free account & VM | Team Lead | Ubuntu 22.04, ARM instance |
| 2.2 | Install Node.js, MySQL, Nginx, PM2 on server | Backend Dev | Setup server environment |
| 2.3 | Import database schema + seed real data | Backend Dev | Run `schema.sql` on production MySQL |
| 2.4 | Deploy backend API with PM2 | Backend Dev | Auto-restart on crash |
| 2.5 | Build frontend (`npm run build`) & serve via Nginx | Frontend Dev | Point domain to frontend |
| 2.6 | Configure domain name + SSL (Let's Encrypt) | Backend Dev | HTTPS required |
| 2.7 | Set production `.env` variables | Backend Dev | New `JWT_SECRET`, DB credentials |
| 2.8 | Smoke test all features on live server | QA | Use manual test cases (14 TCs already written) |

---

## Sprint 3 — Post-Launch & Improvements (1–2 weeks)

> **Goal:** Stability, monitoring, and quick-win improvements

| # | Task | Who | Priority |
|---|---|---|---|
| 3.1 | Monitor error logs, fix any production bugs | Backend Dev | High |
| 3.2 | Set up automatic MySQL backup (daily cron) | Backend Dev | High |
| 3.3 | Add image compression on upload (reduce file size) | Backend Dev | Medium |
| 3.4 | Add pagination to product grid (if products grow > 20) | Frontend Dev | Medium |
| 3.5 | Add SEO meta tags (title, description per page) | Frontend Dev | Medium |
| 3.6 | Google Analytics or simple visitor counter | Frontend Dev | Low |
| 3.7 | PM2 monitoring dashboard | Backend Dev | Low |

---

## Timeline Summary

```
Week 1   │ Sprint 1 — Content & Branding
Week 2   │ Sprint 2 — Deployment (VPS Setup + Go Live)
Week 3-4 │ Sprint 3 — Post-Launch Fixes & Improvements
```

---

## Biggest Blocker

> **Client must provide before Sprint 1 can finish:**
> - Logo file
> - Company name
> - LINE OA ID
> - Social media links (Facebook, Instagram, TikTok)
> - Real product photos
