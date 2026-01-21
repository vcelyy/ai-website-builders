# Affiliate Applications Tracker

> **Purpose:** Track affiliate program applications and approvals
> **Goal:** Join all 5 programs to activate revenue tracking
> **Revenue Potential:** $2,000/month at maturity

---

## QUICK STATUS

| Program | Status | Commission | Application Link | Approval Date | Affiliate URL Added |
|---------|--------|------------|------------------|---------------|-------------------|
| 10Web | ⏳ Not Started | 70% recurring | https://10web.io/affiliate-program/ | - | ❌ No |
| Webflow | ⏳ Not Started | 50% recurring (1st yr) | https://university.webflow.com/affiliate-program | - | ❌ No |
| Durable | ⏳ Not Started | 25% recurring | https://durable.co/affiliate | - | ❌ No |
| Framer | ⏳ Not Started | 50% recurring (12 mo) | https://www.framer.com/creators | - | ❌ No |
| Relume | ⏳ Not Started | 30% recurring (est) | Email: affiliates@relume.io | - | ❌ No |

**Progress:** 0/5 programs applied

---

## APPLICATION CHECKLIST

### 1. 10Web (70% recurring - HIGHEST PRIORITY)

**Why First:** 70% commission is exceptional. One referral = $168/year.

**Application Link:** https://10web.io/affiliate-program/

**What You'll Need:**
- [ ] Website URL (your domain)
- [ ] Business email
- [ ] Tax information
- [ ] PayPal for payouts

**Program Details:**
- Commission: 70% recurring
- Cookie: 60 days
- Payout: Monthly via PayPal/Wire
- Minimum: $50

**Status:**
- [ ] Applied (date: ___________)
- [ ] Approved (date: ___________)
- [ ] Received affiliate link: _________________________
- [ ] Added to config file

**Expected Revenue:** 10 referrals × $20/month × 70% = $140/month recurring

---

### 2. Webflow (50% recurring - FIRST YEAR)

**Why Second:** Popular tool with high first-year commission.

**Application Link:** https://university.webflow.com/affiliate-program

**What You'll Need:**
- [ ] Website URL with content
- [ ] Audience description
- [ ] Marketing plan
- [ ] Tax information

**Program Details:**
- Commission: 50% recurring (first year)
- Cookie: 30 days
- Payout: Monthly
- Minimum: $50

**Status:**
- [ ] Applied (date: ___________)
- [ ] Approved (date: ___________)
- [ ] Received affiliate link: _________________________
- [ ] Added to config file

**Expected Revenue:** 5 referrals × $25/month × 50% × 12 months = $750/year each

---

### 3. Durable (25% recurring)

**Application Link:** https://durable.co/affiliate

**What You'll Need:**
- [ ] Website URL
- [ ] Email address
- [ ] Basic traffic info

**Program Details:**
- Commission: 25% recurring
- Cookie: Unknown
- Payout: Unknown

**Status:**
- [ ] Applied (date: ___________)
- [ ] Approved (date: ___________)
- [ ] Received affiliate link: _________________________
- [ ] Added to config file

**Expected Revenue:** 5 referrals × $15/month × 25% = $18.75/month recurring

---

### 4. Framer (50% recurring - FIRST 12 MONTHS!)

**Application Link:** https://www.framer.com/creators

**What You'll Need:**
- [ ] Framer account (free)
- [ ] Website URL
- [ ] Audience info

**Program Details:**
- Commission: 50% recurring (first 12 months per referral!)
- Cookie: Unknown
- Payout: Monthly (minimum $200)
- Also earn by selling templates on Framer Marketplace

**Status:**
- [ ] Applied (date: ___________)
- [ ] Approved (date: ___________)
- [ ] Received affiliate link: _________________________
- [ ] Added to config file

**Expected Revenue:** 10 referrals × $20/month × 50% × 12 months = $1,200/year per referral!

---

### 5. Relume (30% recurring - ESTIMATED)

**Application Link:** Email **affiliates@relume.io** to request setup

**What You'll Need:**
- [ ] Website URL
- [ ] Audience description
- [ ] Marketing channels
- [ ] Email request to affiliates@relume.io

**Program Details:**
- Commission: 30% recurring (estimated - confirm when applying)
- Platform: Rewardful
- Cookie: Unknown (confirm when applying)
- Payout: Unknown (confirm when applying)

**Note:** Relume uses Rewardful platform. Email them to get set up with an affiliate account.

**Status:**
- [ ] Applied (date: ___________)
- [ ] Approved (date: ___________)
- [ ] Received affiliate link: _________________________
- [ ] Added to config file

---

## NEXT STEPS (After Approval)

### Step 1: Add Affiliate URLs to Config

Edit `/root/business-projects/ai-website-builders/src/config/affiliate-links.ts`:

```typescript
'10web': {
  // ...
  affiliateUrl: 'https://10web.io/?YOUR-AFFILIATE-CODE',
  // ...
},
framer: {
  // ...
  affiliateUrl: 'https://framer.com/?via=YOUR-CODE',
  // ...
},
// ... repeat for all tools
```

### Step 2: Rebuild Site

```bash
cd /root/business-projects/ai-website-builders
npm run build
```

### Step 3: Deploy to Production

```bash
# If using Vercel
vercel --prod

# Or your deployment method
```

### Step 4: Verify Links

1. Visit your review pages
2. Click CTAs
3. Confirm affiliate tracking is active

---

## REVENUE PROJECTIONS

### Conservative (Month 1-3)
- 500 visitors/month
- 2% click-through = 10 clicks
- 10% signup = 1 signup
- **Revenue: $50-100/month**

### Moderate (Month 4-6)
- 2,000 visitors/month
- 3% click-through = 60 clicks
- 15% signup = 9 signups
- **Revenue: $450-900/month**

### Target (Month 12)
- 8,000 visitors/month
- 5% click-through = 400 clicks
- 20% signup = 80 signups
- **Revenue: $2,000+/month**

---

## TRACKING SPREADSHEET

Create a simple Google Sheet with columns:

| Date | Program | Clicks | Signups | Revenue | Notes |
|------|---------|--------|---------|---------|-------|
| 2026-01-21 | 10Web | 0 | 0 | $0 | Just applied |
| 2026-01-22 | Webflow | 0 | 0 | $0 | Pending approval |
| ... | ... | ... | ... | ... | ... |

Update weekly to track progress.

---

## TIPS FOR APPROVAL

### Before Applying:
1. ✅ Have your site live (even on a temporary domain)
2. ✅ Have at least 5-10 pages of content
3. ✅ Show real traffic potential (SEO focus)
4. ✅ Be honest about your marketing strategy

### If Rejected:
1. Ask why (feedback helps)
2. Reapply in 30 days with traffic stats
3. Start with direct links, switch later

---

## REMINDERS

**Time to Join All Programs:** ~50 minutes

**Time to First Commission:** 30-60 days (after approval)

**Key to Success:** Focus on SEO traffic first. More visitors = more clicks = more revenue.

---

*Last Updated: 2026-01-21*
