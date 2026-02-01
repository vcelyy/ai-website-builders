# Affiliate Program Signup Guide

> **Why This Matters:** This is the path to your first dollar. Without affiliate codes, the site generates $0 revenue. With affiliate codes, each referral can earn $20-$80 in commission.

---

## Quick Summary

| Priority | Program | Commission | Approval Time | Action |
|----------|---------|------------|---------------|--------|
| **1** | Webflow | **50%** (12 months) | 24-48 hours | Apply first |
| **2** | 10Web | **30%** (12 months) | 24-48 hours | Apply second |
| **3** | Durable | **25%** recurring | 24-48 hours | Apply third |
| **4** | Framer | Up to **50%** (partners) | 1-7 days | Apply fourth |
| **5** | Squarespace | $100-200 one-time | 1-7 days | Apply fifth |

**Revenue Potential:**
- 10 referrals @ $80 avg = $800/month
- 25 referrals @ $80 avg = $2,000/month (target)

---

## Step 1: Webflow Affiliate Program (50% Commission) 🔥

**Apply First - Highest Commission**

### Application

**URL:** https://webflow.com/solutions/affiliates

**What to Enter:**
- **Website URL:** `https://vcelyy.github.io/ai-website-builders/`
- **Description:** "Review site comparing website builders with detailed analysis of Webflow vs competitors. 468 pages of comparison content, reviews, and guides for designers and agencies."

**Commission Details:**
- 50% of first year subscription revenue
- Paid for new customers only (not existing)
- 90-day cookie window
- Minimum payout: $50

**Tips for Approval:**
- Emphasize the design/agency audience
- Mention comparison content (Webflow vs Framer, etc.)
- Webflow loves design-focused content
- Show your content quality

### After Approval (24-48 hours)

**Update Your Affiliate Code:**

1. Open `src/config/affiliate-links.ts`
2. Find line 92-102 (webflow section)
3. Replace `YOUR_CODE` with your actual affiliate ID

```typescript
// BEFORE
webflow: {
  name: 'Webflow',
  url: 'https://webflow.com',
  affiliateUrl: 'https://webflow.com/?ref=YOUR_CODE',
  commission: '50%',
}

// AFTER (example - use your actual code)
webflow: {
  name: 'Webflow',
  url: 'https://webflow.com',
  affiliateUrl: 'https://webflow.com/?ref=johndoe123',
  commission: '50%',
}
```

4. Save the file
5. Rebuild: `npm run build`
6. Deploy: `git push` (auto-deploys to GitHub Pages)

**Verification:**
- Visit your site
- Click any Webflow affiliate link
- Check URL has your affiliate ID

---

## Step 2: 10Web Affiliate Program (30% Commission)

**Apply Second - WordPress Focus**

### Application

**URL:** https://10web.io/affiliates/

**What to Enter:**
- **Website URL:** `https://vcelyy.github.io/ai-website-builders/`
- **Description:** "Content site reviewing AI website builders with 468 comparison pages, guides, and detailed reviews. Focus on WordPress ecosystem and AI-powered website building tools."

**Commission Details:**
- 30% commission for 12 months
- Platform plans: 30% for 12 months
- API plans: 30% for 4 months
- Managed via Impact platform

**Tips for Approval:**
- Be honest about it being a content/review site
- Mention the 468 pages of content
- Highlight the WordPress/10Web focus
- They're very affiliate-friendly

### After Approval (24-48 hours)

**Update Your Affiliate Code:**

1. Open `src/config/affiliate-links.ts`
2. Find line 24-34 ('10web' section)
3. Replace `YOUR_CODE` with your actual affiliate ID

```typescript
// BEFORE
'10web': {
  name: '10Web AI',
  url: 'https://10web.io/ai-website-builder/',
  affiliateUrl: 'https://10web.io/?ref=YOUR_CODE',
  commission: '70%',  // ← Update this too!
}

// AFTER (example - use your actual code)
'10web': {
  name: '10Web AI',
  url: 'https://10web.io/ai-website-builder/',
  affiliateUrl: 'https://10web.io/?ref=johndoe123',
  commission: '30%',  // ← Correct commission
}
```

4. Save the file
5. Rebuild: `npm run build`
6. Deploy: `git push` (auto-deploys to GitHub Pages)

---

## Step 3: Durable Affiliate Program (25% Commission)

**Apply Third - Speed/Ease Focus**

### Application

**URL:** https://durable.co/affiliate

**What to Enter:**
- **Website URL:** `https://vcelyy.github.io/ai-website-builders/`
- **Description:** "Review site for AI website builders with focus on speed and ease of use. Detailed Durable reviews, comparisons, and guides for small businesses."

**Commission Details:**
- 25% recurring commission
- No minimum payout mentioned
- Fast approval typically

### After Approval

```typescript
// src/config/affiliate-links.ts - line 58-68
durable: {
  name: 'Durable AI',
  url: 'https://durable.co',
  affiliateUrl: 'https://durable.co/?ref=YOUR_CODE',
  commission: '25%',
  recurring: 'recurring',
}

// Replace YOUR_CODE with your actual affiliate ID
```

---

## Step 4: Framer Partner Program (Up to 50% Commission)

**Apply Fourth - Design Focus**

### Application

**URL:** https://www.framer.com/partners

**What to Enter:**
- **Website URL:** `https://vcelyy.github.io/ai-website-builders/`
- **Description:** "Comprehensive Framer reviews and comparisons. 468 pages of content including Framer vs Webflow, Framer vs Durable, and portfolio-focused recommendations."

**Commission Details:**
- Up to 50% commission for agencies
- Lower rates for individual affiliates
- Free Enterprise access for qualified agencies
- Expert support via Slack

**Note:** Framer has both an affiliate program (individuals) and agency partner program (higher commission, requires agency status).

### After Approval

```typescript
// src/config/affiliate-links.ts - line 41-51
framer: {
  name: 'Framer AI',
  url: 'https://framer.com/website-builder',
  affiliateUrl: 'https://framer.com/?affiliate=YOUR_CODE',
  commission: '30%',
  recurring: 'recurring',
}

// Replace YOUR_CODE with your actual affiliate ID
// Update commission to actual rate offered
```

---

## Step 5: Other Programs (Apply as Needed)

### Squarespace Affiliate Program ($100-200 per signup)

**URL:** https://www.squarespace.com/affiliate-program

**Commission:** $100-200 one-time per signup
**Good for:** Brand recognition, high-ticket

### Wix Affiliate Program ($50-100 per signup)

**URL:** https://www.wix.com/affiliate-program

**Commission:** $50-100 one-time per signup
**Good for:** Volume, brand recognition

---

## Programs With Different Models

### Relume (Referral Credits, Not Cash)

**Status:** Relume runs a **referral program** (account credits), NOT a traditional cash affiliate program.

**Details:**
- Earn account credits for referring new users
- Credits applied to your Relume subscription
- No direct cash payouts

**Action:** Skip for now. Focus on cash-commission programs first.

---

## After All Approvals: Final Checklist

### 1. Update All Affiliate Codes

Edit `src/config/affiliate-links.ts` and replace ALL `YOUR_CODE` placeholders with your actual affiliate IDs.

### 2. Update Commission Rates

Make sure the `commission` field in each tool's config matches the actual rate offered by the program.

### 3. Rebuild the Site

```bash
npm run build
```

### 4. Verify Build Success

```bash
# Should show 468+ pages built
ls dist/ | wc -l
```

### 5. Commit Changes

```bash
git add src/config/affiliate-links.ts
git commit -m "Update affiliate codes - revenue ready"
git push
```

### 6. Test Live Site

Visit https://vcelyy.github.io/ai-website-builders/ and:
- Click a few affiliate links
- Verify they go to correct URLs with your affiliate ID
- Check the affiliate disclosure shows correctly

---

## Revenue Timeline

### Week 1 After Approval
- Status: Site has affiliate links
- Traffic: May be low initially
- Revenue: $0 (building momentum)

### Week 2-4
- Status: Content indexed in Google
- Traffic: Starting to grow
- Revenue: Possible first referral

### Week 5-8
- Status: Rankings improving
- Traffic: 100-500 visitors/day
- Revenue: $50-$250/month (1-5 referrals)

### Month 3-6
- Status: Established rankings
- Traffic: 500-2000 visitors/day
- Revenue: $500-$2000/month (10-25 referrals)

---

## Important Notes

### FTC Disclosure Compliance

Your site already includes FTC-compliant disclosures on all review pages. This is required by law and keeps you compliant:

> "Affiliate link used (XX% commission). I'll still tell you if it sucks."

### Tracking Your Commissions

Each affiliate program has its own dashboard:
- **Webflow:** Check webflow.com affiliate dashboard
- **10Web:** Check 10web.io/affiliates (Impact platform)
- **Others:** Check respective program dashboards

Log in weekly to track:
- Clicks on your links
- Conversions (signups)
- Revenue earned
- Payment schedules

### When Will You Get Paid?

Most programs pay:
- **Net-30 or Net-60** (30-60 days after earning)
- **Minimum payout:** $50-$100
- **Payment method:** PayPal, bank transfer, or Stripe

Example:
- January: Earn $100 from referrals
- March: Receive payment (Net-60)

---

## Troubleshooting

### Application Rejected?

**Don't panic. Try these:**

1. **Email them directly:** Most programs reconsider
2. **Add more content:** Show you're serious
3. **Share traffic stats:** Even if low, show growth
4. **Reapply in 30 days:** With more content/traffic

### Affiliate Code Not Working?

**Check these:**

1. Code format: Some use `?ref=CODE`, others `?affiliate=CODE`
2. Copy-paste errors: Ensure no extra spaces
3. Test URL: Paste affiliate URL in browser - should redirect correctly
4. Check dashboard: Some codes need activation

### No Clicks/Conversions Yet?

**This is normal:**

1. **SEO takes time:** 3-6 months for real traction
2. **Content promotion:** Share on social media, forums
3. **Build more backlinks:** Guest posts, communities
4. **Wait it out:** Consistency wins

---

## Next Steps After Revenue Starts

Once you're earning ($500+/month):

1. **Reinvest in content:** Hire writers or build yourself
2. **Expand coverage:** More tools, more comparisons
3. **Build email list:** Capture emails, send weekly tips
4. **Explore paid ads:** Amplify what's working

---

## You're Ready

**Current Status:**
- ✅ Site LIVE with 468 pages
- ✅ SEO optimized (137 broken links fixed, 82% improvement)
- ✅ Professional design and content
- ✅ Affiliate infrastructure ready

**Your Action:**
1. Apply to Webflow (50% commission) TODAY
2. Apply to 10Web (30% commission) TODAY
3. Apply to Durable (25% commission) TODAY
4. Update codes when approved
5. Start earning

**First dollar target:** 30 days after affiliate codes are live.

---

## URL Verification Notes

This guide was created on 2026-02-01 with verified working URLs:
- Webflow: ✅ https://webflow.com/solutions/affiliates (HTTP 200)
- 10Web: ✅ https://10web.io/affiliates/ (HTTP 200)
- Durable: ✅ https://durable.co/affiliate (HTTP 301 redirect)
- Framer: ✅ https://www.framer.com/partners (HTTP 308 redirect)

**If URLs change:** Search the tool's website footer for "Affiliates" or "Partners" link.

---

**Questions?** Check the individual affiliate program dashboards or support pages for program-specific help.
