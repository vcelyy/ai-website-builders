#!/usr/bin/env node
/**
 * Performance Tester - Core Web Vitals and Performance Monitoring
 * Measures LCP, FID, CLS, and runs Lighthouse for comprehensive performance analysis
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Logger, ProgressTracker } from '../lib/shared.js';
import { CORE_WEB_VITALS, LIGHTHOUSE_SCORES, BUNDLE_LIMITS } from '../lib/quality-gates.js';

puppeteer.use(StealthPlugin());

/**
 * Performance thresholds and limits
 */
const PERFORMANCE_THRESHOLDS = {
  // Resource timing limits
  maxResourceTime: 3000,        // Max 3s per resource
  maxTotalResources: 100,        // Max 100 resources

  // Network thresholds
  max3GPageLoad: 10000,          // Max 10s on 3G
  max4GPageLoad: 4000,           // Max 4s on 4G

  // JavaScript execution
  maxJSExecutionTime: 2000,      // Max 2s JS execution
  maxJSSize: 300000,             // Max 300KB total JS

  // Memory
  maxJSHeapSize: 100 * 1024 * 1024, // Max 100MB heap

  // Rendering
  maxFirstPaint: 2000,           // Max 2s to first paint
  maxFirstContentfulPaint: 3000  // Max 3s to first contentful paint
};

export class PerformanceTester {
  constructor(config = {}) {
    this.config = {
      url: config.url,
      lighthouseThreshold: config.lighthouseThreshold || LIGHTHOUSE_SCORES.performance,
      runLighthouse: config.runLighthouse !== undefined ? config.runLighthouse : false, // Optional, requires lighthouse package
      testNetwork: config.testNetwork !== undefined ? config.testNetwork : true,
      testCoreWebVitals: config.testCoreWebVitals !== undefined ? config.testCoreWebVitals : true,
      testBundles: config.testBundles !== undefined ? config.testBundles : true,
      timeout: config.timeout || 60000 // Performance tests need more time
    };

    this.logger = new Logger('performance-test.log');
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
    this.logger.info(`Starting Performance Tester for: ${this.config.url}`);

    try {
      // Launch browser
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      // Run test categories
      const tests = [];

      if (this.config.testCoreWebVitals) {
        tests.push(this.testCoreWebVitals(browser));
      }

      if (this.config.testNetwork) {
        tests.push(this.testNetworkPerformance(browser));
      }

      if (this.config.testBundles) {
        tests.push(this.testBundleSize(browser));
      }

      tests.push(this.testResourceLoading(browser));
      tests.push(this.testJavaScriptExecution(browser));
      tests.push(this.testRenderingMetrics(browser));

      // Execute all tests
      this.results.categories = await Promise.all(tests);

      // Optionally run Lighthouse (requires lighthouse package)
      if (this.config.runLighthouse) {
        try {
          const lighthouseResult = await this.runLighthouse(browser);
          this.results.categories.push(lighthouseResult);
        } catch (error) {
          this.logger.warning(`Lighthouse test skipped: ${error.message}`);
        }
      }

      await browser.close();

      // Generate report
      return this.generateReport();

    } catch (error) {
      this.logger.error(`Performance test failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test Core Web Vitals
   */
  async testCoreWebVitals(browser) {
    this.logger.info('Testing Core Web Vitals...');

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Inject Web Vitals measurement script
    await page.evaluateOnNewDocument(() => {
      window.coreWebVitals = {
        LCP: null,
        FID: null,
        CLS: null,
        FCP: null,
        TTFB: null
      };

      // Measure LCP (Largest Contentful Paint)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        window.coreWebVitals.LCP = lastEntry.renderTime || lastEntry.loadTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Measure FID (First Input Delay)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!window.coreWebVitals.FID) {
            window.coreWebVitals.FID = entry.processingStart - entry.startTime;
          }
        });
      }).observe({ entryTypes: ['first-input'] });

      // Measure CLS (Cumulative Layout Shift)
      let clsValue = 0;
      new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            window.coreWebVitals.CLS = clsValue;
          }
        });
      }).observe({ entryTypes: ['layout-shift'] });

      // Measure FCP (First Contentful Paint)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          window.coreWebVitals.FCP = entries[0].renderTime || entries[0].loadTime;
        }
      }).observe({ entryTypes: ['paint'] });

      // Measure TTFB (Time to First Byte)
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        window.coreWebVitals.TTFB = navigation.responseStart;
      }
    });

    // Navigate and wait for page to load
    const startTime = Date.now();
    await page.goto(this.config.url, {
      waitUntil: 'networkidle0',
      timeout: this.config.timeout
    });

    // Wait a bit for LCP to be measured
    await this.wait(3000);

    // Trigger an input to measure FID
    await page.click('body');
    await this.wait(100);

    // Get Core Web Vitals
    const vitals = await page.evaluate(() => {
      return window.coreWebVitals || {};
    });

    await page.close();

    // Validate against thresholds
    const issues = [];
    let passed = true;

    // LCP
    if (!vitals.LCP) {
      issues.push({
        type: 'lcp_not_measured',
        severity: 'warning',
        message: 'LCP could not be measured'
      });
    } else if (vitals.LCP > CORE_WEB_VITALS.LCP.needsImprovement) {
      passed = false;
      issues.push({
        type: 'lcp_poor',
        severity: 'serious',
        message: `LCP too slow: ${Math.round(vitals.LCP)}ms (good: <${CORE_WEB_VITALS.LCP.good}ms)`,
        value: vitals.LCP
      });
    } else if (vitals.LCP > CORE_WEB_VITALS.LCP.good) {
      issues.push({
        type: 'lcp_needs_improvement',
        severity: 'moderate',
        message: `LCP needs improvement: ${Math.round(vitals.LCP)}ms (good: <${CORE_WEB_VITALS.LCP.good}ms)`,
        value: vitals.LCP
      });
    }

    // FID
    if (!vitals.FID) {
      issues.push({
        type: 'fid_not_measured',
        severity: 'info',
        message: 'FID not measured (requires user interaction)'
      });
    } else if (vitals.FID > CORE_WEB_VITALS.FID.needsImprovement) {
      passed = false;
      issues.push({
        type: 'fid_poor',
        severity: 'serious',
        message: `FID too slow: ${Math.round(vitals.FID)}ms (good: <${CORE_WEB_VITALS.FID.good}ms)`,
        value: vitals.FID
      });
    }

    // CLS
    if (vitals.CLS === null) {
      issues.push({
        type: 'cls_not_measured',
        severity: 'warning',
        message: 'CLS could not be measured'
      });
    } else if (vitals.CLS > CORE_WEB_VITALS.CLS.needsImprovement) {
      passed = false;
      issues.push({
        type: 'cls_poor',
        severity: 'serious',
        message: `CLS too high: ${vitals.CLS.toFixed(3)} (good: <${CORE_WEB_VITALS.CLS.good})`,
        value: vitals.CLS
      });
    } else if (vitals.CLS > CORE_WEB_VITALS.CLS.good) {
      issues.push({
        type: 'cls_needs_improvement',
        severity: 'moderate',
        message: `CLS needs improvement: ${vitals.CLS.toFixed(3)} (good: <${CORE_WEB_VITALS.CLS.good})`,
        value: vitals.CLS
      });
    }

    // FCP
    if (vitals.FCP && vitals.FCP > PERFORMANCE_THRESHOLDS.maxFirstContentfulPaint) {
      passed = false;
      issues.push({
        type: 'fcp_slow',
        severity: 'serious',
        message: `FCP too slow: ${Math.round(vitals.FCP)}ms (max: ${PERFORMANCE_THRESHOLDS.maxFirstContentfulPaint}ms)`,
        value: vitals.FCP
      });
    }

    // TTFB
    if (vitals.TTFB && vitals.TTFB > 800) {
      issues.push({
        type: 'ttfb_slow',
        severity: 'moderate',
        message: `TTFB slow: ${Math.round(vitals.TTFB)}ms (good: <600ms)`,
        value: vitals.TTFB
      });
    }

    this.logger.info(`  Core Web Vitals: LCP=${vitals.LCP ? Math.round(vitals.LCP) + 'ms' : 'N/A'}, FID=${vitals.FID ? Math.round(vitals.FID) + 'ms' : 'N/A'}, CLS=${vitals.CLS !== null ? vitals.CLS.toFixed(3) : 'N/A'}`);

    return {
      category: 'core_web_vitals',
      passed,
      issues,
      metrics: vitals
    };
  }

  /**
   * Test network performance with different connection types
   */
  async testNetworkPerformance(browser) {
    this.logger.info('Testing network performance...');

    const results = {
      category: 'network_performance',
      passed: true,
      issues: [],
      metrics: {}
    };

    // Test on slow 3G
    this.logger.info('  Testing on slow 3G...');
    const page3g = await browser.newPage();

    // Emulate slow 3G
    await page3g.emulateNetworkConditions({
      offline: false,
      downloadThroughput: 500 * 1024 / 8, // 500 Kbps
      uploadThroughput: 500 * 1024 / 8, // 500 Kbps
      latency: 100 // 100ms RTT
    });

    const start3g = Date.now();
    try {
      await page3g.goto(this.config.url, {
        waitUntil: 'networkidle0',
        timeout: this.config.timeout
      });
      const loadTime3g = Date.now() - start3g;
      results.metrics.loadTime3G = loadTime3g;

      if (loadTime3g > PERFORMANCE_THRESHOLDS.max3GPageLoad) {
        results.passed = false;
        results.issues.push({
          type: 'slow_3g',
          severity: 'serious',
          message: `Page too slow on 3G: ${Math.round(loadTime3g / 1000)}s (max: ${PERFORMANCE_THRESHOLDS.max3GPageLoad / 1000}s)`,
          loadTime: loadTime3g
        });
      }
    } catch (error) {
      results.issues.push({
        type: '3g_timeout',
        severity: 'serious',
        message: `Page failed to load on 3G within timeout`
      });
      results.passed = false;
    }

    await page3g.close();

    // Test on regular 4G
    this.logger.info('  Testing on 4G...');
    const page4g = await browser.newPage();

    await page4g.emulateNetworkConditions({
      offline: false,
      downloadThroughput: 10 * 1024 * 1024 / 8, // 10 Mbps
      uploadThroughput: 10 * 1024 * 1024 / 8, // 10 Mbps
      latency: 20 // 20ms RTT
    });

    const start4g = Date.now();
    try {
      await page4g.goto(this.config.url, {
        waitUntil: 'networkidle0',
        timeout: this.config.timeout
      });
      const loadTime4g = Date.now() - start4g;
      results.metrics.loadTime4G = loadTime4g;

      if (loadTime4g > PERFORMANCE_THRESHOLDS.max4GPageLoad) {
        results.passed = false;
        results.issues.push({
          type: 'slow_4g',
          severity: 'moderate',
          message: `Page slow on 4G: ${Math.round(loadTime4g / 1000)}s (max: ${PERFORMANCE_THRESHOLDS.max4GPageLoad / 1000}s)`,
          loadTime: loadTime4g
        });
      }
    } catch (error) {
      results.issues.push({
        type: '4g_timeout',
        severity: 'moderate',
        message: `Page failed to load on 4G within timeout`
      });
    }

    await page4g.close();

    this.logger.info(`  Network: 3G=${Math.round(results.metrics.loadTime3G / 1000)}s, 4G=${Math.round(results.metrics.loadTime4G / 1000)}s`);

    return results;
  }

  /**
   * Test bundle sizes
   */
  async testBundleSize(browser) {
    this.logger.info('Testing bundle sizes...');

    const page = await browser.newPage();
    await page.goto(this.config.url, {
      waitUntil: 'networkidle0',
      timeout: this.config.timeout
    });

    const bundleInfo = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');

      const jsFiles = resources.filter(r => r.name.endsWith('.js'));
      const cssFiles = resources.filter(r => r.name.endsWith('.css'));

      const totalJSSize = jsFiles.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const totalCSSSize = cssFiles.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);

      return {
        jsFiles: jsFiles.length,
        cssFiles: cssFiles.length,
        totalResources: resources.length,
        totalJSSize,
        totalCSSSize,
        totalSize,
        jsDetails: jsFiles.map(f => ({
          url: f.name.substring(f.name.lastIndexOf('/') + 1),
          size: f.transferSize || 0
        })).sort((a, b) => b.size - a.size).slice(0, 10) // Top 10 largest
      };
    });

    await page.close();

    const issues = [];
    let passed = true;

    if (bundleInfo.totalJSSize > PERFORMANCE_THRESHOLDS.maxJSSize) {
      passed = false;
      issues.push({
        type: 'js_too_large',
        severity: 'serious',
        message: `JS bundle too large: ${Math.round(bundleInfo.totalJSSize / 1024)}KB (max: ${PERFORMANCE_THRESHOLDS.maxJSSize / 1024}KB)`,
        size: bundleInfo.totalJSSize
      });
    }

    if (bundleInfo.totalSize > BUNDLE_LIMITS.total) {
      passed = false;
      issues.push({
        type: 'total_too_large',
        severity: 'serious',
        message: `Total page size too large: ${Math.round(bundleInfo.totalSize / 1024)}KB (max: ${BUNDLE_LIMITS.total / 1024}KB)`,
        size: bundleInfo.totalSize
      });
    }

    this.logger.info(`  Bundle: JS=${Math.round(bundleInfo.totalJSSize / 1024)}KB, CSS=${Math.round(bundleInfo.totalCSSSize / 1024)}KB, Total=${Math.round(bundleInfo.totalSize / 1024)}KB`);

    return {
      category: 'bundle_size',
      passed,
      issues,
      metrics: bundleInfo
    };
  }

  /**
   * Test resource loading
   */
  async testResourceLoading(browser) {
    this.logger.info('Testing resource loading...');

    const page = await browser.newPage();

    // Track resource timing
    const resourceTimings = [];

    page.on('response', async (response) => {
      const timing = response.timing();
      if (timing) {
        resourceTimings.push({
          url: response.url(),
          status: response.status(),
          timing: timing,
          size: (await response.text()).length
        });
      }
    });

    await page.goto(this.config.url, {
      waitUntil: 'networkidle0',
      timeout: this.config.timeout
    });

    const resourceInfo = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');

      const slowResources = resources.filter(r =>
        (r.duration || 0) > 3000
      );

      const failedResources = resources.filter(r =>
        r.transferSize === 0 && r.duration > 0
      );

      return {
        totalResources: resources.length,
        slowResources: slowResources.length,
        failedResources: failedResources.length,
        avgLoadTime: resources.reduce((sum, r) => sum + (r.duration || 0), 0) / resources.length,
        slowResourceDetails: slowResources.map(r => ({
          url: r.name.substring(r.name.lastIndexOf('/') + 1),
          duration: Math.round(r.duration)
        })).slice(0, 5)
      };
    });

    await page.close();

    const issues = [];
    let passed = true;

    if (resourceInfo.failedResources > 0) {
      passed = false;
      issues.push({
        type: 'failed_resources',
        severity: 'serious',
        message: `${resourceInfo.failedResources} resource(s) failed to load`,
        count: resourceInfo.failedResources
      });
    }

    if (resourceInfo.slowResources > 10) {
      issues.push({
        type: 'many_slow_resources',
        severity: 'moderate',
        message: `${resourceInfo.slowResources} resource(s) took >3s to load`,
        count: resourceInfo.slowResources
      });
    }

    if (resourceInfo.totalResources > PERFORMANCE_THRESHOLDS.maxTotalResources) {
      issues.push({
        type: 'too_many_resources',
        severity: 'moderate',
        message: `Too many resources: ${resourceInfo.totalResources} (max: ${PERFORMANCE_THRESHOLDS.maxTotalResources})`,
        count: resourceInfo.totalResources
      });
    }

    this.logger.info(`  Resources: ${resourceInfo.totalResources} total, ${resourceInfo.slowResources} slow, ${resourceInfo.failedResources} failed`);

    return {
      category: 'resource_loading',
      passed,
      issues,
      metrics: resourceInfo
    };
  }

  /**
   * Test JavaScript execution
   */
  async testJavaScriptExecution(browser) {
    this.logger.info('Testing JavaScript execution...');

    const page = await browser.newPage();

    // Track JS execution time
    await page.evaluateOnNewDocument(() => {
      window.jsExecutionStart = performance.now();
      window.jsTasks = [];
    });

    await page.goto(this.config.url, {
      waitUntil: 'networkidle0',
      timeout: this.config.timeout
    });

    // Wait for JS to execute
    await this.wait(2000);

    const jsInfo = await page.evaluate(() => {
      const executionTime = performance.now() - window.jsExecutionStart;

      // Count event listeners (indicator of JS complexity)
      const allElements = document.querySelectorAll('*');
      let eventListenerCount = 0;
      allElements.forEach(el => {
        // This is an approximation
        eventListenerCount++;
      });

      return {
        executionTime,
        eventListenerCount,
        memoryUsed: performance.memory ? performance.memory.usedJSHeapSize : null
      };
    });

    await page.close();

    const issues = [];
    let passed = true;

    if (jsInfo.executionTime > PERFORMANCE_THRESHOLDS.maxJSExecutionTime) {
      passed = false;
      issues.push({
        type: 'js_slow',
        severity: 'moderate',
        message: `JS execution too slow: ${Math.round(jsInfo.executionTime)}ms (max: ${PERFORMANCE_THRESHOLDS.maxJSExecutionTime}ms)`,
        executionTime: jsInfo.executionTime
      });
    }

    if (jsInfo.memoryUsed && jsInfo.memoryUsed > PERFORMANCE_THRESHOLDS.maxJSHeapSize) {
      issues.push({
        type: 'high_memory',
        severity: 'moderate',
        message: `JS heap size high: ${Math.round(jsInfo.memoryUsed / 1024 / 1024)}MB (max: ${PERFORMANCE_THRESHOLDS.maxJSHeapSize / 1024 / 1024}MB)`,
        memoryUsed: jsInfo.memoryUsed
      });
    }

    this.logger.info(`  JS: ${Math.round(jsInfo.executionTime)}ms execution, ${Math.round(jsInfo.memoryUsed / 1024 / 1024)}MB heap`);

    return {
      category: 'javascript_execution',
      passed,
      issues,
      metrics: jsInfo
    };
  }

  /**
   * Test rendering metrics
   */
  async testRenderingMetrics(browser) {
    this.logger.info('Testing rendering metrics...');

    const page = await browser.newPage();

    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const metrics = {};

        // Get navigation timing
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.startTime;
          metrics.loadComplete = navigation.loadEventEnd - navigation.startTime;
          metrics.domInteractive = navigation.domInteractive - navigation.startTime;
        }

        // Get paint timing
        const paint = performance.getEntriesByType('paint');
        paint.forEach(p => {
          metrics[p.name] = p.startTime;
        });

        resolve(metrics);
      });
    });

    await page.close();

    const issues = [];
    let passed = true;

    if (metrics.firstPaint && metrics.firstPaint > PERFORMANCE_THRESHOLDS.maxFirstPaint) {
      passed = false;
      issues.push({
        type: 'first_paint_slow',
        severity: 'serious',
        message: `First paint too slow: ${Math.round(metrics.firstPaint)}ms (max: ${PERFORMANCE_THRESHOLDS.maxFirstPaint}ms)`,
        value: metrics.firstPaint
      });
    }

    this.logger.info(`  Rendering: FP=${metrics.firstPaint ? Math.round(metrics.firstPaint) + 'ms' : 'N/A'}, DCL=${metrics.domContentLoaded ? Math.round(metrics.domContentLoaded) + 'ms' : 'N/A'}`);

    return {
      category: 'rendering_metrics',
      passed,
      issues,
      metrics
    };
  }

  /**
   * Run Lighthouse (optional - requires lighthouse package)
   */
  async runLighthouse(browser) {
    this.logger.info('Running Lighthouse...');

    try {
      // Dynamic import of lighthouse
      const lighthouse = await import('lighthouse');
      const chromeLauncher = await import('chrome-launcher');

      const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

      const options = {
        logLevel: 'info',
        output: 'json',
        port: chrome.port,
        onlyCategories: ['performance']
      };

      const runnerResult = await lighthouse.default(this.config.url, options);
      await chrome.kill();

      const score = runnerResult.lhr.categories.performance.score * 100;

      const issues = [];
      let passed = score >= this.config.lighthouseThreshold;

      if (!passed) {
        issues.push({
          type: 'lighthouse_failed',
          severity: 'serious',
          message: `Lighthouse score too low: ${Math.round(score)}/100 (min: ${this.config.lighthouseThreshold})`,
          score
        });
      }

      return {
        category: 'lighthouse',
        passed,
        issues,
        metrics: {
          score,
          audits: runnerResult.lhr.audits
        }
      };

    } catch (error) {
      this.logger.warning(`Lighthouse not available: ${error.message}`);

      return {
        category: 'lighthouse',
        passed: true,
        issues: [{
          type: 'lighthouse_unavailable',
          severity: 'info',
          message: 'Lighthouse package not installed. Install with: npm install lighthouse'
        }],
        metrics: { score: null }
      };
    }
  }

  /**
   * Generate validation report
   */
  generateReport() {
    const totalIssues = this.results.categories.reduce((sum, cat) => sum + cat.issues.length, 0);
    const passedCategories = this.results.categories.filter(c => c.passed).length;

    const summary = {
      totalCategories: this.results.categories.length,
      passedCategories,
      failedCategories: this.results.categories.length - passedCategories,
      totalIssues,
      passed: passedCategories === this.results.categories.length
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

    this.logger.info(`Performance test complete: ${passedCategories}/${summary.totalCategories} categories passed`);
    this.logger.info(`Total issues: ${totalIssues}`);

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

    // Core Web Vitals
    if (issueTypes.lcp_poor) {
      recommendations.push({
        priority: 'critical',
        issue: 'lcp_poor',
        recommendation: 'Optimize LCP: Preload largest content element, optimize images, use CDN, reduce server response time.',
        target: `<${CORE_WEB_VITALS.LCP.good}ms`
      });
    }

    if (issueTypes.fid_poor) {
      recommendations.push({
        priority: 'high',
        issue: 'fid_poor',
        recommendation: 'Optimize FID: Reduce JavaScript execution time, break up long tasks, use web workers.',
        target: `<${CORE_WEB_VITALS.FID.good}ms`
      });
    }

    if (issueTypes.cls_poor) {
      recommendations.push({
        priority: 'high',
        issue: 'cls_poor',
        recommendation: 'Fix CLS: Reserve space for images and ads, avoid inserting content above existing content, use CSS aspect-ratio.',
        target: `<${CORE_WEB_VITALS.CLS.good}`
      });
    }

    // Bundle size
    if (issueTypes.js_too_large || issueTypes.total_too_large) {
      recommendations.push({
        priority: 'critical',
        issue: 'bundle_size',
        recommendation: 'Reduce bundle size: Code splitting, tree shaking, remove unused dependencies, use dynamic imports, compress assets.',
        target: `<${BUNDLE_LIMITS.total / 1024}KB total`
      });
    }

    // Network performance
    if (issueTypes.slow_3g) {
      recommendations.push({
        priority: 'high',
        issue: 'network_performance',
        recommendation: 'Optimize for slow connections: Lazy load images, prioritize above-fold content, use adaptive loading, reduce requests.'
      });
    }

    // Resource loading
    if (issueTypes.many_slow_resources) {
      recommendations.push({
        priority: 'medium',
        issue: 'resource_loading',
        recommendation: 'Optimize resource loading: Use HTTP/2, parallelize downloads, defer non-critical resources, use preload/prefetch hints.'
      });
    }

    // JavaScript execution
    if (issueTypes.js_slow) {
      recommendations.push({
        priority: 'medium',
        issue: 'javascript_execution',
        recommendation: 'Optimize JS: Reduce main thread work, use code splitting, defer non-critical JS, consider service workers.'
      });
    }

    return recommendations;
  }

  /**
   * Utility wait function
   */
  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * CLI entry point
 */
export async function main() {
  const args = process.argv.slice(2);
  const url = args[0];
  const runLighthouse = args.includes('--lighthouse');

  if (!url) {
    console.error('Usage: node performance-tester.js <url> [--lighthouse]');
    console.error('Example: node performance-tester.js http://localhost:3000');
    console.error('         node performance-tester.js http://localhost:3000 --lighthouse');
    process.exit(1);
  }

  const tester = new PerformanceTester({
    url,
    runLighthouse
  });

  try {
    const report = await tester.test();
    console.log('\n=== Performance Test Report ===');
    console.log(JSON.stringify(report, null, 2));

    // Exit with error code if any categories failed
    process.exit(report.summary.passed ? 0 : 1);
  } catch (error) {
    console.error('Performance test failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default PerformanceTester;
