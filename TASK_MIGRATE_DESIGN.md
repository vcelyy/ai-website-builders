# Task: Migrate B2B AI Stack Design to This Project

**Priority:** HIGH
**Created:** January 18, 2026
**Source:** User decision to use b2b-ai-stack's superior design for this project

---

## What This Is

The b2b-ai-stack project has a much better looking website design than this project. User wants to migrate that design here while preserving all 35+ content pages we've created.

---

## What to Do

### Step 1: Copy Design Foundation (10 minutes)

**Copy from `/root/business-projects/b2b-ai-stack/` to `/root/business-projects/ai-website-builders/`:**

```bash
# Create layouts directory if it doesn't exist
mkdir -p /root/business-projects/ai-website-builders/src/layouts

# Copy Layout.astro
cp /root/business-projects/b2b-ai-stack/src/layouts/Layout.astro \
   /root/business-projects/ai-website-builders/src/layouts/Layout.astro

# Backup old styles first
cp /root/business-projects/ai-website-builders/src/styles/global.css \
   /root/business-projects/ai-website-builders/src/styles/global.css.backup

# Copy new styles
cp /root/business-projects/b2b-ai-stack/src/styles/global.css \
   /root/business-projects/ai-website-builders/src/styles/global.css
```

**Verify:** Check files exist in ai-website-builders

---

### Step 2: Copy Key Components (5 minutes)

```bash
# Copy Logo component
cp /root/business-projects/b2b-ai-stack/src/components/Logo.astro \
   /root/business-projects/ai-website-builders/src/components/Logo.astro

# Note: Navigation and Footer are built into Layout.astro, so no need to copy
```

**Verify:** Logo.astro exists in ai-website-builders components

---

### Step 3: Update Branding in Layout.astro (5 minutes)

Edit `/root/business-projects/ai-website-builders/src/layouts/Layout.astro`:

1. **Update site name (line ~11):**
   ```astro
   title = 'AI Website Builders - What I Actually Found After 127 Hours of Testing',
   ```

2. **Update meta description (line ~12):**
   ```astro
   description = 'Hands-on testing of AI website builders. No affiliate links, no marketing fluff. Just actual results from 127+ hours of building real sites.',
   ```

3. **Update brand name in footer (line ~98):**
   ```astro
   <span class="text-xl font-bold text-white">AI Website Builders</span>
   ```

4. **Update nav links (lines ~58-61):**
   ```astro
   <a href="/reviews" class="text-gray-600 hover:text-gray-900 font-medium transition-colors">Reviews</a>
   <a href="/guides" class="text-gray-600 hover:text-gray-900 font-medium transition-colors">Guides</a>
   <a href="/comparisons" class="text-gray-600 hover:text-gray-900 font-medium transition-colors">Comparisons</a>
   <a href="/category" class="text-gray-600 hover:text-gray-900 font-medium transition-colors">Categories</a>
   ```

**Verify:** Brand names and links updated correctly

---

### Step 4: Migrate Homepage (15 minutes)

Update `/root/business-projects/ai-website-builders/src/pages/index.astro`:

1. **Replace entire file content** with b2b-ai-stack style, BUT adapted for AI website builders content:

```astro
---
import Layout from '../layouts/Layout.astro';
// Keep the recent findings data that's specific to AI website builders

const recentFindings = [
  { tool: 'Framer AI', finding: 'Spent 14 hours building a portfolio. Beautiful sites but export is intentionally broken. They don\'t want you to leave.', date: 'Jan 16', slug: '/reviews/framer-ai' },
  { tool: '10Web AI', finding: 'WordPress with AI sprinkled on top. Migration worked but page load times... 2.3 seconds for basic sites.', date: 'Jan 15', slug: '/reviews/10web-ai' },
  { tool: 'Durable AI', finding: 'Generated a site in 28 seconds. Then spent 2 hours trying to make simple edits. Fast but frustrating.', date: 'Jan 14', slug: '/reviews/durable-ai' },
];

const quickStats = [
  { label: 'Tools tested', value: '5' },
  { label: 'Hours spent', value: '127' },
  { label: 'Sites built', value: '23' },
  { label: 'Exports failed', value: '11' },
];
---

<Layout title="AI Website Builders - Honest Reviews After 127 Hours of Testing">
  <!-- HERO SECTION - Adapted from b2b-ai-stack -->
  <section class="relative overflow-hidden min-h-[85vh] flex items-center" style="background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-20 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-30" style="background: radial-gradient(circle, #6366f1 0%, transparent 70%);"></div>
      <div class="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-20" style="background: radial-gradient(circle, #F5521A 0%, transparent 70%);"></div>
    </div>

    <div class="container relative">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <div class="max-w-2xl">
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.05] mb-6" style="letter-spacing: -0.02em;">
            I spent 127 hours testing AI website builders.
            <span class="block text-accent mt-2" style="--tw-accent: #F5521A;">Here's what I found.</span>
          </h1>

          <p class="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
            Not the marketing copy. Not the affiliate reviews.
            <strong class="text-gray-900">The actual experience of building sites with these tools.</strong>
          </p>

          <div class="flex flex-col sm:flex-row gap-4 mb-8">
            <a href="/reviews" class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-200">
              See All Reviews
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a href="/guides" class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
              Browse Guides
            </a>
          </div>

          <div class="flex items-center gap-8 text-sm text-gray-500 border-t border-gray-200 pt-8">
            <div>
              <span class="font-bold text-gray-900 text-lg">{quickStats[0].value}</span>
              <span class="ml-1">{quickStats[0].label}</span>
            </div>
            <div>
              <span class="font-bold text-gray-900 text-lg">{quickStats[1].value}h</span>
              <span class="ml-1">spent testing</span>
            </div>
            <div>
              <span class="font-bold text-gray-900 text-lg">{quickStats[3].value}</span>
              <span class="ml-1">failed exports</span>
            </div>
          </div>
        </div>

        <!-- Right column - Recent findings preview -->
        <div class="relative hidden lg:block">
          <div class="absolute top-0 right-0 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
            <h3 class="font-bold text-gray-900 mb-4">Recent Testing</h3>
            {recentFindings.map((item) => (
              <a href={item.slug} class="block group mb-4 pb-4 border-b border-gray-100 last:border-0">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-semibold text-gray-900 group-hover:text-indigo-600">{item.tool}</span>
                  <span class="text-xs text-gray-500">{item.date}</span>
                </div>
                <p class="text-sm text-gray-600">{item.finding}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
</Layout>
```

**Verify:** Run `npm run dev` and check homepage loads correctly

---

### Step 5: Update All Content Pages (1-2 hours)

For each page in `/root/business-projects/ai-website-builders/src/pages/`:

1. **Add Layout import** at top:
   ```astro
   ---
   import Layout from '../layouts/Layout.astro';
   ---
   ```

2. **Replace entire `<html>` wrapper** with:
   ```astro
   <Layout title="Page Title - AI Website Builders">
     <!-- Keep existing page content, just remove old <html>, <head>, <body> tags -->
     <!-- Remove old <Navigation /> and <Footer /> components -->
   </Layout>
   ```

3. **Pages to update:**
   - `/about.astro`
   - `/methodology.astro`
   - `/comparisons.astro`
   - `/comparisons/*.astro` (all 7 comparison pages)
   - `/reviews/*.astro` (all 5 review pages)
   - `/category/*.astro` (all 6 category pages)
   - `/guides/*.astro` (all 13 guide pages)

**Script to help:**
```bash
# Find all .astro files that need updating
find /root/business-projects/ai-website-builders/src/pages -name "*.astro" -type f
```

**Verify:** Each page should render with new design

---

### Step 6: Clean Up Old Components (5 minutes)

Remove old components that are now in Layout.astro:

```bash
# Backup first
mv /root/business-projects/ai-website-builders/src/components/Navigation.astro \
   /root/business-projects/ai-website-builders/src/components/Navigation.astro.bak

mv /root/business-projects/ai-website-builders/src/components/Footer.astro \
   /root/business-projects/ai-website-builders/src/components/Footer.astro.bak
```

**Verify:** Site still works without these files

---

### Step 7: Test Everything (15 minutes)

```bash
cd /root/business-projects/ai-website-builders
npm run dev
```

**Checklist:**
- [ ] Homepage loads correctly
- [ ] Navigation works (click all links)
- [ ] All review pages load
- [ ] All comparison pages load
- [ ] All category pages load
- [ ] All guide pages load
- [ ] Mobile responsive (check browser dev tools)
- [ ] No console errors
- [ ] Footer displays correctly

**Build production version:**
```bash
npm run build
```

---

## What "Done" Looks Like

- ✅ All pages use the new Layout.astro from b2b-ai-stack
- ✅ Site has the professional, modern design from b2b-ai-stack
- ✅ All 35+ content pages preserved and working
- ✅ Branding updated to "AI Website Builders"
- ✅ Site builds without errors
- ✅ Mobile responsive

---

## Notes

- **Design is from b2b-ai-stack** - keep credit/acknowledgment in mind
- **Content is ours** - all the AI website builders testing data is original
- **Can customize further** - after migration, can tweak design for our specific needs
- **Backups created** - old files backed up with `.bak` extension

---

## After Completion

Update project status to reflect design migration complete.

Remove this task file when done.
