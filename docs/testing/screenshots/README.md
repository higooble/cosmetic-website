# Screenshots Folder

## Environments Tested

| Date | Environment | Tester | Result |
|------|-------------|--------|--------|
| 2026-05-10 | Production (Vercel + Render + Aiven + Cloudinary) | QA | ✅ Pass |

## Production URLs (2026-05-10)

| Service | URL |
|---------|-----|
| Public site | https://cosmetic-website-six.vercel.app |
| Admin panel | https://cosmetic-website-six.vercel.app/admin/login |
| Backend API | https://cosmetic-website-44p2.onrender.com |

## Folder Structure

```
screenshots/
└── YYYY-MM-DD/          ← one folder per test cycle date (env: local or production)
    ├── TC-01-01.png
    ├── TC-01-02.png
    ├── TC-03-01.png
    └── BUG-001.png
```

## Naming Convention

| Type | Format | Example |
|------|--------|---------|
| Test case screenshot | `TC-[section]-[step].png` | `TC-03-01.png` |
| Bug evidence | `BUG-[number].png` | `BUG-001.png` |

## How to Capture Screenshots (Windows)

- **Snipping Tool:** Press `Win + Shift + S` → select area → paste into Paint → Save as PNG
- **Full screen:** Press `PrtScn` → paste into Paint → Save as PNG
- **Browser window only:** Press `Alt + PrtScn`
- **Browser DevTools:** F12 → three-dot menu → "Capture screenshot"

## How to Capture at Mobile Size

1. Press `F12` to open DevTools
2. Press `Ctrl + Shift + M` to toggle device toolbar
3. Select device (iPhone 375px, iPad 768px)
4. Take screenshot and name it `TC-14-XX.png`
