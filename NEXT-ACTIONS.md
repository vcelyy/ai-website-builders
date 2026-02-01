# NEXT ACTIONS - Path to First Dollar

**Status:** ✅ LIVE | **Site:** https://vcelyy.github.io/ai-website-builders/ | **Revenue:** $0 | **Blocker:** Affiliate codes + Traffic

---

## Your Fastest Path to First Dollar

### STEP 1: Deploy Site (2 minutes)

**✅ NEW: GitHub → Netlify (FASTEST - Auto-Deploys)**

Your code is already on GitHub: https://github.com/vcelyy/ai-website-builders

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Select GitHub, choose `ai-website-builders` repo
4. Deploy settings auto-fill from `netlify.toml`
5. Click "Deploy site"

**Bonus:** Every `git push` will auto-deploy updates!

**Option B: Netlify CLI**

```bash
netlify login
netlify deploy --prod --dir=dist
```

**Option C: Drag & Drop (Manual)**

1. Open https://app.netlify.com/drop
2. Drag the entire `dist/` folder onto the page
3. Get your live URL instantly

### STEP 2: Join Affiliate Programs (30 minutes)

**Priority Order by Commission:**

| Priority | Program | Commission | Signup Link |
|----------|---------|------------|-------------|
| 1 | 10Web | 70% recurring | https://10web.io/affiliate-program/ |
| 2 | Webflow | 50% (1st year) | https://university.webflow.com/affiliate-program |
| 3 | Framer | 30% recurring | Check framer.com |
| 4 | Relume | 30% recurring | Check relume.io |
| 5 | Durable | 25% recurring | https://durable.co/affiliate |

**Start with 10Web** - highest commission (70%) = $14-35/month per referral

### STEP 3: Update Affiliate Codes (5 minutes)

Once you get your affiliate tracking codes, edit `src/config/affiliate-links.ts`:

**Before:**
```typescript
affiliateUrl: 'https://10web.io/?ref=YOUR_CODE'
```

**After (example):**
```typescript
affiliateUrl: 'https://10web.io/?ref=abc123'
```

Then rebuild:
```bash
npm run build
```

And redeploy (drag `dist/` folder to Netlify again).

### STEP 4: Generate Traffic

Quick wins:
- Share on Twitter/X
- Post in relevant Facebook groups
- Add to your email signature
- Comment on relevant blogs with your URL

---

## Current Status Summary

| Metric | Status |
|--------|--------|
| Technical Quality | 9/10 ✅ |
| Build | 468 pages ✅ |
| SEO | Sitemap + robots.txt ✅ |
| Deployment | ✅ LIVE at https://vcelyy.github.io/ai-website-builders/ |
| Affiliate Links | Placeholder codes ❌ |
| Revenue | $0 ❌ |

---

## File Locations

- **Affiliate config:** `src/config/affiliate-links.ts`
- **Build output:** `dist/` folder (468 pages)
- **Deployment config:** `netlify.toml`

---

## Expected Timeline

| Day | Action |
|-----|--------|
| Today | Deploy site + join 10Web |
| Tomorrow | Update codes + rebuild |
| Week 1 | Share on social media |
| Week 2-4 | First referral likely |

---

## Revenue Math

- 10Web commission: 70% of ~$20/month = **$14/month per referral**
- Goal: 25 referrals/month = **$350/month recurring**
- Site traffic: If you get 1,000 visitors/month and 2.5% convert = 25 referrals

**First dollar possible: Week 2-4**
