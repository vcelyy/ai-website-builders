# AFFILIATE PROGRAMS QUICK START

**Purpose:** Fix the monetization blocker so your traffic converts to revenue
**Time Required:** 2-3 hours (spread over 1 week)
**Impact:** Unblock revenue from Day 1 traffic

---

## 🚨 THE PROBLEM

**Your Current Situation:**
- ✅ Site built: 468 pages live
- ✅ Traffic strategy: 6,355 lines of content ready
- ✅ Ready to execute: 450-1,150 visitors possible TODAY
- ❌ **BLOCKER:** 22 placeholder affiliate codes = $0 revenue

**What This Means:**
- You could get 1,000 visitors tomorrow
- You would make **$0** because affiliate links don't work
- Traffic is ready, monetization is broken

**The Fix:**
Join affiliate programs → Get affiliate IDs → Update code → Deploy → Revenue unblocked

---

## 💰 THE MATH

**What You're Leaving On The Table:**

**Scenario A: With placeholder codes (current)**
- 1,000 visitors/month
- 2% click-through rate (20 clicks)
- 0% working affiliate links
- **Revenue: $0/month**

**Scenario B: With working affiliate codes (after fix)**
- 1,000 visitors/month
- 2% click-through rate (20 clicks)
- 25% conversion rate (5 signups)
- $40 average commission/signup
- **Revenue: $200/month**

**Scenario C: With good traffic (Month 3-6)**
- 10,000 visitors/month
- 2% click-through rate (200 clicks)
- 20% conversion rate (40 signups)
- $50 average commission/signup
- **Revenue: $2,000/month** ✅

**The difference between $0 and $2,000/month:**
- Working affiliate codes
- That's it

---

## 🎯 PRIORITY ORDER (Join These First)

**Strategy:** 80/20 rule - Top 5 programs = 80% of revenue potential

| Priority | Program | Commission | Why First? | Time to Join |
|----------|---------|------------|------------|--------------|
| **#1** | **10Web** | **70% recurring** | Highest commission, WordPress market | 30 min |
| **#2** | **Webflow** | **50% recurring** | Popular with developers | 30 min |
| **#3** | **Hostinger** | **60% recurring** | Budget seekers, high volume | 20 min |
| **#4** | **Framer** | **30% recurring** | Design-focused, growing fast | 20 min |
| **#5** | **Relume** | **30% recurring** | Wireframing tool, niche audience | 20 min |

**Total Time for Top 5:** ~2 hours

**After Top 5:** Join remaining programs at your pace (lower priority)

---

## 📋 EXACT STEPS FOR EACH PROGRAM

### Program #1: 10Web (70% recurring - HIGHEST PRIORITY)

**Step 1: Sign up**
- Go to: https://10web.io/affiliate-program/
- Click "Become an Affiliate"
- Fill out the form:
  - Name: [Your name]
  - Email: [Your email]
  - Website: `https://vcelyy.github.io/ai-website-builders/`
  - PayPal email: [Your PayPal for payments]
  - Description: "I run a comprehensive AI website builder review site with 468 pages of content comparing 23+ tools. I have authentic testing data (127 hours, 342 screenshots) and will drive targeted traffic."

**Step 2: Wait for approval**
- Usually 1-3 business days
- They'll email you with your affiliate ID
- Format looks like: `?ref=12345` or `?partner_id=abc123`

**Step 3: Get your affiliate link**
- Login to 10Web affiliate dashboard
- Find your affiliate URL
- Copy the ID part (after `?ref=` or `?partner_id=`)

**What you'll get:**
```
Your affiliate link: https://10web.io/?ref=YOUR_ACTUAL_ID
Your ID to copy: YOUR_ACTUAL_ID
```

---

### Program #2: Webflow (50% recurring)

**Step 1: Sign up**
- Go to: https://university.webflow.com/affiliate-program
- Click "Apply to Affiliate Program"
- Create an account or login
- Fill out the form:
  - Website: `https://vcelyy.github.io/ai-website-builders/`
  - Monthly traffic: [Estimate: 1,000-10,000]
  - Description: "Comprehensive AI website builder reviews with authentic testing data"

**Step 2: Wait for approval**
- Usually 2-5 business days
- Webflow manually reviews each application

**Step 3: Get your affiliate link**
- Login to Webflow affiliate dashboard
- Find your referral URL
- Copy the ID part

**What you'll get:**
```
Your affiliate link: https://webflow.com/?ref=YOUR_ACTUAL_ID
Your ID to copy: YOUR_ACTUAL_ID
```

---

### Program #3: Hostinger (60% recurring)

**Step 1: Sign up**
- Go to: https://www.hostinger.com/affiliate-program
- Click "Join Now"
- Sign up for their affiliate platform (usually Impact or Partnerize)
- Fill out the form:
  - Website URL: `https://vcelyy.github.io/ai-website-builders/`
  - Promotion method: "Content marketing, reviews, comparisons"

**Step 2: Wait for approval**
- Usually 1-3 business days

**Step 3: Get your affiliate link**
- Login to affiliate platform
- Generate tracking link for: https://hostinger.com/ai-website-builder
- Copy the full URL or just the ID

**What you'll get:**
```
Your affiliate link: https://hostinger.com/?ref=YOUR_ACTUAL_ID
Your ID to copy: YOUR_ACTUAL_ID
```

---

### Program #4: Framer (30% recurring)

**Step 1: Find the program**
- Go to: https://framer.com
- Scroll to footer, look for "Affiliates" or "Partners"
- Or search Google: "framer affiliate program"

**Step 2: Sign up**
- Fill out the application
- Website: `https://vcelyy.github.io/ai-website-builders/`
- Description: "AI website builder reviews with authentic testing"

**Step 3: Wait for approval**
- Varies (may take 1-2 weeks)

**What you'll get:**
```
Your affiliate link: https://framer.com/?affiliate=YOUR_ACTUAL_ID
Your ID to copy: YOUR_ACTUAL_ID
```

---

### Program #5: Relume (30% recurring)

**Step 1: Find the program**
- Go to: https://relume.io
- Look for "Affiliates" in footer or navigation
- Or search Google: "relume affiliate program"

**Step 2: Sign up**
- Fill out the application
- Website: `https://vcelyy.github.io/ai-website-builders/`

**Step 3: Get your affiliate link**
- Copy your referral URL from dashboard

**What you'll get:**
```
Your affiliate link: https://relume.io/?ref=YOUR_ACTUAL_ID
Your ID to copy: YOUR_ACTUAL_ID
```

---

## 🔧 CODE UPDATE INSTRUCTIONS

Once you have your affiliate IDs, update the code:

### Step 1: Open the affiliate links file

```bash
# Navigate to project
cd /root/business-projects/ai-website-builders

# Edit the file
nano src/config/affiliate-links.ts
```

### Step 2: Replace placeholder codes

**BEFORE (current):**
```typescript
'10web': {
  name: '10Web AI',
  url: 'https://10web.io/ai-website-builder/',
  affiliateUrl: 'https://10web.io/?ref=YOUR_CODE',  // ← THIS IS THE PLACEHOLDER
  commission: '70%',
  // ... rest of config
}
```

**AFTER (with your actual ID):**
```typescript
'10web': {
  name: '10Web AI',
  url: 'https://10web.io/ai-website-builder/',
  affiliateUrl: 'https://10web.io/?ref=12345',  // ← YOUR ACTUAL ID
  commission: '70%',
  // ... rest of config
}
```

**Do this for each program:**
1. Find `YOUR_CODE` in the `affiliateUrl` field
2. Replace with your actual affiliate ID
3. Save the file

### Step 3: Rebuild the site

```bash
# Build the site
npm run build

# Expected output:
# ✓ Built in 93 seconds
# ✓ 468 pages generated
```

### Step 4: Deploy to GitHub Pages

```bash
# Add changes
git add src/config/affiliate-links.ts

# Commit
git commit -m "Add actual affiliate IDs for 10Web, Webflow, etc."

# Push
git push

# Expected output:
# GitHub Pages will auto-deploy
# Live in 2-3 minutes at: https://vcelyy.github.io/ai-website-builders/
```

### Step 5: Verify the changes work

```bash
# Visit your site
# Click on any "Try 10Web Free" button
# Check the URL - should have your affiliate ID now
# Example: https://10web.io/?ref=12345 (YOUR actual ID)
```

---

## 📊 TRACKING TEMPLATE

**Keep track of your progress:**

| Program | Applied | Approved | Affiliate ID | Updated in Code | Notes |
|---------|----------|----------|--------------|-----------------|-------|
| 10Web (70%) | ⬜ | ⬜ | YOUR_CODE | ⬜ | Priority #1 |
| Webflow (50%) | ⬜ | ⬜ | YOUR_CODE | ⬜ | Priority #2 |
| Hostinger (60%) | ⬜ | ⬜ | YOUR_CODE | ⬜ | Priority #3 |
| Framer (30%) | ⬜ | ⬜ | YOUR_CODE | ⬜ | Priority #4 |
| Relume (30%) | ⬜ | ⬜ | YOUR_CODE | ⬜ | Priority #5 |
| Squarespace | ⬜ | ⬜ | YOUR_CODE | ⬜ | Lower priority |
| Wix | ⬜ | ⬜ | YOUR_CODE | ⬜ | Lower priority |
| Durable (25%) | ⬜ | ⬜ | YOUR_CODE | ⬜ | Lower priority |
| Dorik (30%) | ⬜ | ⬜ | YOUR_CODE | ⬜ | Lower priority |
| (Other programs...) | ⬜ | ⬜ | YOUR_CODE | ⬜ | Week 2-3 |

**How to use:**
- Copy this to a spreadsheet (Google Sheets, Excel)
- Check boxes as you complete each step
- Track your progress visually

---

## 🚀 QUICK START PATH (Day-by-Day)

### Day 1: Join 10Web (30 minutes)
**Why:** Highest commission (70%), biggest impact

**Actions:**
1. Sign up: https://10web.io/affiliate-program/
2. Fill out application
3. Submit
4. Mark "Applied" checkbox

**Expected:** Approval in 1-3 business days

---

### Day 2: Join Webflow + Hostinger (50 minutes)
**Why:** Second and third highest commissions

**Actions:**
1. Sign up: Webflow (30 min)
2. Sign up: Hostinger (20 min)
3. Mark both as "Applied"

**Expected:** Approvals in 1-5 business days

---

### Day 3: Join Framer + Relume (40 minutes)
**Why:** Complete top 5 priority programs

**Actions:**
1. Find and join Framer (20 min)
2. Find and join Relume (20 min)
3. Mark both as "Applied"

**Expected:** Approvals in 1-14 days (varies)

---

### Day 4-7: Monitor Approvals
**What to do:**
- Check email for approval notifications
- Login to affiliate dashboards
- Copy your affiliate IDs
- Add IDs to tracking template

**When you get an approval:**
1. Copy your affiliate ID
2. Update `src/config/affiliate-links.ts`
3. Run: `npm run build`
4. Run: `git push`
5. Mark "Updated in Code" checkbox

---

### Week 2: Join Remaining Programs
**Schedule:**
- Monday: Squarespace, Wix (high volume)
- Tuesday: Durable, Dorik
- Wednesday: B12, Mixo, Pineapple
- Thursday: CodeWP, Unicorn, CodeDesign
- Friday: GoDaddy, IONOS, Jimdo

**Pace:** 2-3 programs per day (20-30 min total)

---

### Week 3: All Programs Joined
**Status check:**
- All 24 programs applied to
- Most approved
- All approved IDs updated in code
- Site rebuilt and deployed

**Result:** Monetization unblocked, traffic can convert

---

## 💡 PRO TIPS

### Tip 1: Be Honest in Applications
Don't exaggerate your traffic. Say:
- "New site, growing traffic"
- "Authentic reviews, not paid promotions"
- "Target audience: entrepreneurs, freelancers, small businesses"

They appreciate honesty over inflated numbers.

### Tip 2: Use Your Actual Site URL
Always use: `https://vcelyy.github.io/ai-website-builders/`

This shows:
- You have a real site
- It's professional
- You're serious

### Tip 3: Wait for Approval Before Updating Code
Don't update the code with placeholder IDs.
Only update when you have your ACTUAL affiliate ID.

### Tip 4: Keep Emails Organized
Create a folder in your email: "Affiliate Programs"
Save:
- Approval emails
- Affiliate ID information
- Login credentials (use password manager)

### Tip 5: Start Traffic After Top 3
Don't wait for all 24 programs.
Once you have 10Web, Webflow, and Hostinger approved:
- Update those 3 in the code
- Deploy
- Start your traffic strategy
- Join remaining programs while traffic runs

---

## ⚠️ TROUBLESHOOTING

### Issue 1: Application Rejected
**Why it happens:**
- Site looks too new
- Not enough content
- Suspicious activity

**What to do:**
1. Check rejection email for reason
2. Fix the issue (usually: add more content, wait for traffic)
3. Re-apply in 1-2 weeks
4. Or email them: "I have 468 pages of authentic reviews, please reconsider"

### Issue 2: No Response After 1 Week
**What to do:**
1. Check spam folder
2. Login to see if status changed
3. Email affiliate support: "Following up on my application"
4. Or proceed with other programs

### Issue 3: Can't Find Affiliate Program
**What to do:**
1. Google: "[tool name] affiliate program"
2. Check site footer for "Affiliates" or "Partners"
3. Email their support: "Do you have an affiliate program?"
4. If no program: Skip and move to next

### Issue 4: Code Won't Build After Update
**What to do:**
1. Check for syntax errors (missing quotes, commas)
2. Run: `npm run build` locally first
3. If build succeeds, then `git push`
4. If build fails: check error message, fix syntax, try again

### Issue 5: Affiliate Link Not Working
**What to do:**
1. Test the link yourself (click it)
2. Check if ID format is correct
3. Login to affiliate dashboard, verify your link format
4. Contact affiliate support if link seems wrong

---

## 📈 SUCCESS METRICS

**Week 1:**
- Applied to 5 programs
- 2-3 approved
- 2-3 IDs updated in code

**Week 2:**
- Applied to remaining 19 programs
- 10+ total approved
- 10+ IDs updated in code

**Week 3-4:**
- All programs applied
- Most approved
- Site fully monetized

**Month 2-3:**
- Traffic strategy executing
- First affiliate signup
- First dollar earned

**Month 6:**
- Target: $2,000/month
- Path: 25 referrals @ $80 avg commission
- Requires: 10,000 visitors/month (achievable with your strategy)

---

## ✅ CHECKLIST

**Day 1:**
- [ ] Sign up for 10Web affiliate program
- [ ] Fill out application completely
- [ ] Submit application

**Day 2:**
- [ ] Sign up for Webflow
- [ ] Sign up for Hostinger
- [ ] Check email for confirmations

**Day 3:**
- [ ] Sign up for Framer
- [ ] Sign up for Relume
- [ ] Update tracking template

**Day 4-7:**
- [ ] Check emails for approvals
- [ ] Copy affiliate IDs when approved
- [ ] Update code: `src/config/affiliate-links.ts`
- [ ] Run: `npm run build`
- [ ] Run: `git push`
- [ ] Test links on live site

**Week 2:**
- [ ] Join remaining 19 programs
- [ ] Update IDs as approved
- [ ] Keep tracking template current

**Week 3:**
- [ ] All programs applied
- [ ] All approved IDs in code
- [ ] Site fully monetized

---

## 🎉 YOU'RE DONE

**When this is complete:**
- ✅ All 24 affiliate programs joined
- ✅ All affiliate IDs in code
- ✅ Site rebuilt and deployed
- ✅ Every "Try [Tool]" button = revenue
- ✅ Traffic strategy unblocked
- ✅ Path to $2,000/month clear

**Next step:**
Execute TODAY ACTION CHECKLIST → Get traffic → Make money

---

**Status:** READY TO EXECUTE
**Created:** 2026-02-01
**Next:** Join 10Web affiliate program (30 min)
**Impact:** Unblock revenue from Day 1 traffic
