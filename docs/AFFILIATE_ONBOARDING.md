# Affiliate Program Onboarding Guide

**Goal:** Join affiliate programs and update tracking codes to enable revenue generation.

**Current Status:** Site is ready (468 pages, 8.5/10 technical quality) but affiliate links are placeholders.

**Expected Revenue:** $2,000/month at maturity (25 referrals × $80 avg commission)

---

## Priority Order: Join These Programs First

### Step 1: 10Web Affiliate (HIGHEST PRIORITY - 70% Commission)

**Why first:** Highest commission rate (70% recurring), generous cookie duration.

**Action Steps:**
1. Go to: https://10web.io/affiliate-program/
2. Click "Join Affiliate Program" or "Become an Affiliate"
3. Fill out application:
   - Website URL: https://aiwebsitebuilders.com
   - Traffic description: "Content site reviewing AI website builders with 468+ comparison pages"
   - Promotion methods: "SEO content, detailed reviews, tool comparisons"
4. Wait for approval (typically 1-3 business days)
5. Once approved, get your affiliate ID from dashboard
6. Update code: Edit `src/config/affiliate-links.ts`
7. Find line 28: `affiliateUrl: 'https://10web.io/?ref=YOUR_CODE'`
8. Replace `YOUR_CODE` with your actual affiliate ID
9. Save file and rebuild: `npm run build`

**Expected:** 70% commission = $14-70/month per referral (recurring)

---

### Step 2: Webflow Affiliate (50% Commission - First Year)

**Why second:** High commission (50% first year), strong brand recognition.

**Action Steps:**
1. Go to: https://university.webflow.com/affiliate-program
2. Click "Apply to join"
3. Fill out application:
   - Website: https://aiwebsitebuilders.com
   - Audience: "Entrepreneurs, designers, small businesses looking for AI website builders"
   - Content: "Detailed reviews and comparisons of AI website building tools"
4. Wait for approval
5. Get affiliate link from dashboard
6. Update `src/config/affiliate-links.ts` line 96
7. Replace `YOUR_CODE` with actual affiliate ID
8. Rebuild: `npm run build`

**Expected:** 50% first-year commission = $12-48/month per referral (months 1-12)

---

### Step 3: Framer Affiliate (30% Commission - Recurring)

**Action Steps:**
1. Check: https://framer.com/ for "Affiliates" or "Partners" in footer
2. Apply with site details
3. Get affiliate code
4. Update line 45 in `src/config/affiliate-links.ts`
5. Rebuild

**Expected:** 30% recurring = $5-15/month per referral

---

### Step 4: Durable Affiliate (25% Commission - Recurring)

**Action Steps:**
1. Go to: https://durable.co/affiliate
2. Apply with site details
3. Get affiliate code
4. Update line 62 in `src/config/affiliate-links.ts`
5. Rebuild

**Expected:** 25% recurring = $4-10/month per referral

---

### Step 5: Relume Affiliate (30% Commission - Recurring)

**Action Steps:**
1. Check: https://relume.io for affiliate program
2. Apply with site details
3. Get affiliate code
4. Update line 79 in `src/config/affiliate-links.ts`
5. Rebuild

**Expected:** 30% recurring = $6-18/month per referral

---

## How to Update Affiliate Links (Step-by-Step)

### Option A: Edit Manually

1. Open file: `src/config/affiliate-links.ts`
2. Find the tool you want to update (e.g., `'10web':`)
3. Find the `affiliateUrl` line
4. Replace `YOUR_CODE` with your actual affiliate ID
5. Save the file
6. Run: `npm run build`

**Example - Before:**
```typescript
'10web': {
  name: '10Web AI',
  url: 'https://10web.io/ai-website-builder/',
  affiliateUrl: 'https://10web.io/?ref=YOUR_CODE',  // ← CHANGE THIS
  commission: '70%',
  recurring: 'recurring'
}
```

**Example - After:**
```typescript
'10web': {
  name: '10Web AI',
  url: 'https://10web.io/ai-website-builder/',
  affiliateUrl: 'https://10web.io/?ref=12345',  // ← Your actual code
  commission: '70%',
  recurring: 'recurring'
}
```

---

### Option B: Use AI Assistant

Type this command:
```
I've been approved for 10Web affiliate program. My affiliate ID is [YOUR_ID]. Please update src/config/affiliate-links.ts line 28 to replace YOUR_CODE with my actual ID, then rebuild the site.
```

---

## Verification: Did It Work?

### Test 1: Check Affiliate Link is Active

1. Open `src/config/affiliate-links.ts`
2. Search for: `YOUR_CODE`
3. If found → NOT DONE yet
4. If not found → DONE!

### Test 2: Verify Build Works

```bash
npm run build
```

Expected output:
```
✓ Building in 100 seconds
✓ 468 pages generated
```

### Test 3: Check Live Site (After Deployment)

1. Visit any page on your deployed site
2. Click a "Try 10Web Free" button
3. Check URL bar: Should contain `?ref=YOUR_CODE` (with YOUR_CODE replaced)

---

## Revenue Path (Once Deployed)

**Week 1-2:** Deploy site, submit to Google Search Console
**Week 3-4:** Start indexing, minimal traffic
**Month 2:** Early SEO traffic, first clicks
**Month 3:** First affiliate signups possible
**Month 6:** Target 25 referrals/month = $2,000/month

---

## Tools Without Affiliate Programs Yet

These have empty affiliate URLs in the config:
- B12, Mixo, Pineapple, CodeWP, Unicorn, CodeDesign, GoDaddy, IONOS, Jimdo, Pineapple Builder

**Strategy:**
1. Deploy site first with major programs (10Web, Webflow, Framer)
2. After revenue starts, join secondary programs
3. Update config as you get approved

---

## Quick Checklist

- [ ] Join 10Web affiliate program (70% commission)
- [ ] Update 10Web affiliateUrl in src/config/affiliate-links.ts
- [ ] Join Webflow affiliate program (50% commission)
- [ ] Update Webflow affiliateUrl in src/config/affiliate-links.ts
- [ ] Join Framer affiliate program (30% commission)
- [ ] Update Framer affiliateUrl in src/config/affiliate-links.ts
- [ ] Run `npm run build` to verify changes
- [ ] Deploy site
- [ ] Submit sitemap to Google Search Console

---

## Current Affiliate Status

| Tool | Commission | Status | Action Needed |
|------|-----------|--------|---------------|
| 10Web | 70% | Placeholder | Join & update code |
| Webflow | 50% | Placeholder | Join & update code |
| Framer | 30% | Placeholder | Join & update code |
| Durable | 25% | Placeholder | Join & update code |
| Relume | 30% | Placeholder | Join & update code |
| Wix | $50-100 | Placeholder | Join & update code |
| Squarespace | $100-200 | Placeholder | Join & update code |
| Hostinger | 60% | Placeholder | Join & update code |
| Dorik | 30% | Placeholder | Join & update code |
| Bookmark | TBD | Placeholder | Check availability |
| TeleportHQ | TBD | Placeholder | Check availability |
| B12 | TBD | Empty | Research program |
| Mixo | TBD | Empty | Research program |
| Pineapple | TBD | Empty | Research program |
| CodeWP | TBD | Empty | Research program |
| Unicorn | TBD | Empty | Research program |
| CodeDesign | TBD | Empty | Research program |
| GoDaddy | TBD | Empty | Research program |
| IONOS | TBD | Empty | Research program |
| Jimdo | TBD | Empty | Research program |
| Pineapple Builder | TBD | Empty | Research program |

---

**Next Step:** Join 10Web affiliate program at https://10web.io/affiliate-program/

**Time Investment:** 15 minutes to apply, 1-3 days for approval

**Revenue Impact:** Enables 70% recurring commission on all 10Web referrals
