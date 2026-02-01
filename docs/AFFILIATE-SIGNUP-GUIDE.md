# Affiliate Program Signup Guide

> **Why This Matters:** This is the path to your first dollar. Without affiliate codes, the site generates $0 revenue. With affiliate codes, each referral can earn $20-$80 in commission.

---

## Quick Summary

| Priority | Program | Commission | Approval Time | Action |
|----------|---------|------------|---------------|--------|
| **1** | 10Web | **70%** recurring | 24-48 hours | Apply first |
| **2** | Webflow | **50%** recurring | 24-48 hours | Apply second |
| **3** | Framer | **30%** recurring | 1-7 days | Apply third |
| **4** | Relume | **30%** recurring | 1-7 days | Apply fourth |
| **5** | Durable | **25%** recurring | 24-48 hours | Apply fifth |

**Revenue Potential:**
- 10 referrals @ $80 avg = $800/month
- 25 referrals @ $80 avg = $2,000/month (target)

---

## Step 1: 10Web Affiliate Program (70% Commission) 🔥

**Apply First - Highest Commission**

### Application

**URL:** https://10web.io/affiliate-program/

**What to Enter:**
- **Website URL:** `https://vcelyy.github.io/ai-website-builders/`
- **Description:** "Content site reviewing AI website builders with 468 comparison pages, guides, and detailed reviews. Focus on WordPress ecosystem and AI-powered website building tools."

**Tips for Approval:**
- Be honest about it being a content/review site
- Mention the 468 pages of content
- Highlight the WordPress/10Web focus
- They're very affiliate-friendly

### After Approval (24-48 hours)

**Update Your Affiliate Code:**

1. Open `src/config/affiliate-links.ts`
2. Find line 28 (10Web section)
3. Replace `YOUR_CODE` with your actual affiliate ID

```typescript
// BEFORE
tenweb: {
  name: "10Web AI",
  affiliateUrl: "https://10web.io/?ref=YOUR_CODE",
  commissionRate: 70,
}

// AFTER (example - use your actual code)
tenweb: {
  name: "10Web AI",
  affiliateUrl: "https://10web.io/?ref=johndoe123",
  commissionRate: 70,
}
```

4. Save the file
5. Rebuild: `npm run build`
6. Deploy: `git push` (auto-deploys to GitHub Pages)

**Verification:**
- Visit your site
- Click any 10Web affiliate link
- Check URL has your affiliate ID

---

## Step 2: Webflow Affiliate Program (50% Commission)

**Apply Second - Second Highest Commission**

### Application

**URL:** https://university.webflow.com/affiliate-program

**What to Enter:**
- **Website URL:** `https://vcelyy.github.io/ai-website-builders/`
- **Description:** "Review site comparing website builders with detailed analysis of Webflow vs competitors. 468 pages of comparison content, reviews, and guides for designers and agencies."

**Tips for Approval:**
- Emphasize the design/agency audience
- Mention comparison content (Webflow vs Framer, etc.)
- Webflow loves design-focused content

### After Approval

**Update Your Affiliate Code:**

```typescript
// src/config/affiliate-links.ts - line 92
webflow: {
  name: "Webflow AI",
  affiliateUrl: "https://webflow.com/?affiliate=YOUR_CODE",
  commissionRate: 50,
}

// Replace YOUR_CODE with your actual affiliate ID
```

---

## Step 3: Framer Affiliate Program (30% Commission)

### Application

**URL:** Check footer at framer.com for "Affiliates" link

**What to Enter:**
- **Website URL:** `https://vcelyy.github.io/ai-website-builders/`
- **Description:** "Comprehensive Framer reviews and comparisons. 468 pages of content including Framer vs Webflow, Framer vs Durable, and portfolio-focused recommendations."

### After Approval

```typescript
// src/config/affiliate-links.ts - line 48
framer: {
  name: "Framer AI",
  affiliateUrl: "https://framer.com/?affiliate=YOUR_CODE",
  commissionRate: 30,
}
```

---

## Step 4: Relume Affiliate Program (30% Commission)

### Application

**URL:** Check footer at relume.io for "Affiliates" link

**What to Enter:**
- **Website URL:** `https://vcelyy.github.io/ai-website-builders/`
- **Description:** "Review site covering Relume AI and Webflow ecosystem. Detailed guides on AI website builders, wireframing tools, and design systems."

### After Approval

```typescript
// src/config/affiliate-links.ts - line 103
relume: {
  name: "Relume AI",
  affiliateUrl: "https://relume.io/?affiliate=YOUR_CODE",
  commissionRate: 30,
}
```

---

## Step 5: Durable Affiliate Program (25% Commission)

### Application

**URL:** https://durable.co/affiliate

**What to Enter:**
- **Website URL:** `https://vcelyy.github.io/ai-website-builders/`
- **Description:** "Review site for AI website builders with focus on speed and ease of use. Detailed Durable reviews, comparisons, and guides for small businesses."

### After Approval

```typescript
// src/config/affiliate-links.ts - line 33
durable: {
  name: "Durable AI",
  affiliateUrl: "https://durable.co/?ref=YOUR_CODE",
  commissionRate: 25,
}
```

---

## After All Approvals: Final Checklist

### 1. Update All Affiliate Codes

Edit `src/config/affiliate-links.ts` and replace ALL `YOUR_CODE` placeholders with your actual affiliate IDs.

### 2. Rebuild the Site

```bash
npm run build
```

### 3. Verify Build Success

```bash
# Should show 468+ pages built
ls dist/ | wc -l
```

### 4. Commit Changes

```bash
git add src/config/affiliate-links.ts
git commit -m "Update affiliate codes - revenue ready"
git push
```

### 5. Test Live Site

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
- **10Web:** Check 10Web.io affiliate dashboard
- **Webflow:** Check university.webflow.com dashboard
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
- ✅ SEO optimized (broken links fixed)
- ✅ Professional design and content
- ✅ Affiliate infrastructure ready

**Your Action:**
1. Apply to 10Web (70% commission) TODAY
2. Apply to Webflow (50% commission) TODAY
3. Update codes when approved
4. Start earning

**First dollar target:** 30 days after affiliate codes are live.

---

**Questions?** Check the individual affiliate program dashboards or support pages for program-specific help.
