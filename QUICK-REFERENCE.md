# Quick Reference: AI Website Builders Project

> **Last Updated:** 2026-02-01
> **Site Status:** LIVE at https://vcelyy.github.io/ai-website-builders/
> **Revenue Status:** $0 (awaiting affiliate signups)

---

## 1. Build the Site

```bash
cd /root/business-projects/ai-website-builders
npm run build
```

**Expected Output:**
- Pages: 468
- Size: ~54MB
- Time: ~90 seconds
- Errors: 0

---

## 2. Start Dev Server

```bash
npm run dev
```

**Server:** http://localhost:8002

---

## 3. Verify Affiliate Links

### Check current status:
```bash
grep -c "YOUR_CODE" src/config/affiliate-links.ts
```

**Output:** `22` means all placeholders (needs fix)
**Output:** `0` means all real codes (ready!)

### Test locally:
```bash
npm run build
# Open dist/index.html in browser
# Click any affiliate link
# Check URL contains your affiliate ID
```

### Correct format:
```
https://10web.io/?ref=abc123  ✅ (your actual ID)
https://10web.io/?ref=YOUR_CODE  ❌ (placeholder)
```

---

## 4. Deploy to GitHub Pages

### After updating affiliate codes:
```bash
git add src/config/affiliate-links.ts
git commit -m "Update affiliate codes"
git push
```

GitHub Actions will automatically rebuild and deploy.

### Verify deployment:
https://vcelyy.github.io/ai-website-builders/

---

## 5. Join Affiliate Programs (Priority Order)

| Priority | Program | Commission | Signup URL |
|----------|---------|------------|------------|
| 1 | 10Web | 70% recurring | https://10web.io/affiliate-program/ |
| 2 | Webflow | 50% (year 1) | https://university.webflow.com/affiliate-program |
| 3 | Framer | 30% recurring | https://framer.com/ |
| 4 | Relume | 30% recurring | https://relume.io/ |
| 5 | Durable | 25% recurring | https://durable.co/affiliate |

**Estimated earnings per referral:**
- 10Web: $14-35/month
- Webflow: $8-25/month
- Framer: $5-10/month
- Relume: $5-10/month
- Durable: $3-8/month

---

## 6. Affiliate Link Configuration

**File:** `src/config/affiliate-links.ts`

**Example (10Web at line 28):**
```typescript
'10web': {
  name: '10Web AI',
  url: 'https://10web.io/ai-website-builder/',
  affiliateUrl: 'https://10web.io/?ref=YOUR_CODE',  // CHANGE THIS
  commission: '70%',
  // ...
}
```

**Steps:**
1. Get your affiliate ID from the program
2. Replace `YOUR_CODE` with your actual ID
3. Save the file
4. Rebuild: `npm run build`
5. Deploy: `git push`

---

## 7. Project Structure

```
ai-website-builders/
├── src/
│   ├── config/
│   │   └── affiliate-links.ts    # Affiliate URLs (22 programs)
│   ├── layouts/
│   │   └── Layout.astro           # Main layout
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
│   └── AFFILIATE-SIGNUP-GUIDE.md  # Step-by-step signup instructions
├── public/
│   └── robots.txt                 # SEO: allows all crawlers
└── dist/                          # Build output (468 pages)
```

---

## 8. Key Files

| File | Purpose |
|------|---------|
| `src/config/affiliate-links.ts` | All affiliate URLs (22 programs) |
| `AFFILIATE-SIGNUP-GUIDE.md` | Step-by-step signup instructions |
| `docs/06_STATUS.md` | Project status and metrics |
| `astro.config.mjs` | Site configuration (port 8002) |

---

## 9. Quick Stats

| Metric | Value |
|--------|-------|
| Total Pages | 468 |
| Reviews | 27 tools |
| Comparisons | 150+ |
| Guides | 114 |
| Niche "Best For" Pages | 87+ |
| Affiliate Programs | 22 |
| Build Time | ~90 seconds |
| Site Size | ~54MB |

---

## 10. Revenue Timeline

| Week | Expected Activity |
|------|------------------|
| Week 1 | Join programs, update codes, rebuild site |
| Week 2-3 | Start sharing site (social media, communities) |
| Week 4-6 | First referrals likely (with traffic) |
| Month 2-3 | Consistent referrals if traffic continues |

**Target:** $2,000/month at maturity (25 referrals @ $80 avg commission)

---

## 11. Common Commands

```bash
# Build
npm run build

# Dev server
npm run dev

# Check affiliate placeholders
grep -c "YOUR_CODE" src/config/affiliate-links.ts

# Count pages
find dist -name "*.html" | wc -l

# Check build size
du -sh dist

# Git status
git status
```

---

## 12. Troubleshooting

**Build errors?**
- Check: `npm run build` output for specific error
- Fix: Edit the file mentioned in error
- Retry: `npm run build`

**Affiliate links not working?**
- Check: `grep "YOUR_CODE" src/config/affiliate-links.ts`
- If found: Replace with real affiliate codes
- Rebuild: `npm run build`

**Site not updating on GitHub Pages?**
- Check: `git push` succeeded
- Wait: 2-5 minutes for GitHub Actions to build
- Refresh: https://vcelyy.github.io/ai-website-builders/

---

## 13. Next Actions (Priority Order)

1. ✅ Site is LIVE
2. ⏳ Join 10Web affiliate program (70% commission!)
3. ⏳ Update `YOUR_CODE` in `src/config/affiliate-links.ts`
4. ⏳ Rebuild and deploy
5. ⏳ Join other affiliate programs (Webflow, Framer, etc.)
6. ⏳ Generate traffic (share site, engage communities)
7. ⏳ Monitor analytics (set up GA4 or Plausible)

---

## 14. Contact & Support

**Project Location:** `/root/business-projects/ai-website-builders/`
**Dev Server Port:** 8002
**Production URL:** https://vcelyy.github.io/ai-website-builders/

**Key Documentation:**
- Full signup guide: `AFFILIATE-SIGNUP-GUIDE.md`
- Project status: `docs/06_STATUS.md`
- Business model: `docs/01_BUSINESS_MODEL.md`
