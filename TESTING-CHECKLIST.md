# Testing Checklist: AI Website Builders Site

> **Purpose:** Verify all functionality works correctly before and after deploying.
> **Use this:** After updating affiliate codes, making changes, or deploying.

---

## Section 1: Build Verification

### 1.1 Clean Build
- [ ] Run `npm run build`
- [ ] Verify 0 errors
- [ ] Verify ~468 pages built
- [ ] Verify build time < 120 seconds

### 1.2 Build Output Check
- [ ] Check `dist/` folder exists
- [ ] Check `dist/index.html` exists
- [ ] Check `dist/sitemap-index.xml` exists
- [ ] Check `dist/robots.txt` exists

---

## Section 2: Local Testing

### 2.1 Homepage
- [ ] Open `dist/index.html` in browser
- [ ] Verify page loads without errors
- [ ] Check all links work (hover to verify hrefs)
- [ ] Verify "127+ hours" stat appears
- [ ] Verify "23 sites tested" appears

### 2.2 Review Pages
- [ ] Open a review page (e.g., `dist/reviews/10web-ai/index.html`)
- [ ] Verify score badge appears
- [ ] Verify affiliate CTA button exists
- [ ] Check CTA button has affiliate link (not placeholder)

### 2.3 Comparison Pages
- [ ] Open a comparison (e.g., `dist/comparisons/framer-vs-webflow/index.html`)
- [ ] Verify comparison table renders
- [ ] Check both tools have review links
- [ ] Verify verdict section appears

### 2.4 Guide Pages
- [ ] Open a guide (e.g., `dist/guides/best-ai-website-builders-2026/index.html`)
- [ ] Verify "Unexpected Findings" section exists
- [ ] Check internal links work
- [ ] Verify recommendations appear

---

## Section 3: Affiliate Link Testing

### 3.1 Placeholder Check (Before Signup)
```bash
grep -c "YOUR_CODE" src/config/affiliate-links.ts
```
- [ ] Returns `22` = needs affiliate signups
- [ ] Returns `0` = all codes configured ✅

### 3.2 Affiliate Link Test (After Signup)
- [ ] Click a 10Web CTA button
- [ ] Verify URL format: `https://10web.io/?ref=[YOUR_ID]`
- [ ] Verify `YOUR_CODE` is NOT in URL
- [ ] Test 2-3 different affiliate links

### 3.3 Programs to Verify
- [ ] 10Web (70% commission)
- [ ] Webflow (50% commission)
- [ ] Framer (30% commission)
- [ ] Durable (25% commission)
- [ ] Relume (30% commission)

---

## Section 4: SEO Verification

### 4.1 Meta Tags (Use Browser DevTools)
- [ ] Open homepage in browser
- [ ] Press F12 (Developer Tools)
- [ ] Check `<title>` tag exists
- [ ] Check `<meta name="description">` exists
- [ ] Check canonical URL exists

### 4.2 Open Graph Tags
- [ ] Check `<meta property="og:title">` exists
- [ ] Check `<meta property="og:description">` exists
- [ ] Check `<meta property="og:image">` exists

### 4.3 Schema Markup
- [ ] View page source
- [ ] Search for `"@type": "Organization"`
- [ ] Search for `"@type": "BreadcrumbList"`
- [ ] Verify structured data present

### 4.4 Sitemap
- [ ] Open `https://vcelyy.github.io/ai-website-builders/sitemap-index.xml`
- [ ] Verify XML loads without errors
- [ ] Check sitemap contains URLs

### 4.5 Robots.txt
- [ ] Open `https://vcelyy.github.io/ai-website-builders/robots.txt`
- [ ] Verify `Sitemap:` line exists
- [ ] Verify `User-agent: *` allows crawlers

---

## Section 5: Internal Linking

### 5.1 Navigation Links
- [ ] Homepage → Reviews index
- [ ] Homepage → Comparisons index
- [ ] Homepage → Guides index
- [ ] Homepage → About page

### 5.2 Cross-Page Links
- [ ] Review pages link to comparisons
- [ ] Review pages link to guides
- [ ] Comparison pages link to reviews
- [ ] Guide pages link to reviews

### 5.3 Footer Links
- [ ] Footer appears on all pages
- [ ] "About" link works
- [ ] "Methodology" link works
- [ ] Social links (if present) work

---

## Section 6: Mobile Responsiveness

### 6.1 Viewport Test
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test at 375px width (mobile)
- [ ] Test at 768px width (tablet)
- [ ] Test at 1024px width (desktop)

### 6.2 Mobile Checks
- [ ] No horizontal scroll on mobile
- [ ] Text is readable without zooming
- [ ] Buttons are tap-friendly (min 44x44px)
- [ ] Navigation menu works on mobile

---

## Section 7: Performance

### 7.1 Page Speed (Rough Check)
- [ ] Homepage loads in < 3 seconds
- [ ] Review pages load in < 3 seconds
- [ ] No console errors (check DevTools Console)

### 7.2 Images
- [ ] Images load without broken links
- [ ] Images have alt text (spot check)
- [ ] Image sizes are reasonable (< 200KB each)

---

## Section 8: Content Quality

### 8.1 Authenticity Check
- [ ] Reviews have specific testing dates
- [ ] Reviews mention actual hours spent testing
- [ ] Comparisons have personal experiences
- [ ] Guides have "Unexpected Findings" sections

### 8.2 Accuracy Check
- [ ] Scores match review summaries
- [ ] Pricing information is current
- [ ] Affiliate disclosures appear where needed
- [ ] No "TOP PICK" badges without context

---

## Section 9: Deployment Verification (GitHub Pages)

### 9.1 Pre-Deploy
- [ ] All changes committed: `git status` clean
- [ ] Build succeeds: `npm run build`
- [ ] Affiliate codes updated (if applicable)

### 9.2 Deploy
- [ ] Push to GitHub: `git push`
- [ ] Wait 2-5 minutes for GitHub Actions
- [ ] Check GitHub Actions tab (green checkmark)

### 9.3 Post-Deploy
- [ ] Open https://vcelyy.github.io/ai-website-builders/
- [ ] Verify homepage loads
- [ ] Test 2-3 internal pages
- [ ] Test 1 affiliate link
- [ ] Check sitemap: `/sitemap-index.xml`

---

## Section 10: Post-Launch Monitoring

### 10.1 Analytics Setup (If Configured)
- [ ] Google Analytics installed (if applicable)
- [ ] Plausible Analytics installed (if applicable)
- [ ] Real-time visitors tracked

### 10.2 Search Console
- [ ] Site submitted to Google Search Console
- [ ] Sitemap submitted
- [ ] No critical errors in Coverage report

### 10.3 Affiliate Tracking
- [ ] Log in to affiliate dashboards
- [ ] Verify clicks are being tracked
- [ ] Check for first referrals

---

## Quick Pass Test (5 Minutes)

If you're short on time, do this quick test:

1. **Build:** `npm run build` → 0 errors ✅
2. **Local:** Open `dist/index.html` → page loads ✅
3. **Affiliates:** `grep -c "YOUR_CODE" src/config/affiliate-links.ts` → returns 0 ✅
4. **Deploy:** `git push` → succeeds ✅
5. **Verify:** Open https://vcelyy.github.io/ai-website-builders/ → loads ✅

---

## Common Issues & Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| Affiliate not working | Click shows `YOUR_CODE` | Update `src/config/affiliate-links.ts` |
| Build fails | Error in console | Check file mentioned in error |
| Site not updating | Old content on GitHub Pages | Wait 5 min for GitHub Actions |
| Broken links | 404 errors | Check URL in link href |
| Images not loading | Broken image icons | Verify image path is correct |

---

## Testing Tools

- **Browser DevTools:** F12 (inspect elements, console, network)
- **Mobile Test:** Ctrl+Shift+M (responsive design mode)
- **Link Checker:** Use online tool or manual spot-check
- **SEO Checker:** Use browser extension or online validator

---

## Notes

- Perform full checklist before first launch
- Use quick pass for subsequent updates
- Retest after major changes
- Keep this checklist updated with new tests

---

**Last Updated:** 2026-02-01
**Maintained By:** Autonomous AI System
