#!/usr/bin/env node
/**
 * SEO Tester - Technical SEO Validation
 * Validates meta tags, structured data, sitemaps, robots.txt, and heading hierarchy
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Logger, ProgressTracker } from '../lib/shared.js';
import { SEO_REQUIREMENTS } from '../lib/quality-gates.js';
import https from 'https';
import http from 'http';
import { URL } from 'url';

puppeteer.use(StealthPlugin());

export class SEOTester {
  constructor(config = {}) {
    this.config = {
      url: config.url,
      requireTitle: config.requireTitle !== undefined ? config.requireTitle : true,
      requireDescription: config.requireDescription !== undefined ? config.requireDescription : true,
      requireOG: config.requireOG !== undefined ? config.requireOG : true,
      requireCanonical: config.requireCanonical !== undefined ? config.requireCanonical : true,
      checkStructuredData: config.checkStructuredData !== undefined ? config.checkStructuredData : true,
      checkSitemap: config.checkSitemap !== undefined ? config.checkSitemap : true,
      checkRobotsTxt: config.checkRobotsTxt !== undefined ? config.checkRobotsTxt : true,
      titleLength: config.titleLength || SEO_REQUIREMENTS.titleLength,
      descriptionLength: config.descriptionLength || SEO_REQUIREMENTS.descriptionLength,
      timeout: config.timeout || 30000
    };

    this.logger = new Logger('seo-test.log');
    this.results = {
      timestamp: new Date().toISOString(),
      url: this.config.url,
      categories: [],
      summary: null
    };
  }

  /**
   * Main validation flow
   */
  async test() {
    this.logger.info(`Starting SEO Tester for: ${this.config.url}`);

    try {
      // Launch browser
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      // Navigate to page
      this.logger.info(`Loading page: ${this.config.url}`);
      await page.goto(this.config.url, {
        waitUntil: 'networkidle0',
        timeout: this.config.timeout
      });

      // Run all test categories
      const tests = [];

      tests.push(this.testMetaTags(page));
      tests.push(this.testHeadings(page));
      tests.push(this.testInternalLinks(page));
      tests.push(this.testImages(page));

      if (this.config.checkStructuredData) {
        tests.push(this.testStructuredData(page));
      }

      if (this.config.checkSitemap) {
        tests.push(this.testSitemap());
      }

      if (this.config.checkRobotsTxt) {
        tests.push(this.testRobotsTxt());
      }

      // Execute all tests
      this.results.categories = await Promise.all(tests);

      await browser.close();

      // Generate report
      return this.generateReport();

    } catch (error) {
      this.logger.error(`SEO test failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test meta tags
   */
  async testMetaTags(page) {
    this.logger.info('Testing meta tags...');

    const metaInfo = await page.evaluate((config) => {
      const issues = [];

      // Get meta tags
      const title = document.querySelector('title')?.textContent || '';
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

      // Check title
      if (!title && config.requireTitle) {
        issues.push({
          type: 'missing_title',
          severity: 'critical',
          message: 'Missing <title> tag. Critical for SEO.'
        });
      } else if (title) {
        if (title.length < config.titleLength.min) {
          issues.push({
            type: 'title_too_short',
            severity: 'moderate',
            message: `Title too short: ${title.length} chars (min: ${config.titleLength.min})`,
            value: title
          });
        } else if (title.length > config.titleLength.max) {
          issues.push({
            type: 'title_too_long',
            severity: 'moderate',
            message: `Title too long: ${title.length} chars (max: ${config.titleLength.max}). May be truncated in SERPs.`,
            value: title
          });
        }
      }

      // Check meta description
      if (!metaDescription && config.requireDescription) {
        issues.push({
          type: 'missing_description',
          severity: 'moderate',
          message: 'Missing meta description. Recommended for SEO.'
        });
      } else if (metaDescription) {
        if (metaDescription.length < config.descriptionLength.min) {
          issues.push({
            type: 'description_too_short',
            severity: 'minor',
            message: `Description too short: ${metaDescription.length} chars (min: ${config.descriptionLength.min})`,
            value: metaDescription
          });
        } else if (metaDescription.length > config.descriptionLength.max) {
          issues.push({
            type: 'description_too_long',
            severity: 'moderate',
            message: `Description too long: ${metaDescription.length} chars (max: ${config.descriptionLength.max}). May be truncated.`,
            value: metaDescription
          });
        }
      }

      // Check canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical && config.requireCanonical) {
        issues.push({
          type: 'missing_canonical',
          severity: 'moderate',
          message: 'Missing canonical link tag. Recommended to prevent duplicate content issues.'
        });
      }

      // Check viewport meta
      const viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        issues.push({
          type: 'missing_viewport',
          severity: 'serious',
          message: 'Missing viewport meta tag. Critical for mobile SEO.'
        });
      }

      // Check robots meta
      const robots = document.querySelector('meta[name="robots"]');
      if (robots) {
        const content = robots.getAttribute('content')?.toLowerCase() || '';
        if (content.includes('noindex')) {
          issues.push({
            type: 'noindex_set',
            severity: 'critical',
            message: 'Page has noindex meta tag. It will NOT be indexed by search engines.',
            value: content
          });
        }
      }

      // Open Graph tags
      const ogTags = {
        'og:title': document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
        'og:description': document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
        'og:image': document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
        'og:url': document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
        'og:type': document.querySelector('meta[property="og:type"]')?.getAttribute('content')
      };

      const missingOG = Object.entries(ogTags).filter(([key, value]) => !value).map(([key]) => key);

      if (config.requireOG && missingOG.length > 0) {
        issues.push({
          type: 'missing_og_tags',
          severity: 'minor',
          message: `Missing Open Graph tags: ${missingOG.join(', ')}. Important for social media sharing.`,
          missing: missingOG
        });
      }

      // Twitter Card tags
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      if (!twitterCard) {
        issues.push({
          type: 'missing_twitter_card',
          severity: 'info',
          message: 'Missing Twitter Card meta tag. Recommended for Twitter sharing.'
        });
      }

      // Hreflang for multi-language
      const hreflang = document.querySelectorAll('link[rel="alternate"][hreflang]');
      if (hreflang.length === 0) {
        // This is just info, not an issue
        // Only relevant for multi-language sites
      }

      // Favicon
      const favicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
      if (!favicon) {
        issues.push({
          type: 'missing_favicon',
          severity: 'minor',
          message: 'Missing favicon. Affects branding in browser tabs and bookmarks.'
        });
      }

      return {
        title,
        titleLength: title.length,
        metaDescription,
        descriptionLength: metaDescription.length,
        hasCanonical: !!canonical,
        canonicalUrl: canonical?.getAttribute('href') || '',
        hasViewport: !!viewport,
        robotsContent: robots?.getAttribute('content') || '',
        ogTags,
        ogTagsPresent: Object.values(ogTags).filter(v => v).length,
        hasTwitterCard: !!twitterCard,
        hasFavicon: !!favicon,
        issues
      };
    }, {
      requireTitle: this.config.requireTitle,
      requireDescription: this.config.requireDescription,
      requireCanonical: this.config.requireCanonical,
      titleLength: this.config.titleLength,
      descriptionLength: this.config.descriptionLength
    });

    const passed = metaInfo.issues.filter(i => i.severity === 'critical').length === 0;

    this.logger.info(`  Meta tags: title=${metaInfo.titleLength} chars, description=${metaInfo.descriptionLength} chars, OG=${metaInfo.ogTagsPresent}/5`);

    return {
      category: 'meta_tags',
      passed,
      issues: metaInfo.issues,
      metrics: metaInfo
    };
  }

  /**
   * Test headings hierarchy
   */
  async testHeadings(page) {
    this.logger.info('Testing headings hierarchy...');

    const headingInfo = await page.evaluate((maxDepth) => {
      const issues = [];
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

      const headingData = Array.from(headings).map(h => ({
        tag: h.tagName.toLowerCase(),
        text: h.textContent?.trim().substring(0, 60) || '',
        level: parseInt(h.tagName.charAt(1))
      }));

      // Check for H1
      const h1s = headingData.filter(h => h.level === 1);
      if (h1s.length === 0) {
        issues.push({
          type: 'no_h1',
          severity: 'critical',
          message: 'No H1 tag found. Critical for SEO.'
        });
      } else if (h1s.length > 1) {
        issues.push({
          type: 'multiple_h1',
          severity: 'moderate',
          message: `Multiple H1 tags found (${h1s.length}). Should have only one for better SEO.`,
          count: h1s.length
        });
      }

      // Check heading hierarchy
      let previousLevel = 0;
      for (const heading of headingData) {
        if (previousLevel > 0 && heading.level > previousLevel + 1) {
          issues.push({
            type: 'heading_skip',
            severity: 'minor',
            message: `Skipped heading level: h${previousLevel} → h${heading.level}`,
            from: previousLevel,
            to: heading.level,
            text: heading.text
          });
        }
        previousLevel = heading.level;
      }

      // Check for headings too deep
      const tooDeep = headingData.filter(h => h.level > maxDepth);
      if (tooDeep.length > 0) {
        issues.push({
          type: 'heading_too_deep',
          severity: 'info',
          message: `${tooDeep.length} heading(s) deeper than h${maxDepth}. Consider restructuring.`,
          count: tooDeep.length
        });
      }

      // Check for empty headings
      const emptyHeadings = headingData.filter(h => !h.text);
      if (emptyHeadings.length > 0) {
        issues.push({
          type: 'empty_headings',
          severity: 'moderate',
          message: `${emptyHeadings.length} empty heading(s) found.`,
          count: emptyHeadings.length
        });
      }

      // Check for very long headings (should be descriptive but concise)
      const longHeadings = headingData.filter(h => h.text.length > 70);
      if (longHeadings.length > 0) {
        issues.push({
          type: 'long_headings',
          severity: 'minor',
          message: `${longHeadings.length} heading(s) longer than 70 characters. May be truncated in SERPs.`,
          count: longHeadings.length
        });
      }

      return {
        totalHeadings: headingData.length,
        h1Count: h1s.length,
        headingLevels: [...new Set(headingData.map(h => h.level))].sort(),
        issues
      };
    }, SEO_REQUIREMENTS.maxHeadingDepth);

    const passed = headingInfo.issues.filter(i => i.severity === 'critical').length === 0;

    this.logger.info(`  Headings: ${headingInfo.totalHeadings} total, ${headingInfo.h1Count} H1s`);

    return {
      category: 'headings',
      passed,
      issues: headingInfo.issues,
      metrics: headingInfo
    };
  }

  /**
   * Test internal links
   */
  async testInternalLinks(page) {
    this.logger.info('Testing internal links...');

    const linkInfo = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href]'));
      const url = window.location.href;
      const domain = window.location.hostname;

      const internalLinks = links.filter(a => {
        try {
          const href = a.getAttribute('href');
          const linkUrl = new URL(href, url);
          return linkUrl.hostname === domain || href.startsWith('/');
        } catch {
          return false;
        }
      });

      const externalLinks = links.filter(a => {
        try {
          const href = a.getAttribute('href');
          const linkUrl = new URL(href, url);
          return linkUrl.hostname !== domain && !href.startsWith('/');
        } catch {
          return false;
        }
      });

      // Check for broken links (404s would need actual fetch, checking format here)
      const emptyLinks = links.filter(a => !a.textContent?.trim() && !a.getAttribute('aria-label'));
      const javascriptLinks = links.filter(a => a.getAttribute('href')?.startsWith('javascript:'));

      return {
        totalLinks: links.length,
        internalLinks: internalLinks.length,
        externalLinks: externalLinks.length,
        emptyLinks: emptyLinks.length,
        javascriptLinks: javascriptLinks.length,
        linkTextSamples: internalLinks.slice(0, 10).map(a => ({
          text: a.textContent?.trim().substring(0, 30) || '',
          href: a.getAttribute('href')?.substring(0, 50) || ''
        }))
      };
    });

    const issues = [];

    if (linkInfo.emptyLinks > 0) {
      issues.push({
        type: 'empty_links',
        severity: 'moderate',
        message: `${linkInfo.emptyLinks} link(s) with no text or aria-label.`,
        count: linkInfo.emptyLinks
      });
    }

    if (linkInfo.javascriptLinks > 0) {
      issues.push({
        type: 'javascript_links',
        severity: 'minor',
        message: `${linkInfo.javascriptLinks} javascript: link(s) found. Not crawlable by search engines.`,
        count: linkInfo.javascriptLinks
      });
    }

    if (linkInfo.internalLinks < 5) {
      issues.push({
        type: 'few_internal_links',
        severity: 'info',
        message: `Only ${linkInfo.internalLinks} internal link(s). Consider adding more for better site structure.`,
        count: linkInfo.internalLinks
      });
    }

    const passed = issues.filter(i => i.severity === 'critical' || i.severity === 'serious').length === 0;

    this.logger.info(`  Links: ${linkInfo.internalLinks} internal, ${linkInfo.externalLinks} external`);

    return {
      category: 'internal_links',
      passed,
      issues,
      metrics: linkInfo
    };
  }

  /**
   * Test images
   */
  async testImages(page) {
    this.logger.info('Testing images...');

    const imageInfo = await page.evaluate(() => {
      const images = document.querySelectorAll('img');

      const missingAlt = Array.from(images).filter(img => !img.hasAttribute('alt'));
      const emptyAlt = Array.from(images).filter(img => img.getAttribute('alt') === '');
      const genericAlt = Array.from(images).filter(img => {
        const alt = img.getAttribute('alt')?.toLowerCase() || '';
        return /^(image|img|picture|photo|pic|\d+)$/.test(alt);
      });

      // Check for lazy loading
      const notLazyLoaded = Array.from(images).filter(img => {
        const loading = img.getAttribute('loading');
        const aboveFold = img.getBoundingClientRect().top < window.innerHeight;
        return !aboveFold && loading !== 'lazy' && !img.src.endsWith('.svg');
      });

      // Check for very large images
      const largeImages = Array.from(images).filter(img => {
        if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
          return true;
        }
        return false;
      });

      return {
        totalImages: images.length,
        missingAlt: missingAlt.length,
        emptyAlt: emptyAlt.length,
        genericAlt: genericAlt.length,
        notLazyLoaded: notLazyLoaded.length,
        largeImages: largeImages.length
      };
    });

    const issues = [];

    if (imageInfo.missingAlt > 0) {
      issues.push({
        type: 'missing_image_alt',
        severity: 'moderate',
        message: `${imageInfo.missingAlt} image(s) missing alt attribute. Important for SEO and accessibility.`,
        count: imageInfo.missingAlt
      });
    }

    if (imageInfo.genericAlt > 0) {
      issues.push({
        type: 'generic_image_alt',
        severity: 'minor',
        message: `${imageInfo.genericAlt} image(s) with generic alt text. Use descriptive alt for better SEO.`,
        count: imageInfo.genericAlt
      });
    }

    if (imageInfo.notLazyLoaded > 5) {
      issues.push({
        type: 'no_lazy_loading',
        severity: 'minor',
        message: `${imageInfo.notLazyLoaded} below-fold image(s) without lazy loading. Affects page load speed.`,
        count: imageInfo.notLazyLoaded
      });
    }

    if (imageInfo.largeImages > 0) {
      issues.push({
        type: 'large_images',
        severity: 'info',
        message: `${imageInfo.largeImages} very large image(s) found. Consider resizing/compressing.`,
        count: imageInfo.largeImages
      });
    }

    const passed = issues.filter(i => i.severity === 'critical' || i.severity === 'serious').length === 0;

    this.logger.info(`  Images: ${imageInfo.totalImages} total, ${imageInfo.missingAlt} missing alt`);

    return {
      category: 'images',
      passed,
      issues,
      metrics: imageInfo
    };
  }

  /**
   * Test structured data (JSON-LD)
   */
  async testStructuredData(page) {
    this.logger.info('Testing structured data...');

    const schemaInfo = await page.evaluate(() => {
      // Find JSON-LD scripts
      const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));

      const schemas = [];

      jsonLdScripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent);
          schemas.push({
            type: Array.isArray(data) ? data[0]?('@type') : data['@type'],
            valid: true,
            data
          });
        } catch (error) {
          schemas.push({
            type: 'unknown',
            valid: false,
            error: error.message
          });
        }
      });

      // Also check for microdata
      const microdata = document.querySelectorAll('[itemscope]');
      const rdfa = document.querySelectorAll('[typeof]');

      return {
        jsonLdCount: jsonLdScripts.length,
        schemaTypes: schemas.map(s => s.type).filter(t => t),
        hasInvalidSchema: schemas.some(s => !s.valid),
        microdataCount: microdata.length,
        rdfaCount: rdfa.length,
        schemas
      };
    });

    const issues = [];

    if (schemaInfo.jsonLdCount === 0) {
      issues.push({
        type: 'no_structured_data',
        severity: 'info',
        message: 'No JSON-LD structured data found. Recommended for rich snippets in SERPs.'
      });
    }

    if (schemaInfo.hasInvalidSchema) {
      issues.push({
        type: 'invalid_schema',
        severity: 'moderate',
        message: 'Invalid JSON-LD schema found. Syntax error or malformed data.'
      });
    }

    // Common schema types to check for
    const commonSchemas = ['WebSite', 'Organization', 'Article', 'BlogPosting', 'Product', 'LocalBusiness'];
    const hasCommonSchema = schemaInfo.schemaTypes.some(t => commonSchemas.includes(t));

    if (schemaInfo.jsonLdCount > 0 && !hasCommonSchema) {
      issues.push({
        type: 'uncommon_schema',
        severity: 'info',
        message: `Structured data found but not a common type. Consider: ${commonSchemas.join(', ')}.`,
        foundTypes: schemaInfo.schemaTypes
      });
    }

    const passed = issues.filter(i => i.severity === 'critical' || i.severity === 'serious' || i.severity === 'moderate').length === 0;

    this.logger.info(`  Structured data: ${schemaInfo.jsonLdCount} JSON-LD, types: ${schemaInfo.schemaTypes.join(', ') || 'none'}`);

    return {
      category: 'structured_data',
      passed,
      issues,
      metrics: schemaInfo
    };
  }

  /**
   * Test sitemap
   */
  async testSitemap() {
    this.logger.info('Testing sitemap...');

    const url = new URL(this.config.url);
    const sitemapUrls = [
      `${url.origin}/sitemap.xml`,
      `${url.origin}/sitemap_index.xml`,
      `${url.origin}/wp-sitemap.xml` // WordPress
    ];

    let sitemapFound = false;
    let sitemapUrl = '';
    let valid = false;
    let urlCount = 0;

    for (const sitemap of sitemapUrls) {
      try {
        const result = await this.fetchURL(sitemap);
        if (result.success && result.data.includes('<?xml')) {
          sitemapFound = true;
          sitemapUrl = sitemap;

          // Count URLs in sitemap
          const urlMatches = result.data.match(/<url>/g);
          urlCount = urlMatches ? urlMatches.length : 0;

          // Basic validation
          valid = result.data.includes('<urlset') || result.data.includes('<sitemapindex');

          break;
        }
      } catch (error) {
        // Try next sitemap URL
      }
    }

    const issues = [];

    if (!sitemapFound) {
      issues.push({
        type: 'no_sitemap',
        severity: 'moderate',
        message: 'No sitemap.xml found. Recommended for search engine crawling.',
        searched: sitemapUrls
      });
    } else if (!valid) {
      issues.push({
        type: 'invalid_sitemap',
        severity: 'moderate',
        message: 'Sitemap found but may be invalid.',
        url: sitemapUrl
      });
    } else if (urlCount === 0) {
      issues.push({
        type: 'empty_sitemap',
        severity: 'moderate',
        message: 'Sitemap is empty.',
        url: sitemapUrl
      });
    }

    const passed = sitemapFound && valid && urlCount > 0;

    this.logger.info(`  Sitemap: ${sitemapFound ? 'found' : 'not found'}, ${urlCount} URLs`);

    return {
      category: 'sitemap',
      passed,
      issues,
      metrics: {
        sitemapFound,
        sitemapUrl,
        urlCount,
        valid
      }
    };
  }

  /**
   * Test robots.txt
   */
  async testRobotsTxt() {
    this.logger.info('Testing robots.txt...');

    const url = new URL(this.config.url);
    const robotsUrl = `${url.origin}/robots.txt`;

    try {
      const result = await this.fetchURL(robotsUrl);

      if (!result.success) {
        this.logger.info(`  robots.txt: not found`);

        return {
          category: 'robots_txt',
          passed: true, // Not having robots.txt is OK (means allow all)
          issues: [{
            type: 'no_robots_txt',
            severity: 'info',
            message: 'No robots.txt found. All robots allowed by default.',
            url: robotsUrl
          }],
          metrics: {
            exists: false,
            url: robotsUrl
          }
        };
      }

      const content = result.data;
      const issues = [];

      // Check for common issues
      if (content.includes('Disallow: /')) {
        // Check if it's for all user agents
        const lines = content.split('\n').map(l => l.trim());
        let userAgentAll = false;
        let disallowAll = false;

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].toLowerCase() === 'user-agent: *') {
            userAgentAll = true;
          }
          if (userAgentAll && lines[i].toLowerCase() === 'disallow: /') {
            disallowAll = true;
            break;
          }
        }

        if (disallowAll) {
          issues.push({
            type: 'disallow_all',
            severity: 'critical',
            message: 'robots.txt disallows all user agents. Site will NOT be indexed!',
            content: 'Disallow: /'
          });
        }
      }

      // Check for sitemap reference
      if (!content.toLowerCase().includes('sitemap:')) {
        issues.push({
          type: 'no_sitemap_reference',
          severity: 'minor',
          message: 'robots.txt does not reference sitemap. Consider adding: Sitemap: https://example.com/sitemap.xml'
        });
      }

      const passed = issues.filter(i => i.severity === 'critical').length === 0;

      this.logger.info(`  robots.txt: found, ${issues.length} issue(s)`);

      return {
        category: 'robots_txt',
        passed,
        issues,
        metrics: {
          exists: true,
          url: robotsUrl,
          content: content.substring(0, 500) // First 500 chars
        }
      };

    } catch (error) {
      this.logger.info(`  robots.txt: error checking`);

      return {
        category: 'robots_txt',
        passed: true, // Assume OK if error
        issues: [{
          type: 'robots_error',
          severity: 'info',
          message: `Could not check robots.txt: ${error.message}`
        }],
        metrics: { exists: false }
      };
    }
  }

  /**
   * Fetch a URL and return response
   */
  fetchURL(url) {
    return new Promise((resolve) => {
      const protocol = url.startsWith('https') ? https : http;

      const req = protocol.get(url, (res) => {
        let data = '';

        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            success: res.statusCode === 200,
            statusCode: res.statusCode,
            data
          });
        });
      });

      req.on('error', () => {
        resolve({ success: false, error: 'Request failed' });
      });

      req.setTimeout(5000, () => {
        req.abort();
        resolve({ success: false, error: 'Timeout' });
      });
    });
  }

  /**
   * Generate validation report
   */
  generateReport() {
    const totalIssues = this.results.categories.reduce((sum, cat) => sum + cat.issues.length, 0);
    const criticalIssues = this.results.categories.reduce((sum, cat) =>
      sum + cat.issues.filter(i => i.severity === 'critical').length, 0);
    const passedCategories = this.results.categories.filter(c => c.passed).length;

    const summary = {
      totalCategories: this.results.categories.length,
      passedCategories,
      failedCategories: this.results.categories.length - passedCategories,
      totalIssues,
      criticalIssues,
      passed: criticalIssues === 0
    };

    this.results.summary = summary;

    // Collect all issues
    const allIssues = [];
    this.results.categories.forEach(cat => {
      cat.issues.forEach(issue => {
        allIssues.push({
          ...issue,
          category: cat.category
        });
      });
    });

    const report = {
      ...this.results,
      summary,
      allIssues,
      recommendations: this.generateRecommendations()
    };

    this.logger.info(`SEO test complete: ${passedCategories}/${summary.totalCategories} categories passed`);
    this.logger.info(`Total issues: ${totalIssues} (${criticalIssues} critical)`);

    return report;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Group issues by type
    const issueTypes = {};
    this.results.categories.forEach(cat => {
      cat.issues.forEach(issue => {
        if (!issueTypes[issue.type]) {
          issueTypes[issue.type] = [];
        }
        issueTypes[issue.type].push(issue);
      });
    });

    // Critical issues first
    if (issueTypes.missing_title || issueTypes.no_h1 || issueTypes.disallow_all) {
      recommendations.push({
        priority: 'critical',
        issues: ['missing_title', 'no_h1', 'disallow_all'].filter(t => issueTypes[t]),
        recommendation: 'Fix critical SEO issues: Add title tag, ensure H1 exists, check robots.txt does not disallow all.'
      });
    }

    // Meta tags
    if (issueTypes.missing_description || issueTypes.title_too_short || issueTypes.title_too_long) {
      recommendations.push({
        priority: 'high',
        issues: ['missing_description', 'title_too_short', 'title_too_long'],
        recommendation: `Optimize title (${this.config.titleLength.min}-${this.config.titleLength.max} chars) and description (${this.config.descriptionLength.min}-${this.config.descriptionLength.max} chars).`
      });
    }

    // Structured data
    if (issueTypes.no_structured_data) {
      recommendations.push({
        priority: 'medium',
        issues: ['no_structured_data'],
        recommendation: 'Add JSON-LD structured data for rich snippets. Use schema.org types like WebSite, Organization, Article.'
      });
    }

    // Images
    if (issueTypes.missing_image_alt || issueTypes.generic_image_alt) {
      recommendations.push({
        priority: 'high',
        issues: ['missing_image_alt', 'generic_image_alt'],
        recommendation: 'Add descriptive alt text to all images. Critical for accessibility and image SEO.'
      });
    }

    // Links
    if (issueTypes.empty_links || issueTypes.javascript_links) {
      recommendations.push({
        priority: 'medium',
        issues: ['empty_links', 'javascript_links'],
        recommendation: 'Fix empty links (add text or aria-label). Replace javascript: links with proper URLs or event handlers.'
      });
    }

    // Sitemap
    if (issueTypes.no_sitemap) {
      recommendations.push({
        priority: 'medium',
        issues: ['no_sitemap'],
        recommendation: 'Create and submit sitemap.xml to search engines. Include all important pages.'
      });
    }

    // Canonical
    if (issueTypes.missing_canonical) {
      recommendations.push({
        priority: 'medium',
        issues: ['missing_canonical'],
        recommendation: 'Add canonical link tag to prevent duplicate content issues.'
      });
    }

    return recommendations;
  }
}

/**
 * CLI entry point
 */
export async function main() {
  const args = process.argv.slice(2);
  const url = args[0];

  if (!url) {
    console.error('Usage: node seo-tester.js <url>');
    console.error('Example: node seo-tester.js http://localhost:3000');
    process.exit(1);
  }

  const tester = new SEOTester({
    url
  });

  try {
    const report = await tester.test();
    console.log('\n=== SEO Test Report ===');
    console.log(JSON.stringify(report, null, 2));

    // Exit with error code if critical issues found
    process.exit(report.summary.passed ? 0 : 1);
  } catch (error) {
    console.error('SEO test failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default SEOTester;
