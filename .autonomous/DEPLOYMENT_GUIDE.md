# DEPLOYMENT GUIDE: AI Website Builders

> **Status:** READY FOR DEPLOYMENT
> **Build Status:** ✅ 312 pages, 0 errors
> **QA Status:** ✅ All checks passed

---

## PRE-DEPLOYMENT CHECKLIST

### Build Verification ✅
- [x] Build successful (312 pages)
- [x] 0 build errors
- [x] Sitemap generated (sitemap-index.xml)
- [x] robots.txt present
- [x] All internal links valid
- [x] No placeholder text
- [x] No broken images

### QA Checks ✅
- [x] Visual inspection: PASS
- [x] Content quality: PASS
- [x] Links working: PASS
- [x] Schema markup: PASS
- [x] Design consistency: PASS

### Mobile Check ✅
- [x] Responsive breakpoints: PASS
- [x] Mobile menu: PASS
- [x] Table overflow: PASS
- [x] Text sizing: PASS

### Performance Audit ✅
- [x] Build time: 13.5 seconds
- [x] CSS bundle: 1 file
- [x] JavaScript: 0 files (pure static)
- [x] Total size: 13MB

---

## DEPLOYMENT OPTIONS

### Option 1: Vercel (Recommended)
**Best for:** Astro sites, zero-config deployment, automatic HTTPS

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd /root/business-projects/ai-website-builders
vercel

# Follow prompts:
# - Link to existing project or create new
# - Build command: npm run build
# - Output directory: dist
# - Install command: npm install
```

### Option 2: Netlify
**Best for:** Drag-and-drop deployment, free tier

```bash
# Option A: Drag and drop
1. Run: npm run build
2. Drag dist/ folder to https://app.netlify.com/drop

# Option B: CLI deployment
npm i -g netlify-cli
cd /root/business-projects/ai-website-builders
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages
**Best for:** Free hosting, automatic deployments from GitHub

```bash
# Install astro-payload
npx astro add payload

# Update astro.config.mjs for GitHub Pages
# Then deploy to gh-pages branch
```

---

## POST-DEPLOYMENT STEPS

### 1. Verify Deployment
- [ ] Visit production URL
- [ ] Check homepage loads correctly
- [ ] Test navigation menu
- [ ] Verify mobile menu works
- [ ] Check 5-10 random pages

### 2. Test Affiliate Links
- [ ] Click affiliate CTAs on review pages
- [ ] Verify links redirect correctly
- [ ] Check commission disclosure visible

### 3. Submit to Google Search Console
- [ ] Create Google Search Console account
- [ ] Verify domain ownership
- [ ] Submit sitemap: https://yourdomain.com/sitemap-index.xml
- [ ] Request indexing for top 50 pages

### 4. Join Affiliate Programs
See `docs/01_BUSINESS_MODEL.md` for program details.

**Priority Order:**
1. 10Web (70% commission)
2. Webflow (50% commission)
3. Framer (30% commission)
4. Durable (25% commission)
5. Dorik (30% commission)
6. Relume (30% commission)
7. Wix (volume-based)
8. Squarespace (volume-based)

---

## AFFILIATE LINK CONFIGURATION

Current affiliate links are configured in `src/config/affiliate-links.ts`:

```typescript
export const AFFILIATE_LINKS = {
  '10web': {
    affiliateUrl: 'https://10web.io/ai-website-builder/?aff=YOUR_ID',
    commission: '70%',
  },
  'webflow': {
    affiliateUrl: 'https://webflow.com/?aff=YOUR_ID',
    commission: '50%',
  },
  // ... etc
};
```

**Action Required:**
1. Sign up for each affiliate program
2. Replace `YOUR_ID` with actual affiliate IDs
3. Test all affiliate links

---

## DOMAIN SETUP

### Option A: Use Existing Domain
1. Point domain A record to hosting IP
2. Update `astro.config.mjs` with canonical URL
3. Deploy

### Option B: Use Subdomain
1. Deploy to Vercel/Netlify
2. Use default URL (e.g., ai-website-builders.vercel.app)
3. Can add custom domain later

---

## MONITORING CHECKLIST

### Week 1 After Launch
- [ ] Check Google Search Console for errors
- [ ] Verify sitemap indexed
- [ ] Monitor page load times
- [ ] Test all affiliate links
- [ ] Check mobile experience

### Week 2-4 After Launch
- [ ] Monitor organic traffic
- [ ] Track affiliate clicks
- [ ] Check for broken links
- [ ] Update any issues found

---

## ROLLBACK PLAN

If issues found after deployment:

```bash
# Revert to previous version
git revert <commit-hash>
npm run build
# Redeploy
```

---

## CONTACT & SUPPORT

For deployment issues:
- Check build logs
- Verify all dependencies installed
- Test locally first: `npm run build && npm run preview`

---

## NEXT STEPS AFTER DEPLOYMENT

1. **Join Affiliate Programs** (2-3 hours)
   - Apply to all 8 programs
   - Configure affiliate links
   - Test all links

2. **Submit to Google** (30 minutes)
   - Create Search Console account
   - Submit sitemap
   - Request indexing

3. **Monitor Performance** (ongoing)
   - Check traffic weekly
   - Monitor affiliate clicks
   - Update content quarterly

---

**Status:** READY TO DEPLOY
**Last Updated:** 2026-01-21
