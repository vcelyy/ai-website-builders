# Deployment Guide: AI Website Builders

**Status:** Ready to deploy (468 pages, build verified)

**Target:** Netlify deployment at https://aiwebsitebuilders.com

---

## Option 1: Deploy via Netlify CLI (Recommended)

### Prerequisites

Netlify CLI is already installed on this server.

### Step 1: Authenticate with Netlify

```bash
netlify login
```

This will open a browser window. Log in to your Netlify account and authorize CLI access.

**Note:** If you don't have a Netlify account, create one at https://app.netlify.com/signup

### Step 2: Initialize Netlify Site

```bash
cd /root/business-projects/ai-website-builders
netlify init
```

When prompted:
- **What would you like to do?** → Choose "Create & configure a new site"
- **Team:** → Choose your team (or your personal account)
- **Site name:** → Press Enter for auto-generated, or enter `aiwebsitebuilders-com`

### Step 3: Deploy Site

```bash
netlify deploy --prod
```

This will:
1. Run the build command (`npm run build`)
2. Upload the `dist/` folder to Netlify
3. Deploy to production
4. Provide a live URL

**Expected output:**
```
✔ Deploying to main site
✔ Finished hashing 468 files
✔ CDN requesting 468 files
✔ Finished uploading 468 assets
✔ Site is live!

Website URL: https://random-name-12345.netlify.app
```

### Step 4: Set Custom Domain

Option A: Via Netlify Dashboard
1. Go to https://app.netlify.com
2. Select your site
3. Go to "Domain settings"
4. Click "Add custom domain"
5. Enter: `aiwebsitebuilders.com`
6. Follow DNS instructions

Option B: Via CLI
```bash
netlify sites:add-domain aiwebsitebuilders.com
```

Then update DNS records at your domain registrar:
```
Type: CNAME
Name: www
Value: [your-site].netlify.app

Type: A
Name: @
Value: 75.2.70.75
```

---

## Option 2: Deploy via Git Integration (Recommended for Long-Term)

### Step 1: Push to GitHub

If not already pushed:

```bash
cd /root/business-projects/ai-website-builders
git remote add origin https://github.com/YOUR_USERNAME/ai-website-builders.git
git branch -M main
git push -u origin main
```

### Step 2: Connect in Netlify Dashboard

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select your repository
5. Configure build settings (should auto-detect):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 20
6. Click "Deploy site"

### Benefits of Git Integration:
- Auto-deploy on git push
- Deploy previews on pull requests
- Rollback to any previous deploy
- Free SSL on custom domains

---

## Option 3: Manual Deploy via Netlify Dashboard

### Step 1: Prepare Build Files

```bash
cd /root/business-projects/ai-website-builders
npm run build
```

This creates the `dist/` folder with all site files.

### Step 2: Upload to Netlify

1. Go to https://app.netlify.com
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the `dist/` folder into the upload area
4. Wait for upload and deployment

**Note:** This is one-time only. For updates, you'll need to re-build and re-upload.

---

## Post-Deployment Checklist

### 1. Verify Site is Live

Visit your URL and check:
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Sample review pages load
- [ ] Comparison pages work
- [ ] Images load

### 2. Check Build Logs

If errors occur:
1. Go to Netlify dashboard
2. Click "Deploys"
3. Click on the failed deploy
4. Check "Deploy log" for errors

### 3. Verify SEO Files

Check these URLs exist:
- [ ] https://aiwebsitebuilders.com/sitemap-index.xml
- [ ] https://aiwebsitebuilders.com/robots.txt
- [ ] https://aiwebsitebuilders.com/manifest.json

### 4. Test Affiliate Links

Click various CTAs on the site:
- [ ] "Try 10Web Free" buttons
- [ ] "Try Framer Free" buttons
- [ ] Other tool links

Verify they go to correct URLs (with affiliate codes once configured).

---

## Environment Variables (Optional)

If you need environment variables:

### Via Netlify Dashboard:
1. Go to Site settings → Environment variables
2. Add variable:
   - Key: `NODE_VERSION`
   - Value: `20`

### Via CLI:
```bash
netlify env:set NODE_VERSION 20
```

---

## Netlify Configuration (Already Set)

The `netlify.toml` file is already configured:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

No changes needed unless you want custom redirects or headers.

---

## Troubleshooting

### Build Fails

**Error:** "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error:** "Port already in use"
The dev server isn't needed for deploy. Netlify runs its own build.

### Site Shows 404

1. Check that `dist/` folder exists
2. Verify `dist/index.html` exists
3. Check Netlify deploy logs
4. Ensure publish directory is set to `dist`

### Custom Domain Not Working

1. Check DNS records at your registrar
2. Verify domain is added in Netlify dashboard
3. Wait up to 24-48 hours for DNS propagation
4. Check SSL certificate status in Netlify

---

## Performance Optimization

Already configured in `netlify.toml`:

1. **Asset Caching:** `_astro/*` files cached for 1 year (immutable)
2. **Build Optimization:** Astro automatically minifies and bundles
3. **Image Optimization:** Use Astro's Image component for responsive images

---

## Analytics Integration (Optional)

### Netlify Analytics

1. Go to Site settings → Analytics
2. Enable Netlify Analytics
3. Get snippet and add to `<head>` in `src/layouts/Layout.astro`

### Google Analytics

Add to `src/layouts/Layout.astro`:

```astro
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script define:vars={{ GA_ID: 'G-XXXXXXXXXX' }}>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', GA_ID);
</script>
```

---

## Next Steps After Deployment

1. **Immediate (Day 1):**
   - Verify site is live
   - Test all major pages
   - Submit sitemap to Google Search Console

2. **Week 1:**
   - Set up analytics
   - Join affiliate programs
   - Update affiliate links in code

3. **Month 1:**
   - Monitor indexing status
   - Build backlinks
   - Create content upgrades

4. **Month 3+:**
   - Track affiliate conversions
   - Optimize high-traffic pages
   - Scale what works

---

## Current Status

| Status | Check |
|--------|-------|
| Build verified | ✅ 468 pages in ~100 seconds |
| netlify.toml configured | ✅ |
| Site ready for deploy | ✅ |
| Deployed | ❌ Not yet |
| Custom domain configured | ❌ Not yet |
| Affiliate links active | ❌ Using placeholders |

---

**Recommended Next Action:**

```bash
netlify login && netlify init && netlify deploy --prod
```

This will authenticate, initialize, and deploy in one sequence.
