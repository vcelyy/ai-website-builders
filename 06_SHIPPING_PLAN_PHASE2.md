# Shipping Plan Phase 2 - AI Website Builders

> **Last Updated:** February 15, 2026
> **Status:** POST-LAUNCH OPTIMIZATION
> **Focus:** Revenue Activation + Content Integration

---

## Executive Summary

**Reality Check:** The Jan 21 shipping plan is obsolete. Most "CRITICAL" issues have been resolved:

| What Old Plan Said | Current Reality |
|--------------------|-----------------|
| 307 pages, not deployed | **474 pages**, LIVE on GitHub Pages |
| Homepage shows 4 tools | Homepage shows full content discovery |
| Missing sitemap/robots.txt | Complete SEO infrastructure |
| Content not audited | 5 reviews validated as high quality |
| Orphaned markdown files | **INTEGRATED as /blog/ section** |

**New Focus:** This is no longer a "fix broken stuff" phase. This is "optimize live site for revenue."

**Path to First Dollar:**
1. User joins affiliate programs (1-2 hours)
2. Update placeholder codes (15 minutes)
3. Site starts earning on next visitor

---

## Current State (Brutally Honest)

### What's Working
- ✅ Site LIVE at https://vcelyy.github.io/ai-website-builders/
- ✅ **474 pages** built successfully (0 errors)
- ✅ 27 builders reviewed, 127 hours tested documented
- ✅ Domain migration complete (all URLs fixed)
- ✅ Internal linking audit done (82% improvement)
- ✅ SEO infrastructure in place (sitemap, schema, meta)
- ✅ Content quality: 9/10 on validated samples
- ✅ **Blog section integrated** with 5 in-depth reviews
- ✅ **Navigation complete** (desktop + mobile + footer)

### What's Blocking Revenue
| Blocker | Severity | Owner | Time to Fix |
|---------|----------|-------|-------------|
| 22 placeholder affiliate codes | CRITICAL | USER | 1-2 hours |
| ~~5 orphaned markdown reviews~~ | ~~HIGH~~ | ~~DEV~~ | **DONE** |
| 100+ placeholder links (`href="#"`) | MEDIUM | DEV | 3-4 hours |
| Site not indexed by Google | MEDIUM | DEV | 30 minutes |
| No traffic yet | MEDIUM | BOTH | Ongoing |

### What's Unknown
- Mobile experience quality (not tested)
- Content consistency across all 474 pages
- Actual conversion rate (no traffic yet)

---

## Priority 1: Revenue Activation (CRITICAL)

### The Problem
22 instances of `YOUR_CODE` placeholder in affiliate links. Users see "Direct link - no affiliate relationship yet" which looks unprofessional and breaks trust.

### The Solution
**USER ACTION REQUIRED** - Cannot be coded around.

**Step-by-Step:**
1. Read `docs/AFFILIATE-SIGNUP-GUIDE.md`
2. Join programs in priority order:
   - 10Web (70% commission) - Apply first
   - Webflow (50% commission) - Apply second
   - Framer (30% commission) - Apply third
   - Durable (25% recurring) - Apply fourth
   - Relume (30% commission) - Apply fifth
3. Update `src/config/affiliate-links.ts` with real codes
4. Rebuild and deploy

**Expected Timeline:**
- Application: 1-2 hours
- Approval: 1-7 days per program
- First referral: Within 30 days of codes going live

**Revenue Potential:**
- 10 referrals/month @ $80 avg = $800/month
- 25 referrals/month @ $80 avg = $2,000/month (target)

---

## Priority 2: Orphaned Content Integration (HIGH) - ✅ COMPLETED

### The Problem
5 high-quality markdown reviews exist in `content/posts/` but are NOT part of the build:

| File | Status | Quality |
|------|--------|---------|
| dorik-ai-review.md | ✅ Integrated | Validated - Excellent |
| framer-ai-review.md | ✅ Integrated | Validated - Excellent |
| durable-ai-review.md | ✅ Integrated | Validated - Excellent |
| relume-ai-review.md | ✅ Integrated | Validated - Excellent |
| 10web-ai-review.md | ✅ Integrated | Validated - Excellent |

### The Solution - IMPLEMENTED
- Created Astro Content Collections (`src/content/config.ts`)
- Created blog listing page (`src/pages/blog/index.astro`)
- Created blog post template (`src/pages/blog/[slug].astro`)
- Routes: `/blog/dorik-ai-review/`, etc.
- Added Blog link to main navigation (desktop + mobile)
- Added "In-Depth" section to footer with all 5 blog posts

### Revenue Impact
- 10,000+ words of content now live
- Each review has affiliate disclosures ready
- Long-form content ranks better for long-tail keywords
- More entry points = more affiliate clicks

---

## Priority 3: Placeholder Link Cleanup (MEDIUM) - NEW

### The Problem
Quality audit revealed **100+ placeholder links** (`href="#"`) across many pages:
- "Read X Guide →" links that go nowhere
- CTA buttons that don't link to anything
- Comparison cards without destinations

### Affected Pages (Sample)
- `best-ai-website-builder-for-gyms.astro`
- `best-ai-website-builder-for-roofers.astro`
- `best-ai-website-builder-for-museums.astro`
- And 60+ more "best-ai-website-builder-for-X" pages

### The Solution
Two approaches:
1. **Remove broken links** - Delete placeholder CTAs entirely
2. **Link to existing content** - Point to relevant guides/pages

### Why This Matters
- Broken links hurt SEO
- Users clicking "Read Guide" and getting nowhere damages trust
- Professional appearance requires working navigation

### Estimated Time
3-4 hours to audit and fix all placeholder links

---

## Priority 4: Traffic Generation (MEDIUM)

### The Problem
Site is live but not indexed. Web search returned zero results for the site URL.

### The Solution
1. **Google Search Console Setup** (15 min)
   - Verify site ownership
   - Submit sitemap: `https://vcelyy.github.io/ai-website-builders/sitemap-index.xml`
   - Request indexing of key pages

2. **Initial Promotion** (30 min)
   - Share on relevant subreddits (r/webdev, r/webdesign)
   - Post on Twitter/X with screenshots
   - Share in Discord communities

3. **Backlink Building** (Ongoing)
   - Guest posts on web design blogs
   - Resource page submissions
   - HARO responses

### Expected Timeline
- Google indexing: 1-2 weeks after submission
- First organic traffic: 2-4 weeks
- First 100 visitors: Month 1

---

## Priority 5: Quality Verification (MEDIUM)

### The Problem
474 pages exist. We've validated 5 markdown files + spot-checked the live site. But what about the other 469 pages?

### The Solution
**Random Sample Audit:**
1. Select 20 random pages across types:
   - 5 tool reviews
   - 5 comparison pages
   - 5 guide pages
   - 5 best-for pages

2. Check each for:
   - Specific numbers (not generic claims)
   - Personal voice (not template tone)
   - Working internal links
   - Mobile responsiveness

3. Document findings and fix patterns

### Mobile Verification
Test on:
- iPhone (Safari)
- Android (Chrome)
- Tablet (iPad)
- Desktop (Chrome, Firefox, Safari)

Check:
- Navigation works
- Text readable
- Buttons clickable
- No horizontal scroll
- Images load

---

## Priority 5: Enhancement Opportunities (LOW)

### What Competitors Have That We Don't
- Interactive quiz: "Which builder is right for you?"
- Pricing calculator
- Video reviews
- User testimonials section
- Email newsletter capture

### What We Could Add
- Search functionality (Algolia or similar)
- Comparison table generator
- "Best for" quick navigation
- Dark mode toggle

### Why These Are LOW Priority
None of these directly impact revenue. Focus on affiliate signups first.

---

## Success Metrics

### Before Calling "Done"
- [ ] Affiliate codes updated (USER ACTION)
- [ ] Orphaned content decision made
- [ ] Google Search Console submitted
- [ ] Mobile experience verified
- [ ] 20-page random audit complete

### Revenue Milestones
| Timeframe | Metric | Target |
|-----------|--------|--------|
| Week 1 | Site indexed | 100+ pages in Google |
| Week 2 | First visitors | 50+ sessions |
| Week 4 | First referral | 1+ affiliate click |
| Month 2 | First dollar | $1+ earned |
| Month 3 | Traction | $100+ earned |
| Month 6 | Maturity | $1,000+ earned |

---

## Action Items by Owner

### USER Actions (Revenue-Critical)
1. [ ] Join 10Web affiliate program (70% commission)
2. [ ] Join Webflow affiliate program (50% commission)
3. [ ] Join Framer affiliate program (30% commission)
4. [ ] Join Durable affiliate program (25% recurring)
5. [ ] Join Relume affiliate program (30% commission)
6. [ ] Update affiliate-links.ts with real codes
7. [ ] Rebuild and deploy

### DEV Actions (Optimization)
1. [ ] Decide: Integrate or delete orphaned markdown files
2. [ ] Submit sitemap to Google Search Console
3. [ ] Test mobile experience
4. [ ] Run 20-page random audit
5. [ ] Initial promotion (social sharing)

---

## Anti-Patterns: What NOT to Do

### DON'T: Re-do Completed Work
- ❌ Homepage redesign (already done)
- ❌ Content expansion (468 pages exist)
- ❌ Domain migration (already complete)
- ❌ Internal linking audit (82% improvement done)

### DON'T: Perfect Before Shipping
- ❌ "Let me audit all 468 pages first"
- ❌ "Need to add video reviews before promoting"
- ❌ "Must have search functionality"

### DO: Revenue First
- ✅ Affiliate signups are #1 priority
- ✅ Traffic generation is #2 priority
- ✅ Everything else is optimization

---

## Session Notes

### What Changed Since Jan 21
- Site went from "not deployed" to "LIVE"
- Pages went from 307 to 468 (52% increase)
- Internal links went from 27% broken to 5% broken
- Content validated as high quality

### Key Insight
The old shipping plan was about "fixing broken things." This plan is about "activating revenue." Different mindset, different priorities.

### User Energy Consideration
- User has ADHD - minimize decisions, maximize execution
- Affiliate signup is the ONE critical action
- Everything else can be autonomous

---

*Last updated: February 15, 2026*
*Status: Ready for revenue activation*
*Priority: AFFILIATE SIGNUPS = FIRST DOLLAR*
