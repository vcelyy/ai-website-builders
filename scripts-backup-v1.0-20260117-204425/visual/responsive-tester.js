#!/usr/bin/env node
/**
 * Responsive Tester - Viewport and Responsive Design Validation
 * Tests site at multiple screen sizes and detects responsive issues
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Logger, ProgressTracker } from '../lib/shared.js';
import { BREAKPOINTS, INTERACTIVE_STANDARDS } from '../lib/quality-gates.js';
import fs from 'fs';
import path from 'path';

puppeteer.use(StealthPlugin());

export class ResponsiveTester {
  constructor(config = {}) {
    this.config = {
      url: config.url,
      referenceUrl: config.referenceUrl,
      viewports: config.viewports || this.getDefaultViewports(),
      screenshotsDir: config.screenshotsDir || './screenshots/responsive',
      minTappableSize: config.minTappableSize || INTERACTIVE_STANDARDS.minTappableSize,
      checkHorizontalScroll: config.checkHorizontalScroll !== undefined ? config.checkHorizontalScroll : true,
      checkTextReadable: config.checkTextReadable !== undefined ? config.checkTextReadable : true,
      checkButtonsTappable: config.checkButtonsTappable !== undefined ? config.checkButtonsTappable : true,
      timeout: config.timeout || 30000
    };

    this.logger = new Logger('responsive-test.log');
    this.results = {
      timestamp: new Date().toISOString(),
      url: this.config.url,
      referenceUrl: this.config.referenceUrl,
      viewports: [],
      summary: null
    };
  }

  /**
   * Get default viewport sizes
   */
  getDefaultViewports() {
    return [
      { width: 375, height: 667, name: 'iPhone SE', type: 'mobile' },
      { width: 414, height: 896, name: 'iPhone 11', type: 'mobile' },
      { width: 768, height: 1024, name: 'iPad', type: 'tablet' },
      { width: 1024, height: 768, name: 'iPad Pro', type: 'tablet' },
      { width: 1280, height: 720, name: 'Desktop Small', type: 'desktop' },
      { width: 1920, height: 1080, name: 'Desktop Large', type: 'desktop' }
    ];
  }

  /**
   * Main validation flow
   */
  async test() {
    this.logger.info(`Starting Responsive Tester for: ${this.config.url}`);
    this.logger.info(`Testing ${this.config.viewports.length} viewport sizes`);

    try {
      // Launch browser
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      // Ensure screenshots directory exists
      fs.mkdirSync(this.config.screenshotsDir, { recursive: true });

      // Test each viewport
      const progress = new ProgressTracker(this.config.viewports.length, this.logger);

      for (const viewport of this.config.viewports) {
        progress.advance(`Testing viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);

        const viewportResult = await this.testViewport(browser, viewport);
        this.results.viewports.push(viewportResult);
      }

      progress.complete();

      await browser.close();

      // Compare with reference if provided
      if (this.config.referenceUrl) {
        this.logger.info('Comparing with reference site...');
        const referenceComparison = await this.compareWithReference();
        this.results.referenceComparison = referenceComparison;
      }

      // Generate report
      return this.generateReport();

    } catch (error) {
      this.logger.error(`Responsive test failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test a single viewport
   */
  async testViewport(browser, viewport) {
    const result = {
      viewport: viewport,
      passed: true,
      issues: [],
      checks: {}
    };

    try {
      const page = await browser.newPage();

      // Set viewport
      await page.setViewport({ width: viewport.width, height: viewport.height });

      // Navigate to page
      this.logger.info(`  Loading ${viewport.name}...`);
      await page.goto(this.config.url, {
        waitUntil: 'networkidle0',
        timeout: this.config.timeout
      });

      // Take screenshot
      const screenshotPath = path.join(
        this.config.screenshotsDir,
        `${viewport.name.replace(/\s+/g, '-').toLowerCase()}-${viewport.width}x${viewport.height}.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: true });
      result.screenshot = screenshotPath;
      this.logger.info(`  Screenshot saved: ${screenshotPath}`);

      // Check 1: Horizontal scroll
      if (this.config.checkHorizontalScroll) {
        const scrollCheck = await this.checkHorizontalScroll(page, viewport);
        result.checks.horizontalScroll = scrollCheck;

        if (!scrollCheck.passed) {
          result.passed = false;
          result.issues.push({
            type: 'horizontal_scroll',
            severity: 'critical',
            message: scrollCheck.message
          });
        }
      }

      // Check 2: Text readability
      if (this.config.checkTextReadable) {
        const textCheck = await this.checkTextReadable(page, viewport);
        result.checks.textReadable = textCheck;

        if (!textCheck.passed) {
          result.passed = false;
          result.issues.push({
            type: 'text_not_readable',
            severity: 'warning',
            message: textCheck.message
          });
        }
      }

      // Check 3: Buttons tappable
      if (this.config.checkButtonsTappable) {
        const buttonCheck = await this.checkButtonsTappable(page, viewport);
        result.checks.buttonsTappable = buttonCheck;

        if (!buttonCheck.passed) {
          result.passed = false;
          result.issues.push({
            type: 'buttons_not_tappable',
            severity: 'critical',
            message: buttonCheck.message
          });
        }
      }

      // Check 4: Layout breaks
      const layoutCheck = await this.checkLayoutBreaks(page, viewport);
      result.checks.layoutBreaks = layoutCheck;

      if (!layoutCheck.passed) {
        result.passed = false;
        result.issues.push({
          type: 'layout_break',
          severity: 'critical',
          message: layoutCheck.message
        });
      }

      // Check 5: Overlapping elements
      const overlapCheck = await this.checkOverlappingElements(page, viewport);
      result.checks.overlappingElements = overlapCheck;

      if (!overlapCheck.passed) {
        result.passed = false;
        result.issues.push({
          type: 'overlapping_elements',
          severity: 'warning',
          message: overlapCheck.message
        });
      }

      await page.close();

    } catch (error) {
      result.passed = false;
      result.issues.push({
        type: 'viewport_error',
        severity: 'error',
        message: `Error testing viewport: ${error.message}`
      });
    }

    return result;
  }

  /**
   * Check for horizontal scroll
   */
  async checkHorizontalScroll(page, viewport) {
    const scrollInfo = await page.evaluate(() => {
      return {
        documentWidth: document.documentElement.scrollWidth,
        windowWidth: window.innerWidth,
        scrollable: document.documentElement.scrollWidth > window.innerWidth
      };
    });

    if (scrollInfo.scrollable) {
      const overflowWidth = scrollInfo.documentWidth - scrollInfo.windowWidth;
      return {
        passed: false,
        message: `Horizontal scroll detected (${overflowWidth}px overflow on ${viewport.width}px viewport)`,
        documentWidth: scrollInfo.documentWidth,
        windowWidth: scrollInfo.windowWidth,
        overflow: overflowWidth
      };
    }

    return {
      passed: true,
      message: `No horizontal scroll (${scrollInfo.windowWidth}px viewport)`,
      documentWidth: scrollInfo.documentWidth,
      windowWidth: scrollInfo.windowWidth
    };
  }

  /**
   * Check if text is readable
   */
  async checkTextReadable(page, viewport) {
    const textInfo = await page.evaluate(() => {
      const bodyStyles = window.getComputedStyle(document.body);
      const pElements = document.querySelectorAll('p');
      const firstP = pElements[0];

      if (!firstP) {
        return { hasText: false };
      }

      const pStyles = window.getComputedStyle(firstP);

      return {
        hasText: true,
        bodyFontSize: parseFloat(bodyStyles.fontSize),
        pFontSize: parseFloat(pStyles.fontSize),
        lineHeight: parseFloat(pStyles.lineHeight),
        color: pStyles.color,
        bgColor: bodyStyles.backgroundColor
      };
    });

    if (!textInfo.hasText) {
      return {
        passed: true,
        message: 'No text found to check'
      };
    }

    // Check font size (mobile should be at least 14px, desktop 16px)
    const minFontSize = viewport.type === 'mobile' ? 14 : 16;

    if (textInfo.pFontSize < minFontSize) {
      return {
        passed: false,
        message: `Text too small: ${textInfo.pFontSize}px (min: ${minFontSize}px for ${viewport.type})`,
        fontSize: textInfo.pFontSize
      };
    }

    return {
      passed: true,
      message: `Text readable: ${textInfo.pFontSize}px font`,
      fontSize: textInfo.pFontSize
    };
  }

  /**
   * Check if buttons are tappable
   */
  async checkButtonsTappable(page, viewport) {
    const buttonInfo = await page.evaluate((minSize) => {
      const buttons = document.querySelectorAll('button, a[href], [onclick], [role="button"]');
      const issues = [];

      buttons.forEach(btn => {
        const rect = btn.getBoundingClientRect();

        // Skip if not visible
        if (rect.width === 0 || rect.height === 0) return;

        // Check size
        if (rect.width < minSize || rect.height < minSize) {
          const text = btn.textContent?.trim().substring(0, 20) || btn.className || 'unnamed';
          issues.push({
            element: text,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            required: minSize
          });
        }
      });

      return {
        totalButtons: buttons.length,
        issues
      };
    }, this.config.minTappableSize);

    if (buttonInfo.issues.length > 0) {
      return {
        passed: false,
        message: `${buttonInfo.issues.length} buttons too small (min ${this.config.minTappableSize}px on ${viewport.type})`,
        smallButtons: buttonInfo.issues
      };
    }

    return {
      passed: true,
      message: `All ${buttonInfo.totalButtons} buttons are tappable`,
      totalButtons: buttonInfo.totalButtons
    };
  }

  /**
   * Check for layout breaks
   */
  async checkLayoutBreaks(page, viewport) {
    const layoutInfo = await page.evaluate(() => {
      const issues = [];

      // Check for images overflowing containers
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        const rect = img.getBoundingClientRect();
        const parent = img.parentElement;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          if (rect.width > parentRect.width + 5) { // 5px tolerance
            issues.push({
              type: 'image_overflow',
              src: img.src.substring(0, 50),
              imageWidth: Math.round(rect.width),
              containerWidth: Math.round(parentRect.width)
            });
          }
        }
      });

      // Check for viewport meta tag (critical for mobile)
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        issues.push({
          type: 'missing_viewport_meta',
          message: 'Missing viewport meta tag (critical for mobile)'
        });
      }

      return {
        issues
      };
    });

    if (layoutInfo.issues.length > 0) {
      return {
        passed: false,
        message: `${layoutInfo.issues.length} layout issue(s) detected`,
        issues: layoutInfo.issues
      };
    }

    return {
      passed: true,
      message: 'No layout breaks detected'
    };
  }

  /**
   * Check for overlapping elements
   */
  async checkOverlappingElements(page, viewport) {
    const overlapInfo = await page.evaluate(() => {
      // Get all visible elements
      const elements = document.querySelectorAll('*');
      const overlaps = [];

      // Sample check: check for absolutely positioned elements that might overlap
      const absElements = Array.from(elements).filter(el => {
        const style = window.getComputedStyle(el);
        return style.position === 'absolute' || style.position === 'fixed';
      });

      // Check each absolute element against others
      for (let i = 0; i < absElements.length; i++) {
        const el1 = absElements[i];
        const rect1 = el1.getBoundingClientRect();

        if (rect1.width === 0 || rect1.height === 0) continue;

        for (let j = i + 1; j < absElements.length; j++) {
          const el2 = absElements[j];
          const rect2 = el2.getBoundingClientRect();

          if (rect2.width === 0 || rect2.height === 0) continue;

          // Check for overlap
          const overlap = !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
          );

          if (overlap) {
            const id1 = el1.id || el1.className || el1.tagName;
            const id2 = el2.id || el2.className || el2.tagName;

            overlaps.push({
              element1: id1.toString().substring(0, 30),
              element2: id2.toString().substring(0, 30),
              area: Math.round(Math.abs(rect1.left - rect2.left) * Math.abs(rect1.top - rect2.top))
            });
          }
        }
      }

      return { overlaps };
    });

    if (overlapInfo.overlaps.length > 0) {
      return {
        passed: false,
        message: `${overlapInfo.overlaps.length} overlapping element(s) detected`,
        overlaps: overlapInfo.overlaps
      };
    }

    return {
      passed: true,
      message: 'No overlapping elements detected'
    };
  }

  /**
   * Compare with reference site
   */
  async compareWithReference() {
    // This would use MCP visual diff tool to compare screenshots
    // For now, return placeholder
    return {
      message: 'Reference comparison available with MCP tool integration',
      note: 'Use ui_diff_check to compare reference screenshots'
    };
  }

  /**
   * Generate validation report
   */
  generateReport() {
    const passedViewports = this.results.viewports.filter(v => v.passed).length;
    const failedViewports = this.results.viewports.filter(v => !v.passed).length;

    const summary = {
      totalViewports: this.results.viewports.length,
      passed: passedViewports,
      failed: failedViewports,
      passRate: Math.round((passedViewports / this.results.viewports.length) * 100)
    };

    this.results.summary = summary;

    // Collect all issues
    const allIssues = [];
    this.results.viewports.forEach(vp => {
      vp.issues.forEach(issue => {
        allIssues.push({
          ...issue,
          viewport: vp.viewport.name
        });
      });
    });

    const report = {
      ...this.results,
      summary,
      allIssues,
      recommendations: this.generateRecommendations()
    };

    this.logger.info(`Responsive test complete: ${summary.passed}/${summary.totalViewports} viewports passed (${summary.passRate}% pass rate)`);

    return report;
  }

  /**
   * Generate recommendations based on issues found
   */
  generateRecommendations() {
    const recommendations = [];

    // Count issues by type
    const issueCounts = {};
    this.results.viewports.forEach(vp => {
      vp.issues.forEach(issue => {
        const key = `${issue.type}_${vp.viewport.type}`;
        issueCounts[key] = (issueCounts[key] || 0) + 1;
      });
    });

    // Generate specific recommendations

    // Horizontal scroll issues
    const mobileScroll = issueCounts['horizontal_scroll_mobile'];
    if (mobileScroll) {
      recommendations.push({
        priority: 'critical',
        issue: 'horizontal_scroll_mobile',
        count: mobileScroll,
        recommendation: 'Fix horizontal scroll on mobile. Use max-width: 100% on images and flex containers. Add: img { max-width: 100%; height: auto; }',
        mediaQuery: `@media (max-width: 480px) { /* Add responsive fixes */ }`
      });
    }

    // Buttons too small on mobile
    const mobileButtons = issueCounts['buttons_not_tappable_mobile'];
    if (mobileButtons) {
      recommendations.push({
        priority: 'critical',
        issue: 'buttons_not_tappable_mobile',
        count: mobileButtons,
        recommendation: `Increase button size on mobile to at least ${this.config.minTappableSize}px. Use padding and min-height.`,
        mediaQuery: `@media (max-width: 480px) { button, a { min-height: ${this.config.minTappableSize}px; min-width: ${this.config.minTappableSize}px; } }`
      });
    }

    // Text not readable
    if (issueCounts['text_not_readable_mobile'] || issueCounts['text_not_readable_tablet']) {
      recommendations.push({
        priority: 'medium',
        issue: 'text_not_readable',
        count: (issueCounts['text_not_readable_mobile'] || 0) + (issueCounts['text_not_readable_tablet'] || 0),
        recommendation: 'Increase font size on smaller screens. Use relative units (rem) for scalability.',
        mediaQuery: `@media (max-width: 768px) { body { font-size: 16px; } }`
      });
    }

    // Layout breaks
    const layoutBreaks = Object.keys(issueCounts).filter(k => k.startsWith('layout_break_'));
    if (layoutBreaks.length > 0) {
      recommendations.push({
        priority: 'critical',
        issue: 'layout_breaks',
        recommendation: 'Fix layout breaks using flexbox/grid with proper wrapping. Add flex-wrap: wrap to containers.',
        mediaQuery: `@media (max-width: 768px) { .container { flex-wrap: wrap; } }`
      });
    }

    // Missing viewport meta
    if (issueCounts['missing_viewport_meta']) {
      recommendations.push({
        priority: 'critical',
        issue: 'missing_viewport_meta',
        recommendation: 'Add viewport meta tag to HTML head: <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        code: '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
      });
    }

    // Overlapping elements
    const overlaps = Object.keys(issueCounts).filter(k => k.startsWith('overlapping_elements_'));
    if (overlaps.length > 0) {
      recommendations.push({
        priority: 'medium',
        issue: 'overlapping_elements',
        recommendation: 'Fix overlapping by adjusting z-index, using proper positioning, or adding margins/padding.'
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
  const referenceUrl = args[1];

  if (!url) {
    console.error('Usage: node responsive-tester.js <url> [reference-url]');
    console.error('Example: node responsive-tester.js http://localhost:3000 https://competitor.com');
    process.exit(1);
  }

  const tester = new ResponsiveTester({
    url,
    referenceUrl,
    minTappableSize: 44
  });

  try {
    const report = await tester.test();
    console.log('\n=== Responsive Design Report ===');
    console.log(JSON.stringify(report, null, 2));

    // Exit with error code if any viewports failed
    process.exit(report.summary.failed === 0 ? 0 : 1);
  } catch (error) {
    console.error('Responsive test failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default ResponsiveTester;
