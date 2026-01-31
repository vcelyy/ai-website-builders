# AI Website Builders - Deployment Checklist

> **428 pages built (27MB). Ready to deploy.**

**Last Updated:** January 25, 2026
**Build Location:** `/root/business-projects/ai-website-builders/dist/`
**Domain:** aiwebsitebuilders.com

---

## Deployment Options

### Option A: Vercel (Recommended - Free)

**Time:** 5-10 minutes | **Cost:** Free | **Best for:** Fastest deployment

#### Steps:

1. **Go to Vercel** - https://vercel.com
2. **Sign up/login** with GitHub or email
3. **Drag & Drop** the `dist/` folder
   - Upload entire `/root/business-projects/ai-website-builders/dist/` folder
4. **Configure:**
   - Framework Preset: "Other"
   - Build Command: (Leave empty - already built)
   - Output Directory: `.` (root of uploaded folder)
5. **Deploy** - Click "Deploy"
6. **Your site is LIVE**

**Post-Deploy:**
- Add custom domain (aiwebsitebuilders.com)
- Update DNS to point to Vercel

---

### Option B: Netlify (Alternative - Free)

**Time:** 5-10 minutes | **Cost:** Free

#### Steps:

1. **Go to Netlify** - https://netlify.com
2. **Sign up/login**
3. **Drag & Drop** the `dist/` folder
4. **Your site is LIVE**

---

### Option C: Your Own Server (Hetzner)

Since you already have a server at 148.251.236.212, you can host it there:

```bash
# 1. Create directory
mkdir -p /var/www/ai-website-builders

# 2. Copy files
cp -r /root/business-projects/ai-website-builders/dist/* /var/www/ai-website-builders/

# 3. Configure nginx
nano /etc/nginx/sites-available/ai-website-builders
```

Add this config:
```nginx
server {
    listen 80;
    server_name aiwebsitebuilders.com www.aiwebsitebuilders.com;

    root /var/www/ai-website-builders;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }
}
```

```bash
# 4. Enable site
ln -s /etc/nginx/sites-available/ai-website-builders /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# 5. Enable SSL
apt install -y certbot python3-certbot-nginx
certbot --nginx -d aiwebsitebuilders.com -d www.aiwebsitebuilders.com
```

---

## Pre-Deployment Checklist

- [x] **Site built** - 428 pages ready
- [ ] **Sitemap generated** - Need to generate (not in dist/)
- [x] **Robots.txt configured** - In astro.config.mjs
- [ ] **Domain pointing** - Point aiwebsitebuilders.com to hosting
- [ ] **SSL enabled** - HTTPS for all pages

---

## Sitemap Generation

The sitemap isn't in the dist/ folder. Generate it:

```bash
cd /root/business-projects/ai-website-builders

# Install astro-sitemap if not installed
npm install @astrojs/sitemap

# Rebuild with sitemap
npm run build

# Verify sitemap exists
ls -la dist/sitemap.xml
```

---

## Post-Deployment Tasks (Day 1)

### 1. Update robots.txt
Create or verify `dist/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://aiwebsitebuilders.com/sitemap.xml
```

### 2. Submit to Google Search Console
1. Go to: https://search.google.com/search-console
2. Add property: https://aiwebsitebuilders.com
3. Verify ownership
4. Submit sitemap

### 3. Submit to Bing Webmaster Tools
1. Go to: https://bing.com/webmasters
2. Add site and verify
3. Submit sitemap

---

## Revenue Activation

### Affiliate Programs to Join

**High Commissions (30-70%):**

1. **Framer** - 30% recurring commission
2. **Webflow** - 50% commission first year
3. **Durable** - 25% commission
4. **10Web** - 30% commission (WordPress AI)
5. **Wix** - Variable commissions
6. **Squarespace** - Variable commissions
7. **Dorik** - 30% recurring

### Action Items (Post-Deploy)

**Week 1:**
- [ ] Sign up for 5-7 affiliate programs
- [ ] Add actual affiliate links to review pages
- [ ] Test affiliate links work
- [ ] Set up analytics

**Week 2-4:**
- [ ] Monitor traffic in Search Console
- [ ] Track affiliate clicks
- [ ] Optimize top-performing pages
- [ ] Add more reviews based on demand

---

## Expected Results

**Month 1:**
- Traffic: 100-500 visitors
- Affiliate clicks: 10-50
- Revenue: $0-100

**Month 2-3:**
- Traffic: 500-2000 visitors
- Affiliate clicks: 50-200
- Revenue: $100-500

**Month 4-6:**
- Traffic: 2000-10000 visitors
- Affiliate clicks: 200-1000
- Revenue: $500-2000/month

---

## Quick Start: Deploy in 5 Minutes (Vercel)

```bash
# 1. Go to Vercel.com
# 2. Drag the dist/ folder
# 3. Wait 30 seconds
# 4. Your site is LIVE
# 5. Add custom domain
```

**Total time: 5 minutes**

---

## Status

**Build:** ✅ Complete (428 pages, 27MB)
**Sitemap:** ⏳ Need to regenerate with @astrojs/sitemap
**Robots.txt:** ⏳ Need to add to dist/
**Deployment:** ⏳ PENDING (5-10 minutes)
**Affiliate Links:** ⏳ PENDING (need to sign up for programs)

---

## Troubleshooting

### Site shows 404 errors
- Verify all files were uploaded
- Check `dist/` folder was uploaded (not parent directory)

### Sitemap missing
- Install @astrojs/sitemap: `npm install @astrojs/sitemap`
- Rebuild: `npm run build`
- Verify sitemap.xml exists in dist/

---

**Next Action:** Regenerate sitemap → Deploy to Vercel (5 min) → Sign up for affiliates (1 hour)
