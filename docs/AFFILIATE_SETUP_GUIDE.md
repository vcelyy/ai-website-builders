# Affiliate Setup Guide - Path to First Dollar

> **Goal:** Configure affiliate tracking links so your site can generate revenue
>
> **Time Investment:** 30 minutes (quick start) or 4-8 hours (full setup)
>
> **Result:** Site earns 25-70% commission on every referral

---

## THE PROBLEM: Why Your Site Makes $0 Right Now

**Current State:**
```typescript
// src/config/affiliate-links.ts
affiliateUrl: '', // EMPTY - No tracking = No commission
```

**What Happens:**
1. Visitor clicks "Try Framer Free" button
2. Goes to `https://framer.com/website-builder` (direct URL)
3. Visitor signs up for Framer
4. **You earn $0** - No tracking code = No commission

**The Fix:**
Replace empty affiliate URLs with your tracking links:
```typescript
affiliateUrl: 'https://framer.com/?ref=YOUR_CODE', // Earns 30% commission!
```

---

## QUICK START: First Affiliate Link in 30 Minutes

**Goal:** Get ONE tool working fast. Start with highest commission (10Web at 70%).

### Step 1: Join 10Web Affiliate Program (10 minutes)

1. Go to: https://10web.io/affiliate-program/
2. Click "Join Affiliate Program"
3. Fill out application:
   - Website URL: Your domain (or "coming soon" if not live)
   - Traffic description: "Content site reviewing AI website builders"
   - Promotion methods: "Blog reviews, comparison articles"
4. Submit and wait for approval (usually 1-24 hours)

### Step 2: Get Your Tracking Link (5 minutes)

Once approved:
1. Log into 10Web affiliate dashboard
2. Find "Referral Link" or "Affiliate Link" generator
3. Enter destination: `https://10web.io/ai-website-builder/`
4. Copy your tracking link (looks like: `https://10web.io/?ref=abc123`)

### Step 3: Update Config File (5 minutes)

1. Open: `src/config/affiliate-links.ts`
2. Find the 10Web section (around line 18)
3. Replace the empty affiliateUrl:

```typescript
// BEFORE:
'10web': {
  // ... other fields ...
  affiliateUrl: '', // EMPTY
}

// AFTER:
'10web': {
  // ... other fields ...
  affiliateUrl: 'https://10web.io/?ref=YOUR_ACTUAL_CODE', // PASTE HERE
}
```

4. Save the file

### Step 4: Test and Rebuild (10 minutes)

1. Rebuild the site:
```bash
npm run build
```

2. Check that CTAs now use your link:
```bash
grep -o 'href="https://10web.io[^"]*"' dist/index.html
```

3. Verify output shows your tracking code (not just `10web.io`)

**Result:** All 10Web CTAs now earn you 70% recurring commission!

---

## FULL SETUP: All Top Programs (4-8 Hours)

**Priority Order by Commission + Ease:**

### Priority 1: 10Web (70% recurring) - DO FIRST
- **Time:** 20 minutes
- **Program:** https://10web.io/affiliate-program/
- **Why:** Highest commission, recurring revenue
- **Approval:** Usually 1-24 hours

### Priority 2: Webflow (50% first year) - DO SECOND
- **Time:** 30 minutes
- **Program:** https://university.webflow.com/affiliate-program
- **Why:** High commission, popular tool
- **Approval:** 1-3 days (may require review)

### Priority 3: Hostinger (60% recurring) - DO THIRD
- **Time:** 15 minutes
- **Program:** https://www.hostinger.com/affiliate-program
- **Why:** High commission, budget seekers
- **Approval:** Instant (automated)

### Priority 4: Framer (30% recurring) - DO FOURTH
- **Time:** 20 minutes
- **Program:** Check framer.com for affiliate program link
- **Why:** Design-focused audience, good volume
- **Approval:** Varies (check site)

### Priority 5: Durable (25% recurring) - DO FIFTH
- **Time:** 15 minutes
- **Program:** https://durable.co/affiliate
- **Why:** Service business audience
- **Approval:** Usually fast

### Priority 6: Wix ($50-100 one-time) - VOLUME PLAY
- **Time:** 25 minutes
- **Program:** https://www.wix.com/affiliate-program
- **Why:** Brand recognition, high volume
- **Approval:** 1-3 days

### Priority 7: Squarespace ($100-200 one-time) - VOLUME PLAY
- **Time:** 30 minutes
- **Program:** https://www.squarespace.com/affiliate-program
- **Why:** Premium brand, high payouts
- **Approval:** 1-7 days (selective)

**Total Time:** ~3 hours for top 7 programs (plus approval wait times)

---

## HOW TO UPDATE THE CONFIG FILE

**File Location:** `src/config/affiliate-links.ts`

**Format:**
```typescript
'tool-name': {
  name: 'Tool Name',
  url: 'https://tool.com',           // Direct URL (fallback)
  affiliateUrl: '',                  // ← PUT YOUR LINK HERE
  commission: 'XX%',
  recurring: 'recurring/one-time',
  freeTrial: true/false,
  ctaText: 'Button Text',
  programUrl: 'https://tool.com/affiliate'
}
```

**Example for 10Web:**
```typescript
'10web': {
  name: '10Web AI',
  url: 'https://10web.io/ai-website-builder/',
  affiliateUrl: 'https://10web.io/?ref=abc123', // YOUR TRACKING LINK
  commission: '70%',
  recurring: 'recurring',
  freeTrial: true,
  ctaText: 'Try 10Web Free',
  programUrl: 'https://10web.io/affiliate-program/'
}
```

**Key Points:**
- Keep the `url` field (direct link as fallback)
- Paste your tracking link in `affiliateUrl`
- Keep all other fields unchanged
- Save the file after each update

---

## VALIDATION: How to Test If It Works

### Test 1: Build Verification
```bash
npm run build
```
**Expected:** "468 page(s) built in ~95s" - No errors

### Test 2: Link Extraction
```bash
grep -o 'href="https://10web.io[^"]*"' dist/index.html | head -5
```
**Expected:** Should show your tracking code, not just `10web.io`

### Test 3: Check Multiple Tools
```bash
for tool in 10web framer durable webflow; do
  echo "Checking $tool:"
  grep -o "href=\"https://$tool[^\"]*\"" dist/index.html | head -1
done
```
**Expected:** Each shows tracking code (if configured)

### Test 4: Visual Check
1. Open `dist/index.html` in browser
2. Find CTA buttons
3. Right-click → Copy Link Address
4. Verify it shows your tracking code

---

## TROUBLESHOOTING

### Issue: "Build fails after updating config"
**Solution:** Check for syntax errors
- Make sure commas are in right places
- Quotes are matching
- No trailing commas in last object

### Issue: "Affiliate link doesn't appear in built files"
**Solution:** Rebuild the site
```bash
npm run build
```
Changes to config require rebuild

### Issue: "Tracking link format looks wrong"
**Solution:** Verify format with affiliate program
- Some use `?ref=CODE`
- Some use `?aff=CODE`
- Some use dedicated subdomain: `https://you.partner10web.io/`

Copy EXACTLY what the affiliate program provides.

### Issue: "Not approved for program yet"
**Solution:** Start with automated approval programs first
- Hostinger: Instant approval
- Others may take 1-7 days

Deploy site with direct URLs, update to affiliate URLs once approved.

---

## REVENUE PROJECTIONS

**Conservative (10 signups/month):**
- 10Web: 10 × $15 × 70% = $105/month
- Webflow: 5 × $20 × 50% = $50/month
- Framer: 5 × $15 × 30% = $22.50/month
- **Total:** ~$180/month

**Moderate (25 signups/month):**
- 10Web: 15 × $15 × 70% = $157.50/month
- Webflow: 10 × $20 × 50% = $100/month
- Framer: 8 × $15 × 30% = $36/month
- **Total:** ~$293/month

**Aggressive (50 signups/month):**
- Multiple programs
- **Potential:** $500-1,000/month

**Key Driver:** Traffic volume × Conversion rate × Commission %

---

## NEXT STEPS

### Immediate (Today):
1. ✅ Join 10Web affiliate program (10 min)
2. ✅ Update config file with tracking link (5 min)
3. ✅ Rebuild and test (5 min)

### This Week:
1. Join Webflow affiliate program
2. Join Hostinger affiliate program
3. Update config for both

### This Month:
1. Join all top 7 programs
2. Deploy site
3. Start driving traffic

---

## CHECKLIST: Ready to Make Money?

- [ ] Joined at least 1 affiliate program
- [ ] Received tracking link(s)
- [ ] Updated `src/config/affiliate-links.ts`
- [ ] Rebuilt site with `npm run build`
- [ ] Verified tracking links in built files
- [ ] Tested CTAs in browser
- [ ] Deployed site to hosting

**When all checked:** Your site can generate revenue!

---

## QUESTIONS?

**Q:** Can I deploy before getting affiliate links?
**A:** Yes. Deploy with direct URLs, update to affiliate links later. No redeployment needed - just rebuild and upload.

**Q:** How long until I see revenue?
**A:** After approval + deployment + first referral signup. Usually 2-4 weeks from starting.

**Q:** What if I get rejected from a program?
**A:** Focus on programs that accept you. Many are beginner-friendly. Rejection is rare for content sites.

**Q:** Do I need to join ALL programs?
**A:** No. Start with 1-3. Add more as you grow. One working link is better than zero perfect links.

---

## REMEMBER

**Your First Dollar Goal:** 2026-02-28
**Today:** 2026-02-01
**Days Remaining:** ~27

**Start today.** Join 10Web program (10 minutes). Get approved. Update config. Rebuild.

One working affiliate link = path to first dollar.

Everything else can come later.

**Let's get to first dollar.** 🚀
