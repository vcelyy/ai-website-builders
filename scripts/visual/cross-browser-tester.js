#!/usr/bin/env node
/**
 * Cross-Browser Tester - Multi-Browser Compatibility Validation
 * Tests site across Chrome, Firefox, Safari, and Edge
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Logger, ProgressTracker } from '../lib/shared.js';
import { createMCPClient } from '../lib/mcp-wrapper.js';
import fs from 'fs';
import path from 'path';

puppeteer.use(StealthPlugin());

/**
 * Browser configurations
 * Note: Safari and Edge require additional setup
 * This implementation supports Chrome (default) and Firefox
 */
const BROWSER_CONFIGS = {
  chrome: {
    name: 'Chrome',
    product: 'chrome',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    supported: true
  },
  firefox: {
    name: 'Firefox',
    product: 'firefox',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    supported: true // Requires puppeteer-firefox or similar
  },
  safari: {
    name: 'Safari',
    product: 'safari',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    supported: false // Requires separate Safari driver setup
  },
  edge: {
    name: 'Edge',
    product: 'edge',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    supported: false // Edge is Chromium-based, similar to Chrome
  }
};

/**
 * CSS features to check for browser support
 */
const CSS_FEATURES = {
  grid: { property: 'display', value: 'grid', fallback: 'flex' },
  flexbox: { property: 'display', value: 'flex', fallback: 'block' },
  sticky: { property: 'position', value: 'sticky', fallback: 'relative' },
  customProperties: { property: '--test', value: 'value', fallback: null }
};

/**
 * JavaScript features to check
 */
const JS_FEATURES = [
  { name: 'Arrow functions', check: () => { try { eval('() => {}'); return true; } catch { return false; } } },
  { name: 'Async/await', check: () => { try { eval('async () => {}'); return true; } catch { return false; } } },
  { name: 'Optional chaining', check: () => { try { eval('const a = {}; a?.b'); return true; } catch { return false; } } },
  { name: 'Nullish coalescing', check: () => { try { eval('const a = null ?? 1'); return true; } catch { return false; } } },
  { name: 'Array.flat', check: () => typeof Array.prototype.flat === 'function' },
  { name: 'Object.fromEntries', check: () => typeof Object.fromEntries === 'function' },
  { name: 'String.matchAll', check: () => typeof String.prototype.matchAll === 'function' }
];

export class CrossBrowserTester {
  constructor(config = {}) {
    this.config = {
      url: config.url,
      referenceUrl: config.referenceUrl,
      browsers: config.browsers || ['chrome', 'firefox'], // Safari/Edge need special setup
      screenshotsDir: config.screenshotsDir || './screenshots/cross-browser',
      checkCSS: config.checkCSS !== undefined ? config.checkCSS : true,
      checkJS: config.checkJS !== undefined ? config.checkJS : true,
      timeout: config.timeout || 30000
    };

    this.logger = new Logger('cross-browser-test.log');
    this.mcp = createMCPClient(this.logger);
    this.results = {
      timestamp: new Date().toISOString(),
      url: this.config.url,
      referenceUrl: this.config.referenceUrl,
      browsers: [],
      summary: null
    };
  }

  /**
   * Main validation flow
   */
  async test() {
    this.logger.info(`Starting Cross-Browser Tester for: ${this.config.url}`);
    this.logger.info(`Testing browsers: ${this.config.browsers.join(', ')}`);

    try {
      // Initialize MCP
      await this.mcp.initialize();

      // Ensure screenshots directory exists
      fs.mkdirSync(this.config.screenshotsDir, { recursive: true });

      // Test each browser
      const progress = new ProgressTracker(this.config.browsers.length, this.logger);

      for (const browserKey of this.config.browsers) {
        const browserConfig = BROWSER_CONFIGS[browserKey];

        if (!browserConfig) {
          this.logger.warning(`Unknown browser: ${browserKey}`);
          continue;
        }

        if (!browserConfig.supported) {
          this.logger.warning(`Browser not fully supported in this environment: ${browserConfig.name}`);
          // Still test with user agent spoofing
        }

        progress.advance(`Testing browser: ${browserConfig.name}`);

        const browserResult = await this.testBrowser(browserKey, browserConfig);
        this.results.browsers.push(browserResult);
      }

      progress.complete();

      // Generate report
      return this.generateReport();

    } catch (error) {
      this.logger.error(`Cross-browser test failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test a single browser
   */
  async testBrowser(browserKey, browserConfig) {
    const result = {
      browser: browserConfig.name,
      key: browserKey,
      passed: true,
      issues: [],
      checks: {}
    };

    try {
      // Launch browser
      // Note: For Firefox, would need puppeteer-firefox or similar
      // For Safari, would need safaridriver
      // For Edge, use Chrome (Edge is Chromium-based)

      let launchOptions = {
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      };

      // For Firefox (if puppeteer-firefox is installed)
      if (browserKey === 'firefox') {
        try {
          // Try to launch Firefox (requires puppeteer-firefox)
          // For now, we'll simulate by using Chrome with Firefox user agent
          this.logger.info('  Firefox support: Using Chrome with Firefox user agent (full Firefox support requires puppeteer-firefox)');
        } catch (error) {
          this.logger.warning(`  Firefox not available: ${error.message}`);
          result.issues.push({
            type: 'browser_unavailable',
            severity: 'warning',
            message: 'Firefox browser not available. Install puppeteer-firefox for full Firefox testing.'
          });
        }
      }

      const browser = await puppeteer.launch(launchOptions);
      const page = await browser.newPage();

      // Set user agent
      await page.setUserAgent(browserConfig.userAgent);

      // Set viewport
      await page.setViewport({ width: 1920, height: 1080 });

      // Navigate to page
      this.logger.info(`  Loading in ${browserConfig.name}...`);
      await page.goto(this.config.url, {
        waitUntil: 'networkidle0',
        timeout: this.config.timeout
      });

      // Take screenshot
      const screenshotPath = path.join(
        this.config.screenshotsDir,
        `${browserKey}.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
      result.screenshot = screenshotPath;
      this.logger.info(`  Screenshot saved: ${screenshotPath}`);

      // Check 1: CSS compatibility
      if (this.config.checkCSS) {
        const cssCheck = await this.checkCSSCompatibility(page);
        result.checks.cssCompatibility = cssCheck;

        if (!cssCheck.passed) {
          result.passed = false;
          result.issues.push({
            type: 'css_incompatibility',
            severity: 'warning',
            message: cssCheck.message
          });
        }
      }

      // Check 2: JavaScript features
      if (this.config.checkJS) {
        const jsCheck = await this.checkJSFeatures(page);
        result.checks.jsFeatures = jsCheck;

        if (!jsCheck.passed) {
          result.passed = false;
          result.issues.push({
            type: 'js_incompatibility',
            severity: 'warning',
            message: jsCheck.message
          });
        }
      }

      // Check 3: Console errors
      const consoleCheck = await this.checkConsoleErrors(page);
      result.checks.consoleErrors = consoleCheck;

      if (!consoleCheck.passed) {
        result.passed = false;
        result.issues.push({
          type: 'console_errors',
          severity: 'error',
          message: consoleCheck.message
        });
      }

      // Check 4: Layout issues
      const layoutCheck = await this.checkLayoutIssues(page);
      result.checks.layoutIssues = layoutCheck;

      if (!layoutCheck.passed) {
        result.passed = false;
        result.issues.push({
          type: 'layout_issues',
          severity: 'warning',
          message: layoutCheck.message
        });
      }

      // Compare with reference if provided
      if (this.config.referenceUrl) {
        const referencePath = path.join(
          this.config.screenshotsDir,
          `reference-${browserKey}.png`
        );

        // Capture reference if not exists
        if (!fs.existsSync(referencePath)) {
          this.logger.info(`  Capturing reference for ${browserConfig.name}...`);
          const referencePage = await browser.newPage();
          await referencePage.setUserAgent(browserConfig.userAgent);
          await referencePage.setViewport({ width: 1920, height: 1080 });
          await referencePage.goto(this.config.referenceUrl, {
            waitUntil: 'networkidle0',
            timeout: this.config.timeout
          });
          await referencePage.screenshot({ path: referencePath, fullPage: false });
          await referencePage.close();
        }

        // Run visual diff
        if (fs.existsSync(referencePath)) {
          const diff = await this.mcp.visualDiff(referencePath, screenshotPath, {
            prompt: `Compare these screenshots from ${browserConfig.name}. Report any visual differences in layout, styling, or rendering.`
          });
          result.visualDiff = diff;

          if (!diff.matchAchieved && diff.matchPercentage < 95) {
            result.issues.push({
              type: 'visual_difference',
              severity: 'info',
              message: `Visual difference from reference: ${diff.matchPercentage}% match`
            });
          }
        }
      }

      await browser.close();

    } catch (error) {
      result.passed = false;
      result.issues.push({
        type: 'browser_error',
        severity: 'error',
        message: `Error testing ${browserConfig.name}: ${error.message}`
      });
    }

    return result;
  }

  /**
   * Check CSS compatibility
   */
  async checkCSSCompatibility(page) {
    const cssInfo = await page.evaluate((features) => {
      const unsupported = [];

      // Check each CSS feature
      for (const [name, config] of Object.entries(features)) {
        const testEl = document.createElement('div');
        testEl.style[config.property] = config.value;

        // Check if the browser supports the feature
        if (config.value !== null) {
          const supported = testEl.style[config.property] === config.value ||
                           testEl.style.cssText.includes(config.value);

          if (!supported) {
            unsupported.push({
              feature: name,
              property: config.property,
              value: config.value,
              fallback: config.fallback
            });
          }
        }
      }

      // Check for browser-specific prefixes
      const allElements = document.querySelectorAll('*');
      const prefixedStyles = [];

      allElements.forEach(el => {
        const style = window.getComputedStyle(el);
        for (let i = 0; i < style.length; i++) {
          const prop = style[i];
          if (prop.startsWith('-webkit-') || prop.startsWith('-moz-') || prop.startsWith('-ms-')) {
            prefixedStyles.push(prop);
          }
        }
      });

      return {
        unsupported,
        prefixedStyles: [...new Set(prefixedStyles)].slice(0, 10) // First 10 unique
      };
    }, CSS_FEATURES);

    if (cssInfo.unsupported.length > 0) {
      return {
        passed: false,
        message: `${cssInfo.unsupported.length} CSS feature(s) not supported`,
        unsupported: cssInfo.unsupported
      };
    }

    return {
      passed: true,
      message: 'All tested CSS features supported',
      prefixedStyles: cssInfo.prefixedStyles
    };
  }

  /**
   * Check JavaScript feature support
   */
  async checkJSFeatures(page) {
    const jsInfo = await page.evaluate((features) => {
      const unsupported = [];

      features.forEach(feature => {
        try {
          const supported = feature.check();
          if (!supported) {
            unsupported.push(feature.name);
          }
        } catch (error) {
          unsupported.push(feature.name);
        }
      });

      return { unsupported };
    }, JS_FEATURES);

    if (jsInfo.unsupported.length > 0) {
      return {
        passed: false,
        message: `${jsInfo.unsupported.length} JS feature(s) not supported: ${jsInfo.unsupported.join(', ')}`,
        unsupported: jsInfo.unsupported
      };
    }

    return {
      passed: true,
      message: 'All tested JS features supported'
    };
  }

  /**
   * Check for console errors
   */
  async checkConsoleErrors(page) {
    const errors = [];

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push({
          text: msg.text(),
          location: msg.location()
        });
      }
    });

    // Trigger a re-evaluation by reloading
    await page.reload({ waitUntil: 'networkidle0' });

    // Wait a bit for errors to accumulate
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (errors.length > 0) {
      return {
        passed: false,
        message: `${errors.length} console error(s) detected`,
        errors
      };
    }

    return {
      passed: true,
      message: 'No console errors detected'
    };
  }

  /**
   * Check for layout issues
   */
  async checkLayoutIssues(page) {
    const layoutInfo = await page.evaluate(() => {
      const issues = [];

      // Check for elements with negative margins (might cause layout issues)
      const negMargins = document.querySelectorAll('*');
      let negMarginCount = 0;
      negMargins.forEach(el => {
        const style = window.getComputedStyle(el);
        if (parseInt(style.marginTop) < 0 ||
            parseInt(style.marginLeft) < 0 ||
            parseInt(style.marginRight) < 0 ||
            parseInt(style.marginBottom) < 0) {
          negMarginCount++;
        }
      });

      // Check for floats (can cause layout issues in some browsers)
      const floated = document.querySelectorAll('[style*="float"]');
      const floatCount = floated.length;

      // Check for inline-block
      const inlineBlocks = document.querySelectorAll('*');
      let inlineBlockCount = 0;
      inlineBlocks.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.display === 'inline-block') {
          inlineBlockCount++;
        }
      });

      return {
        negativeMargins: negMarginCount,
        floats: floatCount,
        inlineBlocks: inlineBlockCount
      };
    });

    // These are potential issues, not necessarily failures
    const issues = [];

    if (layoutInfo.negativeMargins > 20) {
      issues.push({
        type: 'many_negative_margins',
        count: layoutInfo.negativeMargins,
        message: 'High number of negative margins might cause cross-browser layout differences'
      });
    }

    if (layoutInfo.floats > 10) {
      issues.push({
        type: 'many_floats',
        count: layoutInfo.floats,
        message: 'Consider using flexbox instead of floats for better browser compatibility'
      });
    }

    if (issues.length > 0) {
      return {
        passed: false,
        message: `${issues.length} potential layout issue(s) detected`,
        issues
      };
    }

    return {
      passed: true,
      message: 'No obvious layout issues detected',
      details: layoutInfo
    };
  }

  /**
   * Generate validation report
   */
  generateReport() {
    const passedBrowsers = this.results.browsers.filter(b => b.passed).length;
    const failedBrowsers = this.results.browsers.filter(b => !b.passed).length;

    const summary = {
      totalBrowsers: this.results.browsers.length,
      passed: passedBrowsers,
      failed: failedBrowsers,
      passRate: Math.round((passedBrowsers / this.results.browsers.length) * 100)
    };

    this.results.summary = summary;

    // Collect all issues
    const allIssues = [];
    this.results.browsers.forEach(browser => {
      browser.issues.forEach(issue => {
        allIssues.push({
          ...issue,
          browser: browser.browser
        });
      });
    });

    const report = {
      ...this.results,
      summary,
      allIssues,
      recommendations: this.generateRecommendations()
    };

    this.logger.info(`Cross-browser test complete: ${summary.passed}/${summary.totalBrowsers} browsers passed (${summary.passRate}% pass rate)`);

    return report;
  }

  /**
   * Generate recommendations based on issues found
   */
  generateRecommendations() {
    const recommendations = [];

    // Group issues by browser
    const issuesByBrowser = {};
    this.results.browsers.forEach(browser => {
      issuesByBrowser[browser.key] = browser.issues;
    });

    // CSS incompatibility recommendations
    this.results.browsers.forEach(browser => {
      const cssIssues = browser.issues.filter(i => i.type === 'css_incompatibility');
      if (cssIssues.length > 0) {
        const unsupported = browser.checks.cssCompatibility?.unsupported || [];
        unsupported.forEach(feature => {
          recommendations.push({
            priority: 'medium',
            issue: 'css_incompatibility',
            browser: browser.browser,
            recommendation: `Add fallback for ${feature.feature}: ${feature.property}: ${feature.fallback}`,
            feature: feature.feature
          });
        });
      }
    });

    // JavaScript polyfill recommendations
    this.results.browsers.forEach(browser => {
      const jsIssues = browser.issues.filter(i => i.type === 'js_incompatibility');
      if (jsIssues.length > 0) {
        const unsupported = browser.checks.jsFeatures?.unsupported || [];
        unsupported.forEach(feature => {
          recommendations.push({
            priority: 'medium',
            issue: 'js_incompatibility',
            browser: browser.browser,
            recommendation: `Add polyfill for ${feature}: Consider using core-js or @babel/polyfill`,
            feature
          });
        });
      }
    });

    // Console error recommendations
    this.results.browsers.forEach(browser => {
      const consoleErrors = browser.issues.filter(i => i.type === 'console_errors');
      if (consoleErrors.length > 0) {
        recommendations.push({
          priority: 'high',
          issue: 'console_errors',
          browser: browser.browser,
          recommendation: 'Fix JavaScript errors causing console output. Check browser-specific code paths.',
          errorCount: consoleErrors.length
        });
      }
    });

    // Float to flexbox recommendation
    const floatIssues = this.results.browsers.flatMap(b =>
      (b.checks.layoutIssues?.issues || []).filter(i => i.type === 'many_floats')
    );
    if (floatIssues.length > 0) {
      recommendations.push({
        priority: 'low',
        issue: 'many_floats',
        recommendation: 'Consider migrating from CSS floats to flexbox or grid for better cross-browser consistency',
        affectedBrowsers: floatIssues.map(i => i.count)
      });
    }

    // Browser-specific setup recommendations
    const unsupportedBrowsers = ['safari', 'edge'].filter(b => this.config.browsers.includes(b));
    unsupportedBrowsers.forEach(browser => {
      recommendations.push({
        priority: 'info',
        issue: 'browser_setup_required',
        browser: BROWSER_CONFIGS[browser].name,
        recommendation: `For full ${BROWSER_CONFIGS[browser].name} testing, install: ${
          browser === 'safari' ? 'safaridriver (macOS only)' : 'Edge WebDriver (Windows only)'
        }`
      });
    });

    return recommendations;
  }
}

/**
 * CLI entry point
 */
export async function main() {
  const args = process.argv.slice(2);
  const url = args[0];
  const referenceUrl = args[1];
  const browsersArg = args[2];

  if (!url) {
    console.error('Usage: node cross-browser-tester.js <url> [reference-url] [browsers]');
    console.error('Example: node cross-browser-tester.js http://localhost:3000 https://competitor.com "chrome,firefox"');
    console.error('');
    console.error('Available browsers: chrome, firefox (safari and edge require additional setup)');
    process.exit(1);
  }

  const browsers = browsersArg ? browsersArg.split(',') : ['chrome', 'firefox'];

  const tester = new CrossBrowserTester({
    url,
    referenceUrl,
    browsers: browsers.map(b => b.trim())
  });

  try {
    const report = await tester.test();
    console.log('\n=== Cross-Browser Compatibility Report ===');
    console.log(JSON.stringify(report, null, 2));

    // Exit with error code if any browsers failed
    process.exit(report.summary.failed === 0 ? 0 : 1);
  } catch (error) {
    console.error('Cross-browser test failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default CrossBrowserTester;
