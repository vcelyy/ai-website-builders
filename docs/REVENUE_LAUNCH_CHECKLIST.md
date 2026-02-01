# Revenue Launch Checklist

**Goal:** Generate first dollar of affiliate revenue

**Current State:** Site built (468 pages), but NOT deployed, NO active affiliate links, $0 revenue

**Target:** First affiliate signup → First commission

---

## Phase 1: Affiliate Programs (Day 1-3)

### Priority 1: 10Web Affiliate Program (70% Commission)

- [ ] Visit https://10web.io/affiliate-program/
- [ ] Read affiliate program terms
- [ ] Complete application form:
  - [ ] Website URL: https://aiwebsitebuilders.com
  - [ ] Traffic description: "Content site reviewing AI website builders"
  - [ ] Promotion methods: "SEO content, detailed comparisons"
- [ ] Submit application
- [ ] Wait for approval email (1-3 business days)
- [ ] Once approved: Log in to affiliate dashboard
- [ ] Copy your affiliate referral link/ID
- [ ] Edit `src/config/affiliate-links.ts` line 28
- [ ] Replace `YOUR_CODE` with your actual affiliate ID
- [ ] Save file
- [ ] Run `npm run build` to verify

**Time:** 15 minutes application + 1-3 days approval
**Revenue Potential:** $14-70/month per referral (recurring)

---

### Priority 2: Webflow Affiliate (50% Commission - Year 1)

- [ ] Visit https://university.webflow.com/affiliate-program
- [ ] Review program details
- [ ] Complete application:
  - [ ] Website: https://aiwebsitebuilders.com
  - [ ] Audience: "Entrepreneurs, designers, small businesses"
  - [ ] Content strategy: "Detailed AI builder reviews"
- [ ] Submit application
- [ ] Wait for approval (1-3 business days)
- [ ] Get affiliate link from dashboard
- [ ] Update `src/config/affiliate-links.ts` line 96
- [ ] Replace `YOUR_CODE` with actual ID
- [ ] Save and rebuild: `npm run build`

**Time:** 15 minutes application + 1-3 days approval
**Revenue Potential:** $12-48/month per referral (months 1-12)

---

### Priority 3: Framer Affiliate (30% Commission)

- [ ] Check https://framer.com/ for "Affiliates" or "Partners"
- [ ] Apply to affiliate program
- [ ] Get affiliate code
- [ ] Update `src/config/affiliate-links.ts` line 45
- [ ] Rebuild site

**Time:** 15 minutes + approval time
**Revenue Potential:** $5-15/month per referral (recurring)

---

## Phase 2: Deployment (Day 4)

### Deploy to Netlify

- [ ] Install Netlify CLI (if needed): `npm install -g netlify-cli`
- [ ] Authenticate: `netlify login`
- [ ] Navigate to project: `cd /root/business-projects/ai-website-builders`
- [ ] Initialize: `netlify init`
- [ ] Deploy: `netlify deploy --prod`
- [ ] Note the deployment URL
- [ ] Verify site loads in browser
- [ ] Test 5-10 random pages
- [ ] Check sitemap: `https://your-url.netlify.app/sitemap-index.xml`
- [ ] Check robots.txt: `https://your-url.netlify.app/robots.txt`

**Time:** 30 minutes
**Blocker Removal:** Site is now live on the internet

---

### Custom Domain Setup (Day 4-5)

- [ ] Go to https://app.netlify.com
- [ ] Select your deployed site
- [ ] Go to "Domain settings"
- [ ] Click "Add custom domain"
- [ ] Enter: `aiwebsitebuilders.com`
- [ ] Follow DNS instructions
- [ ] Update DNS at registrar:
  - [ ] Add CNAME: `www` → `[your-site].netlify.app`
  - [ ] Add A record: `@` → `75.2.70.75`
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Verify domain works in browser
- [ ] Enable HTTPS (automatic on Netlify)

**Time:** 30 minutes setup + 24-48 hours propagation
**Blocker Removal:** Branded domain established

---

## Phase 3: Search Engine Indexing (Day 5-7)

### Google Search Console Setup

- [ ] Go to https://search.google.com/search-console
- [ ] Add property: https://aiwebsitebuilders.com
- [ ] Verify ownership (HTML file or DNS record)
- [ ] Submit sitemap:
  - [ ] Go to "Sitemaps" section
  - [ ] Enter: `sitemap-index.xml`
  - [ ] Click "Submit"
- [ ] Request indexing for homepage:
  - [ ] Use "URL Inspection" tool
  - [ ] Enter: https://aiwebsitebuilders.com
  - [ ] Click "Request indexing"
- [ ] Monitor "Coverage" report for issues

**Time:** 30 minutes
**Impact:** Google will discover all 468 pages via sitemap

---

### Additional Search Engines

- [ ] Submit to Bing Webmaster Tools: https://www.bing.com/webmasters
- [ ] Submit sitemap to Bing
- [ ] Submit to DuckDuckGo: https://duckduckgo.com/feedback (for community consideration)

**Time:** 15 minutes
**Impact:** Broader search engine coverage

---

## Phase 4: Analytics Setup (Day 7)

### Install Analytics

Choose ONE:

**Option A: Netlify Analytics (Easiest)**
- [ ] Go to Netlify dashboard
- [ ] Site settings → Analytics
- [ ] Enable Netlify Analytics
- [ ] Add to Layout.astro `<head>` section

**Option B: Google Analytics (Free, More Detailed)**
- [ ] Create Google Analytics 4 property
- [ ] Get Measurement ID (G-XXXXXXXXXX)
- [ ] Add to `src/layouts/Layout.astro`:
```astro
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script define:vars={{ GA_ID: 'G-XXXXXXXXXX' }}>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', GA_ID);
</script>
```
- [ ] Rebuild and deploy

**Time:** 20 minutes
**Impact:** Visibility into traffic and user behavior

---

## Phase 5: Initial Traffic Generation (Week 2-4)

### Content Updates (If Needed)

- [ ] Review top 20 pages for quality
- [ ] Check for broken links
- [ ] Add internal links between related pages
- [ ] Update any placeholder content
- [ ] Add affiliate CTAs to high-traffic pages

**Time:** 2-4 hours
**Impact:** Better user experience, more conversions

---

### Social Proof

- [ ] Add "Last updated" dates to pages
- [ ] Add "468 tools reviewed" badge to homepage
- [ ] Create "Methodology" page (already exists: /methodology)
- [ ] Add author bio to establish credibility

**Time:** 1 hour
**Impact:** Trust = higher conversion rate

---

### Initial Promotion

- [ ] Share homepage on personal social media
- [ ] Add link to personal website/profile
- [ ] Submit to relevant directories:
  - [ ] https://www.producthunt.com (if relevant)
  - [ ] https://directory.launches.io
  - [ ] AI/tech tool directories
- [ ] Comment on relevant blog posts with link

**Time:** 1-2 hours
**Impact:** Initial traffic spike, backlinks for SEO

---

## Phase 6: Monitor & Optimize (Month 1-3)

### Week 1-2: Monitoring

- [ ] Check Google Search Console daily for:
  - [ ] Indexed pages count
  - [ ] Click-through rate
  - [ ] Top queries
- [ ] Check analytics for:
  - [ ] Daily visitors
  - [ ] Top pages
  - [ ] Referral sources
- [ ] Check affiliate dashboards for clicks

**Time:** 10 minutes/day
**Goal:** Understand baseline performance

---

### Week 3-4: Optimization

- [ ] Identify top 10 performing pages
- [ ] Optimize these pages for conversions:
  - [ ] Add clearer CTAs
  - [ ] Improve affiliate link placement
  - [ ] Add comparison tables
- [ ] Update pages with low engagement
- [ ] Fix any crawl errors in Search Console

**Time:** 2-3 hours
**Goal:** Increase conversion rate from traffic to clicks

---

### Month 2-3: Scaling

- [ ] Double down on high-traffic niches
- [ ] Create more content for best-performing categories
- [ ] Build backlinks from relevant sites
- [ ] Consider paid ads for testing (small budget)
- [ ] Join more affiliate programs for additional tools

**Time:** 5 hours/week
**Goal:** First affiliate signup

---

## First Dollar Path

### Most Likely Scenario:

**Month 1:** Deploy + indexing → 100-500 visitors
**Month 2:** SEO starts working → 500-2,000 visitors
**Month 3:** First affiliate signup → **$0 revenue yet** (signup may not pay)
**Month 4:** First paid conversion → **$50-200 commission**
**Month 6:** 25 referrals/month → **$2,000/month**

### Acceleration Strategies:

1. **High-Volume Keywords:** Target "best ai website builder" type queries
2. **Niche Keywords:** "ai website builder for restaurants" (less competition)
3. **Comparison Pages:** "framer vs webflow" (high intent)
4. **Review Pages:** "10web review" (trusted content)

---

## Success Metrics

### Month 1 Targets:
- [ ] Site deployed and live
- [ ] Google indexed: 100+ pages
- [ ] Visitors: 100-500
- [ ] Affiliate clicks: 10-50
- [ ] Revenue: $0 (expected)

### Month 3 Targets:
- [ ] Google indexed: 400+ pages
- [ ] Visitors: 1,000-3,000
- [ ] Affiliate clicks: 100-500
- [ ] Signups: 1-5
- [ ] Revenue: $50-500

### Month 6 Targets:
- [ ] Google indexed: 468 pages (all)
- [ ] Visitors: 5,000-10,000/month
- [ ] Affiliate clicks: 1,000-2,500
- [ ] Signups: 20-30/month
- [ ] Revenue: $1,500-2,500/month

---

## Common Pitfalls to Avoid

### ❌ Don't:
- Expect overnight results (SEO takes 3-6 months)
- Spam links everywhere (builds bad reputation)
- Neglect content quality (visitors bounce)
- Forget to update affiliate codes (lose revenue)
- Check analytics 10x/day (wastes time)

### ✅ Do:
- Focus on one task at a time
- Measure weekly, not hourly
- Improve top-performing pages
- Build genuine value for visitors
- Be patient with SEO timeline

---

## Quick Reference: What to Do Right Now

### If You Have 15 Minutes:
→ Apply to 10Web affiliate program (highest commission)

### If You Have 30 Minutes:
→ Apply to 10Web + Webflow affiliate programs

### If You Have 1 Hour:
→ Apply to 10Web + Webflow + deploy site to Netlify

### If You Have 2 Hours:
→ Apply to 3 affiliate programs + deploy site + submit sitemap to Google

---

## Current Blockers

| Blocker | Status | Resolution |
|---------|--------|------------|
| Affiliate codes are placeholders | ❌ Blocked | Join programs, update codes |
| Site not deployed | ❌ Blocked | Deploy to Netlify |
| Domain not configured | ❌ Blocked | Add custom domain |
| No traffic | ❌ Blocked | Submit to search engines |
| No conversions | ⏳ Not yet | Requires traffic first |

---

## Revenue Equation

```
Revenue = Traffic × Click-Through Rate × Conversion Rate × Commission

Current State:
Traffic = 0 (not deployed)
CTR = 0% (no traffic)
Conversion = 0% (no clicks)
Commission = $0 (no active affiliate links)

Total Revenue = $0/month

Target State (Month 6):
Traffic = 7,500 visitors/month
CTR = 15% (1,125 clicks)
Conversion = 3% (34 signups)
Commission = $60 avg/sale

Total Revenue = ~$2,000/month
```

---

## One-Page Summary

**Day 1:** Join 10Web affiliate (15 min)
**Day 2:** Join Webflow affiliate (15 min)
**Day 3:** Update affiliate codes, rebuild (20 min)
**Day 4:** Deploy to Netlify (30 min)
**Day 5:** Set up custom domain (30 min)
**Day 6:** Submit sitemap to Google (30 min)
**Day 7:** Set up analytics (20 min)
**Week 2-4:** Monitor indexing, promote site
**Month 2-3:** Optimize high-traffic pages
**Month 4-6:** Scale what works, target $2,000/month

**Total Time Investment:** ~5 hours (spread over 2 weeks)
**Expected First Dollar:** Month 3-4
**Target Monthly Revenue:** $2,000 (Month 6)

---

**Ready to start? Begin with:**

1. Open https://10web.io/affiliate-program/
2. Apply to the program
3. Once approved, update `src/config/affiliate-links.ts`
4. Then return to this checklist

**Good luck! 🚀**
