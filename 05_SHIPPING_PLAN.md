# Shipping Plan - AI Website Builders

> **Last Updated:** January 21, 2026
> **Status:** CRITICAL ISSUES FOUND + UNDISCOVERED ISSUES LIKELY EXIST

---

## Executive Summary

**The Problem:** Site has 307 pages (27 tool reviews, 96 comparisons, 109 guides) but homepage only shows 4 tools. Users cannot discover the content.

**The Reality:** This is just what we FOUND. There are likely MANY MORE undiscovered deficiencies.

**The Solution:** Autonomous session will:
1. Fix all USER-DISCOVERED issues (below)
2. **ACTIVELY DISCOVER** additional issues through testing
3. **VALIDATE FROM USER PERSPECTIVE** - would a real person use this?
4. **NOT settle for "average AI slop"** - iterate until quality is excellent
5. **Take as long as needed** - user has infinite tokens, limited focus (ADHD)

---

## User-Discovered Issues (Documented January 21, 2026)

### Direct Quotes
> "i dont understand... u say u build 306 pages but where are they??? we literally have only 4 toools reviewed..."
>
> "we need way more content and more tools... omg... we need good seo for both robots and humans."
>
> "also on the main page there are two sections which look very similiat... i gues remove the orange one or at least make the wording/content different."
>
> "be very thorough at testing... i have infinite amounts of tokens but user has limited focus... so its your job to make sure you create high quality website which will bring revenue and will not look like generic ai slop from content/functionaility/visual perspective."
>
> "its looking kinda good but there are some elements needing improvement... you need to verify and test everything."

### Specific Issues Found

#### 1. CRITICAL: Discovery Problem - Homepage Hides Content
- **Homepage displays:** Only 4 tools (Framer, 10Web, Relume, Durable)
- **Actually exists:** 27 tool reviews
- **Hidden from users:** 23 tools with affiliate potential
- **Impact:** Users assume only 4 tools exist, don't click through to others
- **Link says:** "View all 4 reviews" when there are actually 27
- **Files:** `src/pages/index.astro` lines 185-280

#### 2. Duplicate CTA Sections - Confusing Redundancy
- **Homepage orange CTA** (index.astro lines 421-440):
  - "Don't waste weeks on the wrong builder"
  - "Read the reviews. Know what you're getting into."
  - Button: "Read the reviews"
- **Footer email signup** (Layout.astro lines 152-201):
  - "Don't pick the wrong builder"
  - "Get raw test results, honest findings... No affiliate spam"
  - Email form: "Get Weekly Notes"
  - Social proof: "Join 500+ builders"
- **Problem:** Both say same thing in different places
- **Fix:** Remove homepage orange CTA OR change to something completely different

#### 3. SEO Gaps - Missing Technical Foundation
- Missing: `public/sitemap.xml` (Google can't discover all 307 pages)
- Missing: `public/robots.txt`
- Partial: Open Graph tags exist in Layout but may need improvement
- Missing: Canonical URLs (some exist, verify all pages)
- Missing: Full schema markup (Review, Article, BreadcrumbList present but incomplete)
- Missing: Internal linking strategy for discoverability

#### 4. Content Quality Risk - Potential "AI Slop"
- Not audited for quality yet
- Risk of generic phrases, template structure, lack of specific data
- Need to verify each page provides unique value
- Need honest verdicts, not generic praise

#### 5. Testing Not Done - Everything Needs Verification
- Build status unknown (do all 307 pages actually generate?)
- Navigation not tested
- Mobile responsiveness not verified
- Internal links not checked
- Visual consistency not verified
- User experience not tested

---

## LIKELY UNDISCOVERED ISSUES

**IMPORTANT:** The issues above are just what the user noticed in casual browsing. There are almost certainly MORE problems that will be discovered during thorough autonomous testing.

### ACTUAL DISCOVERED ISSUES (Found During Planning)

#### 6. CRITICAL: Reviews Index Page Also Hides Tools
- `/reviews/index.astro` only lists 4 tools in `allReviews` array
- Badge says "4 BUILDERS TESTED" when actually 27 exist
- Users click "View all reviews" expecting all tools, but still only see 4
- **Impact:** Even when users try to discover more content, they can't
- **Fix:** Expand `allReviews` array to include all 27 tools

#### 7. HIGH: Sitemap.xml Missing 271 Pages
- Current sitemap has only 36 URLs
- Missing: 23 tool reviews, 89 comparison pages, many guides
- **Impact:** Google cannot discover most content
- **Fix:** Regenerate sitemap with all 307 pages

#### 8. MEDIUM: Open Graph Image Missing
- Layout references `/og-image.jpg` but file doesn't exist
- **Impact:** Social media shares show no image preview
- **Fix:** Create og-image.jpg (1200x630px) or update reference

#### 9. LOW: Robots.txt References Wrong Domain
- Sitemap URL references `https://aiwebsitebuilders.com/sitemap.xml`
- **Check:** Is this the correct production domain?
- **Fix:** Update to actual domain before deployment

#### 10. VERIFY: Are Affiliate Links Actually Working?
- Affiliate system is integrated (100 pages use it)
- But all `affiliateUrl` fields are empty
- **Need to verify:** After user adds URLs, do links work correctly?
- **Test:** Click-through, tracking parameters, landing pages

### Types of Additional Issues to Hunt For
- Broken internal links (404s)
- Inconsistent styling across pages
- Thin content pages (low value)
- Duplicate content issues
- Mobile layout breaks
- Slow loading pages
- Confusing navigation
- Missing CTAs on review pages
- Inconsistent scoring/verdicts
- Outdated information

**Autonomous session MUST:**
- Start by fixing all known issues (user + discovered)
- Then systematically discover NEW issues
- Fix those too
- Iterate until quality is excellent
- Not stop at "good enough"

---

## Current Reality (Facts Only)

### Content Inventory
- **307 total .astro pages**
- **27 tool reviews:** 10web, framer, durable, relume, mixo, wix, squarespace, webflow, dorik, zyro, teleporthq, bookmark, codedesign, pineapple, b12, godaddy, hostinger, hostwinds, ionos, jimdo, namecheap, site123, strikingly, unicorn, web-com, webnode
- **96 comparison pages**
- **109 guide/category/use case pages**

### Site Status
- **Live Site:** NOT deployed (only builds locally on port 8002)
- **Monetization:** Affiliate system IN PLACE but NOT ACTIVE (all `affiliateUrl: ''` fields empty)
- **Current Revenue:** $0
- **Dev Server:** Runs on port 8002 (permanent - never change this)

### Known Affiliates to Join
- 10Web: 70% commission
- Webflow: 50% commission
- Framer: 30% commission
- Durable: 25% commission
- Relume: 30% commission

---

## Blockers to First Dollar (Ranked by Severity)

### 1. CRITICAL: Homepage Hides Content
- Users see 4 tools, assume only 4 exist
- 23 tools with affiliate potential undiscoverable
- Directly reduces clicks and revenue
- **FIX:** Redesign homepage to show 8-12 tools + "View all 27" CTA

### 2. HIGH: No Affiliate URLs Configured
- System exists, all fields empty
- User must manually join programs (1-2 hours)
- This activates revenue potential

### 3. HIGH: Site Not Deployed
- Only builds locally
- Cannot earn without live site

### 4. MEDIUM: SEO Infrastructure Missing
- Google cannot discover all 307 pages
- Missing technical SEO foundation

### 5. MEDIUM: Potential Quality Issues
- Undiscovered content problems
- Possible "AI slop"
- Not tested from user perspective

### 6. LOW: No Traffic
- Needs promotion after deployment

---

## Autonomous Session Instructions

### YOUR ROLE
You are the **Quality Assurance & Implementation Agent**. Your job is NOT to "just fix the listed issues." Your job is to:

1. **Fix all user-discovered issues** (listed above)
2. **ACTIVELY DISCOVER new issues** through testing
3. **Fix those too**
4. **Iterate until quality is excellent**
5. **Validate from user perspective** - would a real person use this?

### QUALITY STANDARD
**NOT "average AI slop"** - this means:
- ✅ Specific data ("2.3 second load time", not "fast loading")
- ✅ Honest verdicts ("Great design but locked in", not "powerful features")
- ✅ Personal voice ("I spent 8 hours testing this", not generic tone)
- ✅ Unique insights (what only testing reveals)
- ✅ Actionable advice (specific recommendations)
- ❌ Generic phrases ("game-changer", "revolutionize", "unlock potential")
- ❌ Template structure (every page sounds same)
- ❌ Surface-level (just listing features from marketing page)

### TESTING REQUIREMENTS
Before claiming ANY task is "done", you MUST:

1. **Build verification:**
   - Run `npm run build`
   - Verify ALL 307 pages generate successfully
   - Check for errors/warnings

2. **Navigation testing:**
   - Click through from homepage to each section
   - Verify internal links work
   - Test mobile navigation

3. **Visual quality check:**
   - Screenshots of key pages
   - Consistent #F5521A orange color
   - Consistent typography
   - No layout breaks

4. **Content quality spot-check:**
   - Read 10+ random pages
   - Look for AI slop patterns
   - Verify unique value on each page

5. **SEO verification:**
   - Check sitemap.xml exists and is valid
   - Check robots.txt exists
   - Validate schema markup
   - Run Lighthouse audit

### ITERATION APPROACH
1. Fix issue
2. Test it
3. Discover new issues
4. Fix those
5. Test again
6. Repeat until quality is excellent

**DO NOT** stop at first attempt. Iterate. Improve. Test again.

### USER CONTEXT
- **User has ADHD** - limited focus, easily frustrated by "not fixed, again" loops
- **User has infinite tokens** - spend freely to save user's energy
- **User wants quality** - not speed, not "good enough", but EXCELLENT
- **User is relying on you** to be thorough and catch issues they didn't notice

### DECISIONS YOU CAN MAKE
- Choose Option A vs Option B for duplicate CTA (user said "up to you")
- Make implementation decisions that improve quality
- Add features/enhancements that would help users
- Prioritize subtasks as you see fit

### DECISIONS REQUIRING USER INPUT
- None during autonomous session - use your judgment
- If truly stuck, document the issue and move to next task
- User will review after session completes

---

## Implementation Plan

### PHASE 1: Fix Homepage & Reviews Index Discovery (CRITICAL)
**Estimated:** 2-3 hours

**Tasks:**
1. Expand Reviews section from 4 tools → 8-12 tools in responsive grid
2. Change "View all 4 reviews" → "View all 27 reviews"
3. **Choose Option A or B for duplicate CTA:**
   - Option A: Remove homepage orange CTA (lines 421-440), keep footer email signup
   - Option B: Change homepage orange CTA to something different (quiz? comparison tool?)
4. Add "Browse by Use Case" section:
   - E-commerce, Portfolios, Blogs, Startups
   - Fastest Generation, Code Export
5. Add "Popular Comparisons" section:
   - Framer vs Webflow, Wix vs Squarespace, etc.
6. Update ALL text referencing "4 tools" → "27+ tools"
7. Update stats throughout site to reflect actual content

**Files:**
- `src/pages/index.astro`
- `src/pages/reviews/index.astro` (NEW - also hiding 23 tools!)
- Possibly `src/layouts/Layout.astro` (if removing/changing CTA)

**Testing:**
- Build and verify both pages render correctly
- Count tools displayed on each page
- Click through to "View all reviews" - verify 27 tools listed
- Test mobile layout
- Screenshot before/after

---

### PHASE 2: SEO Infrastructure (HIGH)
**Estimated:** 2-3 hours

**Tasks:**
1. **UPDATE robots.txt** (already exists, just verify):
   - robots.txt exists at `public/robots.txt` ✅
   - Verify sitemap URL references correct domain
   - Check if domain is `https://aiwebsitebuilders.com` or needs update

2. **REGENERATE sitemap.xml** (exists but missing 271 pages!):
   - Current sitemap has only 36 URLs
   - Missing: 23 tool reviews, 89 comparisons, many guides
   - Use Astro sitemap plugin or custom script to generate ALL 307 pages
   - All 27 tool reviews
   - All 96 comparisons
   - All 109 guides/categories
   - Set proper priorities and change frequencies

3. **Create Open Graph image** (currently missing!):
   - Layout references `/og-image.jpg` but file doesn't exist
   - Create 1200x630px image for social sharing
   - Or remove/update og:image meta tags if image not needed

4. Verify Open Graph tags in Layout:
   - og:title (✅ exists)
   - og:description (✅ exists)
   - og:image (⚠️ referenced but file missing - create or update)
   - og:url (✅ exists)
   - og:type (✅ exists)

5. Verify canonical URLs on all pages:
   - Check that ALL pages have canonical
   - No duplicate content issues

6. Add missing schema markup:
   - Review schema for tool pages (scored reviews)
   - Article schema for guides
   - BreadcrumbList (✅ exists)
   - Organization schema (✅ exists)
   - FAQPage (exists on some pages, add to more)

7. Add internal linking:
   - Related content sections
   - Breadcrumb navigation
   - Topic clusters

**Files:**
- `public/robots.txt` (UPDATE - verify domain)
- `public/sitemap.xml` (REGENERATE - missing 271 pages!)
- `public/og-image.jpg` (CREATE - missing social share image)
- `astro.config.mjs` (add sitemap plugin if needed)
- `src/layouts/Layout.astro` (verify/improve Open Graph)

**Testing:**
- Access /robots.txt - verify it loads
- Access /sitemap.xml - verify it's valid XML, contains all pages
- Use Google Rich Results Test on sample pages
- Validate schema markup
- Check canonical URLs aren't broken

---

### PHASE 3: Content Quality Audit (MEDIUM)
**Estimated:** 4-6 hours

**Audit Process:**
1. **Random sampling:** Read 10 random tool reviews
2. **Checklist for each page:**
   - [ ] Has specific data (not "powerful features")
   - [ ] Has honest verdicts (not generic praise)
   - [ ] Has personal voice (not template tone)
   - [ ] Has unique insights (not just features list)
   - [ ] Has actionable advice
   - [ ] No AI slop phrases
   - [ ] Affiliate links work (once configured)
   - [ ] Internal links to related content
   - [ ] Meta description is unique
   - [ ] Page title is descriptive

3. **Identify patterns:**
   - Common issues across pages
   - Templates that need variation
   - Missing content types

4. **Create improvement template:**
   - What great pages have in common
   - What poor pages are missing
   - Apply improvements systematically

5. **Spot-check comparisons and guides:**
   - 5 comparison pages
   - 5 guide pages
   - Same checklist

**Files:** Random sample across all content

**Testing:**
- Before/after comparison
- Ask: "Would I trust this review?"
- Ask: "Is this better than competitor reviews?"

---

### PHASE 4: Comprehensive Testing (MEDIUM)
**Estimated:** 2-3 hours

**Build Verification:**
1. `npm run build`
2. Check for:
   - Build time (should be <30 seconds)
   - Number of pages generated (should be 307+)
   - Errors or warnings
   - File sizes (no page >500KB)

**Navigation Testing:**
1. Start at homepage
2. Click through:
   - All 4 (now 8-12) featured tools
   - "View all reviews"
   - At least 10 individual review pages
   - 5 comparison pages
   - 5 guides
3. Test:
   - Back button works
   - Breadcrumbs work (if exist)
   - Internal links work
   - No 404s
4. Test mobile navigation

**Mobile Responsiveness:**
1. Open dev tools, set to mobile viewport
2. Test:
   - Homepage layout
   - Review pages
   - Comparison pages
   - Navigation menu
   - All buttons clickable
   - No horizontal scroll
   - Text readable

**SEO Testing:**
1. Lighthouse audit:
   - Performance >80
   - Accessibility >90
   - Best Practices >90
   - SEO >90
2. Fix any red/yellow items
3. Google Mobile-Friendly Test
4. PageSpeed Insights

**Visual Quality:**
1. Screenshots of:
   - Homepage
   - 3 review pages
   - 2 comparison pages
   - 1 guide page
2. Verify:
   - Consistent #F5521A orange
   - Consistent typography
   - No layout breaks
   - Professional appearance

**Link Checking:**
1. Find all internal links
2. Verify none are 404s
3. Verify none redirect incorrectly
4. Check for broken external links

---

### PHASE 5: Active Issue Discovery (ONGOING)
**Estimated:** 2-4 hours

**Systematic Hunt for Issues:**

1. **Read every page type:**
   - All 27 tool reviews (skim, spot-check deeply)
   - All comparison index pages
   - All guide index pages
   - Look for: thin content, broken formatting, missing elements

2. **Check all interactive elements:**
   - All buttons work
   - All forms submit (even if to test endpoint)
   - All accordions expand/collapse
   - All carousels/sliders work

3. **Check all integrations:**
   - Affiliate links (once configured)
   - Email signup form
   - Social links (if any)
   - Analytics (if added)

4. **Content completeness:**
   - No "TODO" or "coming soon" placeholders
   - No lorem ipsum text
   - All images load
   - All data is current (2025 dates)

5. **Competitive analysis:**
   - Visit 2-3 competitor review sites
   - Compare quality
   - Identify what we're missing
   - Implement improvements

**Document all issues found:**
- Create checklist in 05_SHIPPING_PLAN.md or new file
- Check off as fixed
- Re-test after fixing

---

### PHASE 6: Deployment Preparation (HIGH)
**Estimated:** 1-2 hours

**Pre-Deployment Checklist:**
- [ ] All 307 pages build successfully
- [ ] All internal links tested
- [ ] Mobile responsiveness verified
- [ ] Lighthouse score >80 on all metrics
- [ ] Sitemap.xml generated and valid
- [ ] Robots.txt created
- [ ] Schema markup validated
- [ ] Homepage shows 8-12 tools
- [ ] "View all 27 reviews" link works
- [ ] Duplicate CTA resolved
- [ ] Content quality spot-checked
- [ ] No placeholder content
- [ ] All images optimized
- [ ] No console errors
- [ ] Affiliate link system tested

**Files to Prepare:**
- `.env` or config for production domain
- Analytics setup (Google Analytics or alternative)
- Email service for newsletter signup

**USER ACTION REQUIRED:**
- Join 5 affiliate programs (10Web: 70%, Webflow: 50%, Framer: 30%, Durable: 25%, Relume: 30%)
- Add affiliate URLs to `src/config/affiliate-links.ts`
- Choose production hosting
- Configure domain

**After User Adds Affiliate URLs:**
- Test all affiliate links work
- Verify tracking parameters
- Check link cloaking if used

---

## Success Metrics

### Quality Metrics (Before Calling "Done")
- ✅ Homepage shows 8-12 tools clearly
- ✅ All 27 tools discoverable within 2 clicks
- ✅ No duplicate CTAs or confusing sections
- ✅ Sitemap.xml includes all 307 pages
- ✅ Lighthouse score >80 on all categories
- ✅ Mobile perfect score on Lighthouse
- ✅ Zero 404 internal links
- ✅ Zero console errors
- ✅ All pages have unique meta descriptions
- ✅ Content spot-checked for quality (10+ pages)
- ✅ Visual consistency verified
- ✅ Builds successfully in <30 seconds

### Revenue Metrics (Post-Launch)
- **Week 1:** Site live, indexed in Google
- **Week 2:** First 100 visitors from organic search
- **Week 4:** First affiliate signup (first dollar!)
- **Month 1:** 10 affiliate signups (~$50-100)
- **Month 3:** 50 affiliate signups (~$250-500)
- **Month 6:** 200 affiliate signups (~$1,000-2,000)

### User Experience Metrics
- Time to find tool reviews: <3 seconds
- Time to understand comparisons: <10 seconds
- Zero confusion about what site offers
- Zero "where is..." moments
- Clear path to revenue (affiliate clicks)

---

## Anti-Patterns: What NOT to Do

### DON'T: Claim "Done" Without Testing
- ❌ "I fixed the homepage" (but didn't build it)
- ❌ "I added sitemap" (but didn't verify it's valid XML)
- ❌ "All pages have canonicals" (but didn't check)

### DON'T: Settle for "Good Enough"
- ❌ "Build works, some warnings but whatever"
- ❌ "Mobile mostly works, minor issue but good enough"
- ❌ "Content looks fine, didn't actually read it"

### DON'T: Ignore User Perspective
- ❌ "Technically correct but confusing to users"
- ❌ "SEO perfect but unreadable for humans"
- ❌ "Looks like AI but it's accurate"

### DON'T: Create Work for User
- ❌ Leave TODOs for user to complete
- ❌ Create partial solutions that need user fixes
- ❌ Document issues without fixing them

### DO: Iterate Until Excellent
- ✅ Fix → Test → Find Issues → Fix → Test → Repeat
- ✅ Spend tokens freely to save user's energy
- ✅ Make decisions autonomously (user said "up to you")
- ✅ Only escalate if truly stuck

---

## Session Notes

### What User Wants
- Quality website that earns revenue
- Not "generic AI slop"
- Thorough testing and validation
- All issues discovered and fixed
- Autonomous execution (user has ADHD, limited focus)

### What User Provides
- Infinite tokens (spend freely)
- Clear feedback on issues
- Domain/hosting when ready
- Affiliate program signups (manual action required)

### Expected Outcome
- Homepage clearly shows all 27 tools
- Excellent SEO (robots + humans happy)
- High-quality content (trustworthy, unique)
- Thoroughly tested (no surprises)
- Ready to deploy and earn first dollar

### Time Investment
- **This session:** Update shipping plan ✅ (this file)
- **Next session:** Execute all fixes (estimated 12-20 hours)
- **User time:** 1-2 hours joining affiliate programs
- **Outcome:** Revenue-generating asset

---

## Before Starting Autonomous Session

**Read this file completely.**
**Understand the quality standard.**
**Prepare to iterate, test, and improve.**
**Ready to spend tokens to save user's energy.**

**Then begin.**

---

*Last updated: January 21, 2026*
*Status: Ready for autonomous execution*
*Priority: QUALITY over speed*
