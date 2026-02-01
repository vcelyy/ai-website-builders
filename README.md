# AI Website Builders - Affiliate Content Site

> **Status:** LIVE | **URL:** https://vcelyy.github.io/ai-website-builders/
> **Revenue:** $0/month (awaiting affiliate signups)
> **Pages:** 468 comprehensive reviews, comparisons, and guides

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (port 8002)
npm run dev

# Build for production
npm run build
```

**Dev Server:** http://localhost:8002

---

## Project Overview

This is an affiliate content site reviewing and comparing AI-powered website builders. The site earns revenue through affiliate commissions when users sign up for website builders through our links.

### Revenue Model

- **Primary:** Affiliate commissions (30-70% per referral, often recurring)
- **Target:** $2,000/month at maturity
- **Path to First Dollar:** 14-30 days after joining affiliate programs

### Key Metrics

| Metric | Value |
|--------|-------|
| Total Pages | 468 |
| Reviews | 27 tools |
| Comparisons | 150+ |
| Guides | 114 |
| Niche Pages | 87+ |
| Build Time | ~90 seconds |
| Site Size | ~54MB |

---

## Getting Started

### 1. Join Affiliate Programs

See **[AFFILIATE-SIGNUP-GUIDE.md](AFFILIATE-SIGNUP-GUIDE.md)** for step-by-step instructions.

**Priority Order:**
1. **10Web** (70% commission) - https://10web.io/affiliate-program/
2. **Webflow** (50% commission) - https://university.webflow.com/affiliate-program
3. **Framer** (30% commission) - Check framer.com footer
4. **Relume** (30% commission) - Check relume.io footer
5. **Durable** (25% commission) - https://durable.co/affiliate

### 2. Update Affiliate Codes

Edit `src/config/affiliate-links.ts`:
- Replace `YOUR_CODE` with your actual affiliate IDs
- Line 28: 10Web
- Line 45: Framer
- Line 62: Durable
- Line 79: Relume
- Line 96: Webflow
- (Plus 17 other programs)

### 3. Rebuild and Deploy

```bash
npm run build
git add src/config/affiliate-links.ts
git commit -m "Update affiliate codes"
git push
```

GitHub Pages will automatically rebuild and deploy.

---

## Project Structure

```
ai-website-builders/
├── src/
│   ├── config/
│   │   └── affiliate-links.ts    # Affiliate URLs (22 programs)
│   ├── layouts/
│   │   └── Layout.astro           # Main layout with SEO
│   ├── pages/
│   │   ├── index.astro            # Homepage
│   │   ├── reviews/               # 27 review pages
│   │   ├── comparisons/           # 150+ comparison pages
│   │   ├── guides/                # 114 guide pages
│   │   └── best-ai-website-builder-for-*.astro  # 87+ niche pages
│   └── components/
│       ├── TestingEvidence.astro  # Testing proof component
│       └── AffiliateCTA.astro     # Call-to-action with affiliate links
├── docs/
│   ├── 00_PROJECT_BRIEF.md        # What is this?
│   ├── 01_BUSINESS_MODEL.md       # How it makes money
│   ├── 06_STATUS.md               # Current progress
│   └── AFFILIATE-SIGNUP-GUIDE.md  # Step-by-step signup
├── public/
│   └── robots.txt                 # SEO configuration
├── dist/                          # Build output (468 pages)
├── AFFILIATE-SIGNUP-GUIDE.md      # Quick signup guide
├── QUICK-REFERENCE.md             # Common commands & reference
├── TESTING-CHECKLIST.md           # Pre/post-deployment testing
└── README.md                      # This file
```

---

## Common Commands

```bash
# Build the site
npm run build

# Start dev server
npm run dev

# Check affiliate placeholders (before signups)
grep -c "YOUR_CODE" src/config/affiliate-links.ts
# Output: 22 = needs signups, 0 = ready ✅

# Count built pages
find dist -name "*.html" | wc -l

# Check build size
du -sh dist

# Preview production build
npm run preview
```

---

## Documentation

| File | Purpose |
|------|---------|
| [AFFILIATE-SIGNUP-GUIDE.md](AFFILIATE-SIGNUP-GUIDE.md) | Step-by-step affiliate signup |
| [QUICK-REFERENCE.md](QUICK-REFERENCE.md) | Commands, structure, quick stats |
| [TESTING-CHECKLIST.md](TESTING-CHECKLIST.md) | Pre/post-deployment testing |
| [docs/06_STATUS.md](docs/06_STATUS.md) | Detailed project status |
| [docs/01_BUSINESS_MODEL.md](docs/01_BUSINESS_MODEL.md) | How the site makes money |

---

## Quality Audit (2026-02-01)

**Technical Quality: 9/10**
- Build: 468 pages, 54MB, 93 seconds ✅
- Content: Authentic, detailed with real testing evidence ✅
- SEO: Complete (meta, schema, OG tags, sitemap) ✅
- Internal Links: Working correctly ✅
- Duplicate Content: None detected ✅
- Deployment: LIVE ✅

**Business Quality: 0/10 (Revenue Blocked)**
- Affiliate Links: 22 placeholder codes ❌
- Action Required: Join affiliate programs (see guide above)

---

## Affiliate Configuration

**File:** `src/config/affiliate-links.ts`

**Example (10Web):**
```typescript
'10web': {
  name: '10Web AI',
  url: 'https://10web.io/ai-website-builder/',
  affiliateUrl: 'https://10web.io/?ref=YOUR_CODE',  // Replace YOUR_CODE
  commission: '70%',
  recurring: 'recurring',
  freeTrial: true,
  ctaText: 'Try 10Web Free',
  programUrl: 'https://10web.io/affiliate-program/'
}
```

---

## Deployment

This site is deployed on GitHub Pages:

**URL:** https://vcelyy.github.io/ai-website-builders/

**Configuration:**
- Base: `/ai-website-builders`
- Source: `dist/` folder
- Auto-deploys on push to main branch

---

## Revenue Timeline

| Week | Expected Activity |
|------|------------------|
| Week 1 | Join programs, update codes, rebuild site |
| Week 2-3 | Start sharing site (social media, communities) |
| Week 4-6 | First referrals likely (with traffic) |
| Month 2-3 | Consistent referrals if traffic continues |

**Target:** $2,000/month (25 referrals @ $80 avg commission)

---

## Tech Stack

- **Framework:** Astro (static site generator)
- **Styling:** Tailwind CSS
- **Hosting:** GitHub Pages
- **Deployment:** GitHub Actions (auto-build on push)
- **Analytics:** TBD (GA4 or Plausible)

---

## Next Actions

1. ✅ Site is LIVE
2. ⏳ **Join 10Web affiliate program** (70% commission!)
3. ⏳ Update `YOUR_CODE` placeholders in `src/config/affiliate-links.ts`
4. ⏳ Rebuild and deploy
5. ⏳ Join other affiliate programs (Webflow, Framer, etc.)
6. ⏳ Generate traffic (share site, engage communities)

**See [AFFILIATE-SIGNUP-GUIDE.md](AFFILIATE-SIGNUP-GUIDE.md) for detailed instructions.**

---

## License

This project is proprietary. All rights reserved.

---

## Contact

**Project Location:** `/root/business-projects/ai-website-builders/`
**Dev Server Port:** 8002
**Production URL:** https://vcelyy.github.io/ai-website-builders/
