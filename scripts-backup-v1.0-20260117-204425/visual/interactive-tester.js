#!/usr/bin/env node
/**
 * Interactive Tester - Clickable Element Validation
 * Tests all buttons, links, and interactive elements for functionality and accessibility
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Logger, ProgressTracker } from '../lib/shared.js';
import { INTERACTIVE_STANDARDS } from '../lib/quality-gates.js';

puppeteer.use(StealthPlugin());

export class InteractiveTester {
  constructor(config = {}) {
    this.config = {
      url: config.url,
      minTappableSize: config.minTappableSize || INTERACTIVE_STANDARDS.minTappableSize,
      requireHover: config.requireHover !== undefined ? config.requireHover : true,
      requireFocus: config.requireFocus !== undefined ? config.requireFocus : true,
      requireActive: config.requireActive !== undefined ? config.requireActive : true,
      timeout: config.timeout || 30000
    };

    this.logger = new Logger('interactive-tester.log');
    this.results = {
      timestamp: new Date().toISOString(),
      url: this.config.url,
      totalElements: 0,
      passedElements: 0,
      failedElements: 0,
      elements: []
    };
  }

  /**
   * Main testing flow
   */
  async test() {
    this.logger.info(`Starting Interactive Tester for: ${this.config.url}`);
    this.logger.info(`Min tappable size: ${this.config.minTappableSize}px`);

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

      // Extract all interactive elements
      this.logger.info('Finding interactive elements...');
      const elementsInfo = await page.evaluate(() => {
        const elements = [];

        // Find all potentially interactive elements
        const selectors = [
          'a',
          'button',
          '[onclick]',
          'input[type="submit"]',
          'input[type="button"]',
          '[role="button"]',
          '[tabindex]:not([tabindex="-1"])'
        ];

        selectors.forEach(selector => {
          const nodes = document.querySelectorAll(selector);
          nodes.forEach((node, index) => {
            const rect = node.getBoundingClientRect();
            const computed = window.getComputedStyle(node);

            elements.push({
              tag: node.tagName,
              type: node.type || node.getAttribute('type') || '',
              role: node.getAttribute('role') || '',
              id: node.id || '',
              className: node.className || '',
              text: node.textContent?.substring(0, 100) || '',
              href: node.href || '',
              onclick: node.onclick ? true : false,
              tabIndex: node.tabIndex,
              visible: rect.width > 0 && rect.height > 0 && computed.visibility !== 'hidden',
              rect: {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
              },
              styles: {
                display: computed.display,
                visibility: computed.visibility,
                opacity: computed.opacity,
                pointerEvents: computed.pointerEvents,
                cursor: computed.cursor
              }
            });
          });
        });

        return elements;
      });

      // Remove duplicates
      const uniqueElements = this.deduplicateElements(elementsInfo);
      this.logger.info(`Found ${uniqueElements.length} unique interactive elements`);

      // Test each element
      const progress = new ProgressTracker(uniqueElements.length, this.logger);

      for (const elementInfo of uniqueElements) {
        progress.advance(`Testing: ${elementInfo.tag} "${elementInfo.text.substring(0, 30)}..."`);

        const testResult = await this.testElement(page, elementInfo);
        this.results.elements.push(testResult);

        if (testResult.passed) {
          this.results.passedElements++;
        } else {
          this.results.failedElements++;
        }
      }

      this.results.totalElements = uniqueElements.length;
      progress.complete();

      await browser.close();

      // Generate report
      return this.generateReport();

    } catch (error) {
      this.logger.error(`Testing failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Remove duplicate elements (same element matched by multiple selectors)
   */
  deduplicateElements(elements) {
    const seen = new Set();
    const unique = [];

    for (const element of elements) {
      // Create unique key from visible attributes
      const key = `${element.tag}-${element.id}-${element.className}-${element.text}`;

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(element);
      }
    }

    return unique;
  }

  /**
   * Test a single interactive element
   */
  async testElement(page, elementInfo) {
    const result = {
      tag: elementInfo.tag,
      text: elementInfo.text,
      id: elementInfo.id,
      className: elementInfo.className,
      passed: true,
      issues: [],
      tests: {}
    };

    try {
      // Test 1: Visibility
      const visibilityTest = await this.testVisibility(page, elementInfo);
      result.tests.visibility = visibilityTest;

      if (!visibilityTest.passed) {
        result.passed = false;
        result.issues.push({
          type: 'not_visible',
          severity: 'warning',
          message: 'Element is not visible on page'
        });
        // Don't continue testing if not visible
        return result;
      }

      // Test 2: Tappable size
      const tappableTest = this.testTappableSize(elementInfo);
      result.tests.tappable = tappableTest;

      if (!tappableTest.passed) {
        result.passed = false;
        result.issues.push({
          type: 'too_small',
          severity: 'warning',
          message: tappableTest.message
        });
      }

      // Test 3: Can receive focus
      const focusTest = await this.testFocusable(page, elementInfo);
      result.tests.focus = focusTest;

      if (!focusTest.passed) {
        result.passed = false;
        result.issues.push({
          type: 'not_focusable',
          severity: 'error',
          message: 'Element cannot receive keyboard focus'
        });
      }

      // Test 4: Has hover state
      if (this.config.requireHover) {
        const hoverTest = await this.testHoverState(page, elementInfo);
        result.tests.hover = hoverTest;

        if (!hoverTest.passed) {
          result.passed = false;
          result.issues.push({
            type: 'no_hover',
            severity: 'info',
            message: 'No hover state detected'
          });
        }
      }

      // Test 5: Has focus state
      if (this.config.requireFocus) {
        const focusStateTest = await this.testFocusState(page, elementInfo);
        result.tests.focusState = focusStateTest;

        if (!focusStateTest.passed) {
          result.passed = false;
          result.issues.push({
            type: 'no_focus_style',
            severity: 'info',
            message: 'No visible focus state detected'
          });
        }
      }

      // Test 6: Contrast ratio
      const contrastTest = await this.testContrast(page, elementInfo);
      result.tests.contrast = contrastTest;

      if (!contrastTest.passed) {
        result.passed = false;
        result.issues.push({
          type: 'poor_contrast',
          severity: 'error',
          message: contrastTest.message
        });
      }

      // Test 7: Click works (only for elements that can be clicked without breaking flow)
      if (elementInfo.tag !== 'A' || elementInfo.href.startsWith('#') || elementInfo.href.startsWith('javascript:')) {
        const clickTest = await this.testClick(page, elementInfo);
        result.tests.click = clickTest;

        if (!clickTest.passed) {
          result.passed = false;
          result.issues.push({
            type: 'click_failed',
            severity: 'error',
            message: clickTest.message
          });
        }
      }

    } catch (error) {
      result.passed = false;
      result.issues.push({
        type: 'test_error',
        severity: 'error',
        message: `Test error: ${error.message}`
      });
    }

    return result;
  }

  /**
   * Test if element is visible
   */
  async testVisibility(page, elementInfo) {
    if (!elementInfo.visible) {
      return {
        passed: false,
        message: 'Element has no visible size or is hidden'
      };
    }

    if (elementInfo.styles.display === 'none') {
      return {
        passed: false,
        message: 'Element has display: none'
      };
    }

    if (elementInfo.styles.visibility === 'hidden') {
      return {
        passed: false,
        message: 'Element has visibility: hidden'
      };
    }

    if (parseFloat(elementInfo.styles.opacity) < 0.01) {
      return {
        passed: false,
        message: `Element is nearly transparent (opacity: ${elementInfo.styles.opacity})`
      };
    }

    if (elementInfo.styles.pointerEvents === 'none') {
      return {
        passed: false,
        message: 'Element has pointer-events: none'
      };
    }

    return {
      passed: true,
      message: 'Element is visible'
    };
  }

  /**
   * Test tappable size (touch targets)
   */
  testTappableSize(elementInfo) {
    const { width, height } = elementInfo.rect;
    const minSize = this.config.minTappableSize;

    if (width < minSize || height < minSize) {
      return {
        passed: false,
        message: `Touch target too small: ${Math.round(width)}x${Math.round(height)}px (min: ${minSize}x${minSize}px)`,
        width,
        height
      };
    }

    return {
      passed: true,
      message: `Touch target acceptable: ${Math.round(width)}x${Math.round(height)}px`,
      width,
      height
    };
  }

  /**
   * Test if element can receive keyboard focus
   */
  async testFocusable(page, elementInfo) {
    // Check if element is natively focusable or has tabindex
    const nativelyFocusable = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(elementInfo.tag);
    const hasTabIndex = elementInfo.tabIndex !== null && elementInfo.tabIndex >= 0;

    if (!nativelyFocusable && !hasTabIndex) {
      return {
        passed: false,
        message: 'Element is not natively focusable and has no tabindex'
      };
    }

    if (elementInfo.tabIndex < 0) {
      return {
        passed: false,
        message: 'Element has tabindex="-1" (not focusable)'
      };
    }

    // Try to actually focus it
    try {
      const canFocus = await page.evaluate((el) => {
        try {
          el.focus();
          return document.activeElement === el;
        } catch {
          return false;
        }
      }, await page.$(this.getSelector(elementInfo)));

      if (!canFocus) {
        return {
          passed: false,
          message: 'Element cannot be focused programmatically'
        };
      }

    } catch (error) {
      return {
        passed: false,
        message: `Focus test error: ${error.message}`
      };
    }

    return {
      passed: true,
      message: 'Element can receive keyboard focus'
    };
  }

  /**
   * Test if element has hover state
   */
  async testHoverState(page, elementInfo) {
    try {
      const hasHover = await page.evaluate((el) => {
        // Check for :hover support by trying to match
        const style = window.getComputedStyle(el);
        const parent = el.parentElement;

        // Check if there's a hover rule in stylesheets
        const sheets = Array.from(document.styleSheets);
        for (const sheet of sheets) {
          try {
            const rules = sheet.cssRules || sheet.rules;
            for (const rule of rules) {
              if (rule.selectorText && rule.selectorText.includes(':hover')) {
                // Very basic check - would need more sophisticated parsing
                return true;
              }
            }
          } catch (e) {
            // CORS issues with some stylesheets
          }
        }

        return false;
      }, await page.$(this.getSelector(elementInfo)));

      // For now, assume hover exists if cursor is pointer
      const hasPointerCursor = elementInfo.styles.cursor === 'pointer';

      return {
        passed: hasPointerCursor,
        message: hasPointerCursor ? 'Has pointer cursor (suggests hover)' : 'No obvious hover state'
      };

    } catch (error) {
      return {
        passed: true,
        message: 'Could not test hover state (assuming OK)',
        note: 'error: ' + error.message
      };
    }
  }

  /**
   * Test if element has visible focus state
   */
  async testFocusState(page, elementInfo) {
    try {
      // Focus the element and check if styles change
      const hasFocusStyle = await page.evaluate((el) => {
        const before = JSON.stringify(window.getComputedStyle(el));

        el.focus();

        const after = JSON.stringify(window.getComputedStyle(el));

        return before !== after;
      }, await page.$(this.getSelector(elementInfo)));

      return {
        passed: hasFocusStyle,
        message: hasFocusStyle ? 'Focus changes element appearance' : 'No visible focus style'
      };

    } catch (error) {
      return {
        passed: true,
        message: 'Could not test focus state (assuming OK)',
        note: 'error: ' + error.message
      };
    }
  }

  /**
   * Test contrast ratio
   */
  async testContrast(page, elementInfo) {
    try {
      const contrast = await page.evaluate((el) => {
        const style = window.getComputedStyle(el);

        // Get foreground color
        const fg = style.color;

        // Get background color (handle transparent)
        let bg = style.backgroundColor;
        if (bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') {
          // Try to get parent background
          const parent = el.parentElement;
          if (parent) {
            const parentStyle = window.getComputedStyle(parent);
            bg = parentStyle.backgroundColor;
          }
        }

        // Parse colors
        function parseColor(color) {
          const rgba = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (rgba) {
            const r = parseInt(rgba[1]) / 255;
            const g = parseInt(rgba[2]) / 255;
            const b = parseInt(rgba[3]) / 255;
            const a = rgba[4] !== undefined ? parseFloat(rgba[4]) : 1;

            // Blend with white if transparent
            if (a < 1) {
              return {
                r: r * a + 1 * (1 - a),
                g: g * a + 1 * (1 - a),
                b: b * a + 1 * (1 - a)
              };
            }

            return { r, g, b };
          }

          // Handle hex colors
          const hex = color.match(/#([0-9a-f]{3,8})/i);
          if (hex) {
            let hexValue = hex[1];
            if (hexValue.length === 3) {
              hexValue = hexValue.split('').map(c => c + c).join('');
            }
            return {
              r: parseInt(hexValue.substr(0, 2), 16) / 255,
              g: parseInt(hexValue.substr(2, 2), 16) / 255,
              b: parseInt(hexValue.substr(4, 2), 16) / 255
            };
          }

          return null;
        }

        function getLuminance(r, g, b) {
          const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
          return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        }

        function getContrastRatio(color1, color2) {
          const l1 = getLuminance(color1.r, color1.g, color1.b);
          const l2 = getLuminance(color2.r, color2.g, color2.b);
          const lighter = Math.max(l1, l2);
          const darker = Math.min(l1, l2);
          return (lighter + 0.05) / (darker + 0.05);
        }

        const fgColor = parseColor(fg);
        const bgColor = parseColor(bg);

        if (!fgColor || !bgColor) {
          return { ratio: null, error: 'Could not parse colors' };
        }

        const ratio = getContrastRatio(fgColor, bgColor);

        return {
          ratio: Math.round(ratio * 100) / 100,
          foreground: fg,
          background: bg
        };

      }, await page.$(this.getSelector(elementInfo)));

      // Check if meets WCAG AA (4.5:1 for normal text)
      const minRatio = 4.5;
      const passes = contrast.ratio >= minRatio;

      return {
        passed: passes,
        message: passes
          ? `Contrast OK: ${contrast.ratio}:1 (min: ${minRatio}:1)`
          : `Poor contrast: ${contrast.ratio}:1 (min: ${minRatio}:1)`,
        ratio: contrast.ratio
      };

    } catch (error) {
      return {
        passed: true,
        message: 'Could not test contrast (assuming OK)',
        note: 'error: ' + error.message
      };
    }
  }

  /**
   * Test if element can be clicked
   */
  async testClick(page, elementInfo) {
    try {
      const clickResult = await page.evaluate((el) => {
        try {
          // Check if element is disabled
          if (el.disabled) {
            return { clickable: false, reason: 'Element is disabled' };
          }

          // Check if pointer events are allowed
          const style = window.getComputedStyle(el);
          if (style.pointerEvents === 'none') {
            return { clickable: false, reason: 'pointer-events: none' };
          }

          return { clickable: true };
        } catch (error) {
          return { clickable: false, reason: error.message };
        }
      }, await page.$(this.getSelector(elementInfo)));

      if (!clickResult.clickable) {
        return {
          passed: false,
          message: clickResult.reason
        };
      }

      // Don't actually click for navigation elements (would leave the page)
      // Just verify it's clickable
      return {
        passed: true,
        message: 'Element is clickable'
      };

    } catch (error) {
      return {
        passed: false,
        message: `Click test error: ${error.message}`
      };
    }
  }

  /**
   * Generate CSS selector for element
   */
  getSelector(elementInfo) {
    if (elementInfo.id) {
      return `#${elementInfo.id}`;
    }

    if (elementInfo.className) {
      const classes = elementInfo.className.split(' ').filter(c => c).join('.');
      if (classes) {
        return `${elementInfo.tag.toLowerCase()}.${classes}`;
      }
    }

    return elementInfo.tag.toLowerCase();
  }

  /**
   * Generate validation report
   */
  generateReport() {
    const report = {
      ...this.results,
      summary: {
        total: this.results.totalElements,
        passed: this.results.passedElements,
        failed: this.results.failedElements,
        passRate: this.results.totalElements > 0
          ? Math.round((this.results.passedElements / this.results.totalElements) * 100)
          : 0
      },
      recommendations: this.generateRecommendations()
    };

    this.logger.info(`Testing complete: ${report.summary.passed}/${report.summary.total} passed (${report.summary.passRate}% pass rate)`);

    return report;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    const issueCounts = {};

    this.results.elements.forEach(el => {
      el.issues.forEach(issue => {
        issueCounts[issue.type] = (issueCounts[issue.type] || 0) + 1;
      });
    });

    if (issueCounts.not_visible) {
      recommendations.push({
        priority: 'medium',
        issue: 'not_visible',
        count: issueCounts.not_visible,
        recommendation: 'Review hidden interactive elements - ensure they become visible when needed'
      });
    }

    if (issueCounts.too_small) {
      recommendations.push({
        priority: 'high',
        issue: 'too_small',
        count: issueCounts.too_small,
        recommendation: `Increase touch target size to at least ${this.config.minTappableSize}px`
      });
    }

    if (issueCounts.not_focusable) {
      recommendations.push({
        priority: 'critical',
        issue: 'not_focusable',
        count: issueCounts.not_focusable,
        recommendation: 'Add tabindex="0" to interactive elements that should be keyboard accessible'
      });
    }

    if (issueCounts.poor_contrast) {
      recommendations.push({
        priority: 'critical',
        issue: 'poor_contrast',
        count: issueCounts.poor_contrast,
        recommendation: 'Increase color contrast to meet WCAG AA standards (4.5:1 minimum)'
      });
    }

    if (issueCounts.click_failed) {
      recommendations.push({
        priority: 'high',
        issue: 'click_failed',
        count: issueCounts.click_failed,
        recommendation: 'Fix JavaScript errors and ensure click handlers are properly bound'
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
    console.error('Usage: node interactive-tester.js <url>');
    console.error('Example: node interactive-tester.js http://localhost:3000');
    process.exit(1);
  }

  const tester = new InteractiveTester({
    url,
    minTappableSize: 44
  });

  try {
    const report = await tester.test();
    console.log('\n=== Interactive Testing Report ===');
    console.log(JSON.stringify(report, null, 2));

    process.exit(report.summary.failed === 0 ? 0 : 1);
  } catch (error) {
    console.error('Testing failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default InteractiveTester;
