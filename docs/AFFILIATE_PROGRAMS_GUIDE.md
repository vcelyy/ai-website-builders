# AFFILIATE PROGRAMS GUIDE

> **Purpose:** This guide explains how to join affiliate programs and activate revenue tracking for the AI Website Builders site.
> **Revenue Potential:** $2,000/month at maturity (25 referrals × $80 avg commission)
> **Time to First Dollar:** 30 days after joining programs

---

## QUICK START (Do This First)

### Step 1: Join Affiliate Programs (Priority Order)

| Priority | Program | Commission | Link | Time to Join |
|----------|---------|------------|------|--------------|
| 1 | 10Web | 70% recurring | https://10web.io/affiliate-program/ | 10 min |
| 2 | Webflow | 50% recurring | https://university.webflow.com/affiliate-program | 15 min |
| 3 | Framer | 30% recurring | Check framer.com | 10 min |
| 4 | Durable | 25% recurring | https://durable.co/affiliate | 5 min |
| 5 | Relume | 30% recurring | Check relume.io | 10 min |

**Total Time:** ~50 minutes to join all programs

### Step 2: Add Your Affiliate Links

Once approved, edit `/root/business-projects/ai-website-builders/src/config/affiliate-links.ts`:

```typescript
'10web': {
  // ...
  affiliateUrl: 'https://10web.io/?your-affiliate-code', // ADD YOUR LINK HERE
  // ...
},
framer: {
  // ...
  affiliateUrl: 'https://framer.com/?via=your-code', // ADD YOUR LINK HERE
  // ...
},
// ... repeat for all tools
```

### Step 3: Rebuild and Deploy

```bash
npm run build
# Deploy to production
```

### Step 4: Verify Links Are Working

1. Visit your review pages
2. Click the CTAs
3. Confirm they redirect with your affiliate tracking

---

## DETAILED PROGRAM INFORMATION

### 1. 10Web (70% recurring - HIGHEST!)

**Why Priority #1:** 70% recurring commission is exceptional. A single $20/month referral = $168/year.

**Program Details:**
- Commission: 70% recurring
- Cookie duration: 60 days
- Payout: Monthly via PayPal/Wire
- Minimum payout: $50

**How to Join:**
1. Visit: https://10web.io/affiliate-program/
2. Fill out application form
3. Wait for approval (usually 1-3 days)
4. Get your affiliate link from dashboard
5. Add to `affiliate-links.ts`

**Expected Revenue:**
- 10 referrals @ $20/month = $200/month × 70% = **$140/month recurring**

### 2. Webflow (50% recurring - First Year)

**Why Priority #2:** High commission from popular design tool.

**Program Details:**
- Commission: 50% recurring (first year only)
- Cookie duration: 30 days
- Payout: Monthly
- Minimum payout: $50

**How to Join:**
1. Visit: https://university.webflow.com/affiliate-program
2. Complete application
3. Wait for approval
4. Add link to config

**Expected Revenue:**
- 5 referrals @ $25/month × 50% × 12 months = **$750/year per referral**

### 3. Framer (30% recurring)

**Program Details:**
- Commission: 30% recurring
- Cookie duration: Unknown
- Payout: Monthly

**How to Join:**
1. Check framer.com for affiliate program
2. Apply if available
3. Add link to config

**Expected Revenue:**
- 10 referrals @ $20/month × 30% = **$60/month recurring**

### 4. Durable (25% recurring)

**Program Details:**
- Commission: 25% recurring
- Cookie duration: Unknown
- Payout: Unknown

**How to Join:**
1. Visit: https://durable.co/affiliate
2. Apply for program
3. Add link to config

**Expected Revenue:**
- 5 referrals @ $15/month × 25% = **$18.75/month recurring**

### 5. Relume (30% recurring)

**Program Details:**
- Commission: 30% recurring
- Cookie duration: Unknown
- Payout: Unknown

**How to Join:**
1. Check relume.io for affiliate program
2. Apply if available
3. Add link to config

---

## CURRENT SITE STATUS

### Affiliate-Ready Pages
- ✅ Review pages (4): Framer, 10Web, Durable, Relume
- ✅ Comparison pages (10): All tool vs tool comparisons
- ✅ Deal pages (5): Individual tool deals + index
- ✅ Homepage CTAs: Main conversion points
- ✅ Long-tail pages (3): Small business, blog, free

**Total Pages with Affiliate Links:** 22+ pages

### Current Disclosure Text
When affiliate links are NOT set: "Direct link - no affiliate relationship yet."
When affiliate links ARE set: "Affiliate link used (XX% commission). I'll still tell you if it sucks."

This is honest, transparent, and builds trust.

---

## REVENUE PROJECTIONS

### Conservative (Month 1-3)
- Visitors: 500/month
- Conversion: 2% (10 clicks)
- Signups: 10% (1 signup)
- Revenue: **$50-100/month**

### Moderate (Month 4-6)
- Visitors: 2,000/month
- Conversion: 3% (60 clicks)
- Signups: 15% (9 signups)
- Revenue: **$450-900/month**

### Target (Month 12)
- Visitors: 8,000/month
- Conversion: 5% (400 clicks)
- Signups: 20% (80 signups)
- Revenue: **$2,000+/month**

---

## TRACKING YOUR AFFILIATE PERFORMANCE

### What to Monitor
1. **Clicks:** How many people click your affiliate links
2. **Conversions:** How many sign up for paid plans
3. **Revenue:** Total commissions earned
4. **EPC:** Earnings per click (should be $0.50-2.00)

### Tools to Use
- Google Analytics: UTM parameters on links
- Affiliate dashboards: Native tracking from each program
- Spreadsheet: Manual weekly tracking

### UTM Parameter Template
```
https://10web.io/?your-code&utm_source=aibuilders&utm_medium=review&utm_campaign=framer_comparison
```

---

## LEGAL COMPLIANCE

### FTC Disclosure Requirements
- ✅ Clearly disclose affiliate relationships
- ✅ Disclosure near the affiliate link
- ✅ Honest, unbiased reviews
- ✅ "I'll still tell you if it sucks" maintains credibility

### Current Disclosure Implementation
All review pages include:
```html
<div class="affiliate-disclosure">
  Affiliate link used (XX% commission). I'll still tell you if it sucks.
</div>
```

This meets FTC guidelines for affiliate marketing.

---

## NEXT ACTIONS (This Week)

1. [ ] Join 10Web affiliate program (70% commission!)
2. [ ] Join Webflow affiliate program (50% commission)
3. [ ] Join Durable affiliate program (25% commission)
4. [ ] Check for Framer affiliate program
5. [ ] Check for Relume affiliate program
6. [ ] Add affiliate links to `affiliate-links.ts` config
7. [ ] Rebuild site with new links
8. [ ] Deploy to production
9. [ ] Test links by clicking them
10. [ ] Set up tracking spreadsheet

---

## QUESTIONS?

**Q: What if I'm not approved for a program?**
A: The site will continue to work with direct links. Reapply in 30 days with more traffic stats.

**Q: Can I change affiliate links later?**
A: Yes, just edit `affiliate-links.ts` and rebuild. All pages update automatically.

**Q: Do affiliate links hurt SEO?**
A: No, as long as you add `rel="nofollow sponsored"` (already implemented).

**Q: What if a program changes commission rates?**
A: Update the commission percentage in `affiliate-links.ts` to keep disclosures accurate.

---

## SUCCESS METRICS

**Month 1 Goal:** Join all 5 programs
**Month 2 Goal:** First affiliate signup
**Month 3 Goal:** $50/month in commissions
**Month 6 Goal:** $500/month in commissions
**Month 12 Goal:** $2,000/month in commissions

**Key to Success:** Focus on SEO traffic first. More visitors = more clicks = more revenue.
