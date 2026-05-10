# Manual Test Cases — Cosmetic Website

**Project:** Cosmetic One-Page Website
**Version:** 1.1.0
**Prepared by:** QA Engineer
**Last Updated:** 2026-05-06

---

## How to Use This Document

1. Open `http://localhost:5173/` in browser before testing
2. Work through each test case in order
3. Capture screenshot after each step where noted 📸
4. Mark result: ✅ Pass / ❌ Fail / ⏭ Skip
5. Fill in `TEST_REPORT_TEMPLATE.md` with results

---

## Test Sections

- [TC-01 Navigation Bar](#tc-01--navigation-bar)
- [TC-02 Language Switcher](#tc-02--language-switcher)
- [TC-03 Banner Slider](#tc-03--banner-slider)
- [TC-04 Category Filter](#tc-04--category-filter)
- [TC-05 Product Grid](#tc-05--product-grid)
- [TC-06 Product Detail Modal](#tc-06--product-detail-modal)
- [TC-07 Contact Form](#tc-07--contact-form)
- [TC-08 Footer](#tc-08--footer)
- [TC-09 Admin Login](#tc-09--admin-login)
- [TC-10 Admin Banner Management](#tc-10--admin-banner-management)
- [TC-11 Admin Category Management](#tc-11--admin-category-management)
- [TC-12 Admin Product Management](#tc-12--admin-product-management)
- [TC-13 Admin Contact Viewer](#tc-13--admin-contact-viewer)
- [TC-14 Responsive / Mobile](#tc-14--responsive--mobile)
- [TC-15 Admin Site Settings](#tc-15--admin-site-settings)
- [TC-16 Site Settings — Public Reflection](#tc-16--site-settings--public-reflection)

---

## TC-01 — Navigation Bar

**Preconditions:** Site loaded at `http://localhost:5173/`

| ID | Step | Expected Result | Screenshot | Result |
|----|------|----------------|-----------|--------|
| TC-01-01 | Open homepage | Navbar visible at top with brand name and menu links | 📸 TC-01-01.png | |
| TC-01-02 | Scroll down 200px | Navbar becomes sticky with background and shadow | 📸 TC-01-02.png | |
| TC-01-03 | Click "Products" menu link | Page scrolls smoothly to products section | | |
| TC-01-04 | Click "Contact" menu link | Page scrolls smoothly to contact section | | |
| TC-01-05 | Click "Home" menu link | Page scrolls back to top | | |
| TC-01-06 | Click "Catalog" menu link | Page scrolls to catalog section | | |

---

## TC-02 — Language Switcher

**Preconditions:** Site loaded, default language is Thai (TH)

| ID | Step | Expected Result | Screenshot | Result |
|----|------|----------------|-----------|--------|
| TC-02-01 | Observe navbar language button | Button shows "EN" (current is TH) | 📸 TC-02-01.png | |
| TC-02-02 | Click the language button | All UI text switches to English. Button now shows "TH" | 📸 TC-02-02.png | |
| TC-02-03 | Reload the page | Language remains English (saved in localStorage) | | |
| TC-02-04 | Click language button again | All UI text switches back to Thai | 📸 TC-02-04.png | |
| TC-02-05 | Check product names in both languages | Product names display correctly in each language | | |
| TC-02-06 | Check banner text in both languages | Banner title/subtitle display correctly | | |

---

## TC-03 — Banner Slider

**Preconditions:** At least 2 banners added via admin panel

| ID | Step | Expected Result | Screenshot | Result |
|----|------|----------------|-----------|--------|
| TC-03-01 | Load homepage | First banner image visible with title overlay | 📸 TC-03-01.png | |
| TC-03-02 | Wait 5 seconds | Slider auto-advances to next banner | 📸 TC-03-02.png | |
| TC-03-03 | Click right arrow (›) | Advances to next slide | | |
| TC-03-04 | Click left arrow (‹) | Goes back to previous slide | | |
| TC-03-05 | Click dot indicator #2 | Jumps directly to banner 2 | | |
| TC-03-06 | Check text overlay | Title and subtitle display on top of image | 📸 TC-03-06.png | |
| TC-03-07 | Click "Shop Now" button | Page scrolls to products section | | |

---

## TC-04 — Category Filter

**Preconditions:** At least 2 categories and products added via admin

| ID | Step | Expected Result | Screenshot | Result |
|----|------|----------------|-----------|--------|
| TC-04-01 | Scroll to catalog section | Category pills visible including "All" button | 📸 TC-04-01.png | |
| TC-04-02 | Click a specific category | Products grid updates to show only that category | 📸 TC-04-02.png | |
| TC-04-03 | Click "All" button | All products display again | | |
| TC-04-04 | Click another category | Only products in that category shown | | |
| TC-04-05 | Active category pill | Selected category has rose gold background | 📸 TC-04-05.png | |

---

## TC-05 — Product Grid

**Preconditions:** At least 4 products added via admin

| ID | Step | Expected Result | Screenshot | Result |
|----|------|----------------|-----------|--------|
| TC-05-01 | Scroll to products section | Products displayed in responsive grid | 📸 TC-05-01.png | |
| TC-05-02 | Observe product card | Shows: image, name, price (if set) | 📸 TC-05-02.png | |
| TC-05-03 | Hover over product card | Card lifts with shadow effect | | |
| TC-05-04 | Product without price | No price line shown on card | | |
| TC-05-05 | Check image display | Images fill card without distortion | | |

---

## TC-06 — Product Detail Modal

**Preconditions:** At least 1 product with multiple images

| ID | Step | Expected Result | Screenshot | Result |
|----|------|----------------|-----------|--------|
| TC-06-01 | Click any product card | Modal popup opens with product detail | 📸 TC-06-01.png | |
| TC-06-02 | Check modal content | Shows: image gallery, name, price, description | 📸 TC-06-02.png | |
| TC-06-03 | Click right arrow in gallery | Next product image shown | | |
| TC-06-04 | Click thumbnail image | Main image switches to that thumbnail | | |
| TC-06-05 | Check ingredients section | Ingredients text visible (if filled) | | |
| TC-06-06 | Check usage section | Usage instructions visible (if filled) | | |
| TC-06-07 | Click outside modal (overlay) | Modal closes | | |
| TC-06-08 | Click ✕ close button | Modal closes | | |
| TC-06-09 | Switch language while modal open | Product name and description switch language | 📸 TC-06-09.png | |

---

## TC-07 — Contact Form

**Preconditions:** Site loaded, contact section visible

| ID | Step | Expected Result | Screenshot | Result |
|----|------|----------------|-----------|--------|
| TC-07-01 | Scroll to contact section | Form visible with Name, Email, Phone, Message fields | 📸 TC-07-01.png | |
| TC-07-02 | Submit empty form | Validation prevents submit (Name and Message required) | 📸 TC-07-02.png | |
| TC-07-03 | Fill Name only, submit | Validation still blocks (Message required) | | |
| TC-07-04 | Fill all required fields and submit | Success message appears in green | 📸 TC-07-04.png | |
| TC-07-05 | Check fields after submit | Form resets to empty | | |
| TC-07-06 | Submit without Email and Phone | Succeeds (these are optional) | | |
| TC-07-07 | Check admin contacts panel | New submission appears in `/admin/contacts` | 📸 TC-07-07.png | |
| TC-07-08 | Click LINE OA button | Opens LINE (or placeholder) | | |

---

## TC-08 — Footer

| ID | Step | Expected Result | Screenshot | Result |
|----|------|----------------|-----------|--------|
| TC-08-01 | Scroll to footer | Footer visible with dark background | 📸 TC-08-01.png | |
| TC-08-02 | Check brand name | Brand name visible in rose gold | | |
| TC-08-03 | Check copyright year | Shows current year | | |
| TC-08-04 | Check social icons | Facebook and Instagram icons visible | | |

---

## TC-09 — Admin Login

**Preconditions:** Backend running on port 3000

| ID | Step | Expected Result | Screenshot | Result |
|----|------|----------------|-----------|--------|
| TC-09-01 | Go to `/admin/login` | Login page displays with username/password fields | 📸 TC-09-01.png | |
| TC-09-02 | Submit empty form | HTML validation blocks submit | | |
| TC-09-03 | Enter wrong password, submit | Error message "Invalid username or password" | 📸 TC-09-03.png | |
| TC-09-04 | Enter correct credentials (admin / admin1234) | Redirected to `/admin/banners` | 📸 TC-09-04.png | |
| TC-09-05 | Go to `/admin` while logged in | Redirects to `/admin/banners` | | |
| TC-09-06 | Click Logout in sidebar | Redirected to `/admin/login` | 📸 TC-09-06.png | |
| TC-09-07 | Go to `/admin/banners` after logout | Redirected to login (route guard) | | |

---

## TC-10 — Admin Banner Management

**Preconditions:** Logged in as admin

| ID | Step | Expected Result | Screenshot | Result |
|----|------|----------------|-----------|--------|
| TC-10-01 | Click Banners in sidebar | Banner list page shown | 📸 TC-10-01.png | |
| TC-10-02 | Click "+ Add Banner" | Form modal opens | 📸 TC-10-02.png | |
| TC-10-03 | Submit form without image | Validation error shown | | |
| TC-10-04 | Upload image + fill TH/EN title, save | New banner appears in table | 📸 TC-10-04.png | |
| TC-10-05 | Go to public site | New banner appears in slider | 📸 TC-10-05.png | |
| TC-10-06 | Click Edit on a banner | Form opens pre-filled with existing data | 📸 TC-10-06.png | |
| TC-10-07 | Change title and save | Updated title appears in table | | |
| TC-10-08 | Toggle is_active to false | Banner no longer shows on public site | | |
| TC-10-09 | Click Delete | Confirmation prompt appears | | |
| TC-10-10 | Confirm delete | Banner removed from table | 📸 TC-10-10.png | |

---

## TC-11 — Admin Category Management

**Preconditions:** Logged in as admin

| ID | Step | Expected Result | Screenshot | Result |
|----|------|----------------|-----------|--------|
| TC-11-01 | Click Categories in sidebar | Category list page shown | 📸 TC-11-01.png | |
| TC-11-02 | Click "+ Add Category" | Form modal opens | | |
| TC-11-03 | Fill Name TH + Name EN, save | Category appears in table with auto slug | 📸 TC-11-03.png | |
| TC-11-04 | Go to public site | New category pill appears in catalog section | 📸 TC-11-04.png | |
| TC-11-05 | Edit category name | Updated name shows in table and public site | | |
| TC-11-06 | Delete category | Removed from table; products in it show no category | | |

---

## TC-12 — Admin Product Management

**Preconditions:** Logged in as admin, at least 1 category exists

| ID | Step | Expected Result | Screenshot | Result |
|----|------|----------------|-----------|--------|
| TC-12-01 | Click Products in sidebar | Product list shown | 📸 TC-12-01.png | |
| TC-12-02 | Click "+ Add Product" | Form modal opens with all fields | 📸 TC-12-02.png | |
| TC-12-03 | Fill Name TH + Name EN only, save | Product created (other fields optional) | | |
| TC-12-04 | Upload 3 images for a product | All 3 appear in existing images area | 📸 TC-12-04.png | |
| TC-12-05 | Go to public site | Product appears in grid with first image | 📸 TC-12-05.png | |
| TC-12-06 | Click product on public site | Modal shows all 3 images with gallery | 📸 TC-12-06.png | |
| TC-12-07 | Edit product — remove 1 image | Image removed from gallery | | |
| TC-12-08 | Set price on product | Price shows on product card and modal | 📸 TC-12-08.png | |
| TC-12-09 | Leave price empty | No price line shown on card | | |
| TC-12-10 | Toggle is_active to false | Product no longer shows on public site | | |
| TC-12-11 | Delete product | Removed from table and public site | | |

---

## TC-13 — Admin Contact Viewer

**Preconditions:** Submit contact form on public site first

| ID | Step | Expected Result | Screenshot | Result |
|----|------|----------------|-----------|--------|
| TC-13-01 | Click Contacts in sidebar | Submission list shown, newest first | 📸 TC-13-01.png | |
| TC-13-02 | Check unread count header | Shows correct number of unread | | |
| TC-13-03 | Unread row highlighted | Row has light orange background | 📸 TC-13-03.png | |
| TC-13-04 | Click "Mark Read" on a submission | Badge changes to green "Read" | 📸 TC-13-04.png | |
| TC-13-05 | Refresh page | Read status persists | | |

---

## TC-14 — Responsive / Mobile

**Preconditions:** Use browser DevTools → Toggle device toolbar (F12 → Ctrl+Shift+M)
Test at: 375px (iPhone), 768px (iPad)

| ID | Step | Expected Result | Screenshot | Result |
|----|------|----------------|-----------|--------|
| TC-14-01 | View homepage at 375px | All sections visible, no horizontal scroll | 📸 TC-14-01.png | |
| TC-14-02 | Check navbar at 375px | Menu links hidden (mobile layout) | 📸 TC-14-02.png | |
| TC-14-03 | Check product grid at 375px | Single column layout | 📸 TC-14-03.png | |
| TC-14-04 | Open product modal at 375px | Modal stacks vertically (image on top) | 📸 TC-14-04.png | |
| TC-14-05 | Check contact form at 375px | Fields stack vertically, form usable | 📸 TC-14-05.png | |
| TC-14-06 | View admin panel at 768px | Sidebar + content visible | 📸 TC-14-06.png | |

---

---

## TC-15 — Admin Site Settings

**Preconditions:** Logged in as admin, go to `http://localhost:5173/admin/settings`

| ID | Step | Expected Result | Screenshot | Result |
|----|------|----------------|-----------|--------|
| TC-15-01 | Click ⚙️ Settings in sidebar | Site Settings page opens with 3 sections: Brand Identity, Social Media, Footer | 📸 TC-15-01.png | |
| TC-15-02 | Check Brand Identity section | Fields: Company Name (TH), Company Name (EN), Logo upload visible | 📸 TC-15-02.png | |
| TC-15-03 | Enter company name TH + EN, click Save | Success message "บันทึกสำเร็จแล้ว!" appears in green | 📸 TC-15-03.png | |
| TC-15-04 | Reload the settings page | Previously saved company name TH + EN still filled | 📸 TC-15-04.png | |
| TC-15-05 | Click "เลือกไฟล์รูปโลโก้", pick an image file | Logo preview appears in the preview box | 📸 TC-15-05.png | |
| TC-15-06 | Click Save with logo selected | Success message shown; logo preview stays | 📸 TC-15-06.png | |
| TC-15-07 | Reload settings page | Previously uploaded logo appears in preview box | 📸 TC-15-07.png | |
| TC-15-08 | Enter LINE OA URL (e.g. https://lin.ee/test) and save | Success message shown | | |
| TC-15-09 | Enter Facebook URL and save | Success message shown | | |
| TC-15-10 | Enter Instagram URL and save | Success message shown | | |
| TC-15-11 | Enter TikTok URL and save | Success message shown | | |
| TC-15-12 | Enter Footer text TH + EN and save | Success message shown | | |
| TC-15-13 | Leave all social URLs empty and save | Success; no error — fields are optional | | |
| TC-15-14 | Enter invalid URL (e.g. "notaurl") in LINE field | Browser validation blocks submit | | |
| TC-15-15 | Click Save with no changes | Success message shown; nothing breaks | | |

---

## TC-16 — Site Settings — Public Reflection

**Preconditions:** TC-15 completed with company name, social links, and LINE OA filled and saved.  
Open public site at `http://localhost:5173/` in a new tab.

| ID | Step | Expected Result | Screenshot | Result |
|----|------|----------------|-----------|--------|
| TC-16-01 | Check Navbar brand name | Shows the company name saved in settings (TH or EN based on language) | 📸 TC-16-01.png | |
| TC-16-02 | Switch language | Navbar brand name switches between TH and EN names | 📸 TC-16-02.png | |
| TC-16-03 | If logo uploaded: check Navbar | Logo image replaces brand text in navbar | 📸 TC-16-03.png | |
| TC-16-04 | Scroll to Footer | Company name shows correctly (TH/EN based on current language) | 📸 TC-16-04.png | |
| TC-16-05 | Check Footer copyright text | Shows saved footer text (TH/EN based on language) | 📸 TC-16-05.png | |
| TC-16-06 | Check Footer social icons | LINE, Facebook, Instagram, TikTok icons visible (only ones with URLs set) | 📸 TC-16-06.png | |
| TC-16-07 | Click Facebook icon in Footer | Opens Facebook page in new tab | | |
| TC-16-08 | Click Instagram icon in Footer | Opens Instagram in new tab | | |
| TC-16-09 | Click TikTok icon in Footer | Opens TikTok in new tab | | |
| TC-16-10 | Click LINE icon in Footer | Opens LINE OA in new tab | | |
| TC-16-11 | Scroll to Contact section | LINE OA button visible (only if LINE URL is set in settings) | 📸 TC-16-11.png | |
| TC-16-12 | Click LINE OA button in Contact | Opens LINE OA page in new tab | | |
| TC-16-13 | Clear LINE OA URL in settings, save, refresh public site | LINE button disappears from Contact section; LINE icon gone from Footer | 📸 TC-16-13.png | |
| TC-16-14 | Clear all social URLs, save, refresh public site | Footer shows placeholder Facebook + Instagram icons only | 📸 TC-16-14.png | |

---

## Screenshot Naming Convention

```
TC-[section]-[step].png

Examples:
  TC-03-01.png  ← Banner slider, step 01
  TC-06-01.png  ← Product modal, step 01
  BUG-001.png   ← Bug evidence screenshot
```

Save all screenshots to: `docs/testing/screenshots/YYYY-MM-DD/`
