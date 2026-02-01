# Affiliate Signup Guide

**Goal:** Join affiliate programs and update codes to start earning revenue.

---

## Priority Order (By Commission)

| Priority | Program | Commission | Signup Time | Expected Earnings |
|----------|---------|------------|-------------|-------------------|
| 1 | 10Web | 70% recurring | 5 min | $14-35/month per referral |
| 2 | Webflow | 50% (1st year) | 10 min | $8-25/month per referral |
| 3 | Framer | 30% recurring | 10 min | $5-10/month per referral |
| 4 | Relume | 30% recurring | 10 min | $5-10/month per referral |
| 5 | Durable | 25% recurring | 5 min | $3-8/month per referral |

---

## Step 1: Join 10Web (Highest Priority - 70% Commission!)

1. Go to: https://10web.io/affiliate-program/
2. Fill out the application form:
   - Website URL: https://vcelyy.github.io/ai-website-builders/
   - Traffic description: "Content site reviewing AI website builders with 468 comparison pages and guides"
   - Promotion methods: "Content marketing, SEO, reviews"
3. Submit application
4. Check email for approval (usually 24-48 hours)
5. Once approved, log in and get your affiliate ID

---

## Step 2: Update 10Web Affiliate Code

Once you have your 10Web affiliate ID:

1. Edit `src/config/affiliate-links.ts`
2. Find line 28:
   ```typescript
   affiliateUrl: 'https://10web.io/?ref=YOUR_CODE',
   ```
3. Replace `YOUR_CODE` with your actual affiliate ID
4. Save the file

---

## Step 3: Rebuild and Redeploy

```bash
npm run build
```

Then deploy to GitHub Pages:
```bash
git add src/config/affiliate-links.ts
git commit -m "Update 10Web affiliate code"
git push
```

The site will automatically rebuild and deploy.

---

## Step 4: Join Other Programs (Repeat for Each)

### Webflow (50% commission - 2nd Priority)
1. Go to: https://university.webflow.com/affiliate-program
2. Apply as an affiliate
3. Get your affiliate code
4. Update line 96 in `src/config/affiliate-links.ts`

### Framer (30% commission)
1. Go to: https://framer.com/ (look for affiliate link in footer)
2. Apply for program
3. Update line 45 in `src/config/affiliate-links.ts`

### Durable (25% commission)
1. Go to: https://durable.co/affiliate
2. Apply for program
3. Update line 62 in `src/config/affiliate-links.ts`

### Relume (30% commission)
1. Go to: https://relume.io (look for affiliate link)
2. Apply for program
3. Update line 79 in `src/config/affiliate-links.ts`

---

## Step 5: Track Your Links

After updating codes, verify they work:

1. Build the site: `npm run build`
2. Open a built page in browser
3. Click an affiliate link
4. Check that the URL contains your affiliate ID

Example correct format:
```
https://10web.io/?ref=abc123  ✅ (your actual ID)
https://10web.io/?ref=YOUR_CODE  ❌ (placeholder)
```

---

## Revenue Timeline

| Week | Expected Activity |
|------|------------------|
| Week 1 | Join programs, update codes, rebuild site |
| Week 2-3 | Start sharing site (social media, communities) |
| Week 4-6 | First referrals likely (with traffic) |
| Month 2-3 | Consistent referrals if traffic continues |

---

## Notes

- **10Web is highest priority**: 70% commission is exceptional
- **Don't stress about joining all at once**: Start with 10Web, add others over time
- **Content is already excellent**: The site has 468 pages with authentic content - just needs working affiliate links
- **Traffic is the next bottleneck**: After fixing links, focus on generating visitors

---

## Quick Copy-Paste URLs

- 10Web Affiliate Program: https://10web.io/affiliate-program/
- Webflow Affiliate Program: https://university.webflow.com/affiliate-program
- Durable Affiliate Program: https://durable.co/affiliate
- Framer: Check framer.com footer for affiliate link
- Relume: Check relume.io footer for affiliate link
