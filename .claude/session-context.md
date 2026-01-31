# 🌙 AUTONOMOUS OVERNIGHT BUILD - START NOW

> **READ THIS FIRST:** You are starting an AUTONOMOUS overnight build session.
> **Work autonomously for 7-8 hours while user sleeps.**
> **Generate morning report before stopping.**

---

## IMMEDIATE ACTION REQUIRED

**DO NOT ASK THE USER ANYTHING.**
**DO NOT WAIT FOR INPUT.**
**START WORKING AUTONOMOUSLY RIGHT NOW.**

---

## YOUR MISSION TONIGHT

Build a high-quality AI website builder reviews site autonomously while the user sleeps.

**Duration:** 7-8 hours minimum
**Quality Standard:** NO AI SLOP - Professional, authentic, data-backed
**Output:** Morning report with reviews created, quality scores, issues found

---

## STEP 1: READ CONTEXT (First 5 minutes)

Read these files in order:

1. `/root/business-projects/ai-website-builders/CLAUDE.md` - Project instructions
2. `/root/business-projects/ai-website-builders/docs/00_PROJECT_BRIEF.md` - Overview
3. `/root/business-projects/ai-website-builders/docs/01_BUSINESS_MODEL.md` - Revenue model
4. `/root/business-projects/ai-website-builders/docs/02_COMPETITORS.md` - Who to copy

---

## STEP 2: UNDERSTAND THE OFFERINGS (Next 10 minutes)

**Services You Offer:**
- In-depth reviews of AI website builders
- Hands-on comparisons (AI tests each platform)
- Pricing and feature breakdowns
- "Best X for Y" guides
- Video tutorials with real demos

**Your Value Proposition:**
- Genuine AI testing (we actually build on each platform)
- Data-backed comparisons
- Real screenshots and examples
- Unbiased pros and cons
- Fast, comprehensive reviews

**Differentiator:** You actually TEST the builders, not just summarize marketing copy.

---

## STEP 3: IMPLEMENT CORE FEATURES (Next 30 minutes)

1. **Initialize Astro project** with Tailwind + DaisyUI
2. **Set up custom colors** (warm, professional palette)
3. **Create Review Card component** for builder comparisons
4. **Create Comparison Table component** for side-by-side features
5. **Set up automated testing suite** (in `/root/business-projects/ai-website-builders/scripts/`)

---

## STEP 4: CREATE REVIEWS IN BATCHES (All Night)

**Batch process:**
```yaml
batch_size: 2 reviews

for each_batch:
  step_1: RESEARCH
    - Identify 2 website builders to review
    - Check competitor sites for coverage gaps
    - Research affiliate programs

  step_2: HANDS_ON_TEST
    - AI builds test site on each platform
    - Document features, pricing, pros/cons
    - Capture screenshots
    - Test performance and SEO

  step_3: CREATE_CONTENT
    - Write in-depth review (1000+ words)
    - Create comparison table
    - Generate screenshots gallery
    - Add video tutorial (if time)
    - Include affiliate links

  step_4: QUALITY_GATE
    - Run automated testing suite
    - Check: Lighthouse ≥90, WCAG AA
    - Fix any issues
    - Only publish when tests pass
```

**Review Focus Areas:**
- Framer vs Webflow (e-commerce focus)
- Best AI website builder for small business
- 10Web vs Durable AI (AI features comparison)
- Cheapest website builder with SEO
- Squarespace alternatives for 2026

---

## STEP 5: QUALITY GATE CHECKLIST (AUTOMATED)

**CRITICAL: Run the automated testing suite on EVERY page before considering it done.**

```bash
# After creating each review/page, run:
cd /root/business-projects/ai-website-builders/scripts
node run-all-tests.js http://localhost:4321

# This runs all 11 testers:
# - Visual: layout, images, interactive, typography, responsive, cross-browser
# - Quality: accessibility, performance, SEO, security, content quality

# Quality Gates:
# - Lighthouse: ≥ 90
# - WCAG: AA level
# - Bundle size: ≤ 500KB
# - Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
```

**IF TESTS FAIL:**
1. Review test-results/test-results.json for specific issues
2. Fix the issues
3. Re-run tests
4. Only consider page "done" when quality gates PASS

**Every review must pass:**

**Content:**
- [ ] Hands-on testing documented
- [ ] Real screenshots included
- [ ] Specific features tested (not just listed)
- [ ] Honest pros AND cons
- [ ] Pricing accurate with date

**Voice:**
- [ ] First-person testing perspective
- [ ] Data-driven conclusions
- [ ] Specific examples from testing
- [ ] No marketing fluff
- [ ] Professional but accessible

**SEO:**
- [ ] Keyword in title and first paragraph
- [ ] Meta description (120-160 chars)
- [ ] Alt text on images
- [ ] Internal link to other reviews
- [ ] Affiliate links natural, not forced

---

## STEP 6: MORNING REPORT (Before 7-8 hours)

Generate: `/root/business-projects/ai-website-builders/overnight-report-[DATE].md`

Include:
- Reviews created vs approved
- Word counts
- Affiliate links placed
- Quality scores
- What worked / what didn't
- Issues for user review
- Next steps for user (what to do when they wake up)

---

## PROGRESS TRACKING

Every 30 minutes, log to `/root/business-projects/ai-website-builders/overnight-progress.log`:

```markdown
## Progress Update - [TIME]

### Batch Progress
- Current batch: [X]/2 reviews
- Reviews approved: [Y]
- Reviews failed quality: [Z]
- Total words: [N]
- Affiliate links: [M]

### Current Work
- Working on: [Builder Name]
- Status: [Researching|Testing|Writing|Publishing]

### Issues Found
- [List any issues and fixes]

### Learnings
- What's working: [Observations]
- What's not: [Observations]
```

---

## AFFILIATE STRATEGY

**Test before recommending:**
- Always test the builder yourself
- Document real experience
- Be honest about limitations

**Natural placement:**
- Within review context
- "I tested this and found..."
- Not "Click here to buy"

**Tracking:**
- Document affiliate programs joined
- Track which reviews convert
- Note best-performing builders

---

## ANTI-AI-SLOP REMINDERS

**FORBIDDEN:**
- ❌ Generic phrases: "great for", "user-friendly", "powerful"
- ❌ Marketing copy: "revolutionary", "game-changing"
- ❌ Hypothetical examples: "For instance..."
- ❌ Summarizing feature lists (actually TEST)

**REQUIRED:**
- ✅ Hands-on testing with real sites built
- ✅ Specific screenshots from testing
- ✅ Honest pros AND cons
- ✅ Data-driven comparisons
- ✅ First-person "I tested this" perspective
- ✅ Real examples from your tests

---

## TIME MANAGEMENT

- **Start:** Now
- **Work minimum:** 7 hours
- **Work maximum:** 8 hours
- **Stop condition:** Time limit OR 10+ reviews approved
- **Morning report:** Generate before stopping

---

## START NOW

**DO NOT WAIT. DO NOT ASK. START WORKING AUTONOMOUSLY.**

1. Read context files (5 min)
2. Initialize Astro project (10 min)
3. Create core components (15 min)
4. Create first review
5. Quality check and approve
6. Iterate all night
7. Generate morning report
8. Stop at 7-8 hours

---

**User is sleeping. Work autonomously. Good luck.**

---

**Loaded:** $(date)
**Session:** ai-website-builders-zai
**Mode:** AUTONOMOUS OVERNIGHT BUILD
