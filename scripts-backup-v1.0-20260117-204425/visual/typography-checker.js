#!/usr/bin/env node
/**
 * Typography Checker - Font and Readability Validation
 * Validates fonts, sizes, line heights, contrast, and heading hierarchy
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Logger, ProgressTracker } from '../lib/shared.js';
import { TYPOGRAPHY_STANDARDS, WCAG_LEVELS } from '../lib/quality-gates.js';

puppeteer.use(StealthPlugin());

export class TypographyChecker {
  constructor(config = {}) {
    this.config = {
      url: config.url,
      referenceUrl: config.referenceUrl,
      minFontSize: config.minFontSize || TYPOGRAPHY_STANDARDS.minFontSize,
      minLineHeight: config.minLineHeight || TYPOGRAPHY_STANDARDS.minLineHeight,
      maxLineHeight: config.maxLineHeight || TYPOGRAPHY_STANDARDS.maxLineHeight,
      minContrast: config.minContrast || TYPOGRAPHY_STANDARDS.minContrast,
      maxFontSizeH1: config.maxFontSizeH1 || TYPOGRAPHY_STANDARDS.maxFontSizeH1,
      checkHierarchy: config.checkHierarchy !== undefined ? config.checkHierarchy : true,
      checkFallbacks: config.checkFallbacks !== undefined ? config.checkFallbacks : true,
      timeout: config.timeout || 30000
    };

    this.logger = new Logger('typography-check.log');
    this.results = {
      timestamp: new Date().toISOString(),
      url: this.config.url,
      referenceUrl: this.config.referenceUrl,
      totalElements: 0,
      passedElements: 0,
      failedElements: 0,
      elements: [],
      hierarchy: null,
      fallbacks: null
    };
  }

  /**
   * Main validation flow
   */
  async check() {
    this.logger.info(`Starting Typography Checker for: ${this.config.url}`);
    this.logger.info(`Min font size: ${this.config.minFontSize}px`);
    this.logger.info(`Line height range: ${this.config.minLineHeight}-${this.config.maxLineHeight}`);
    this.logger.info(`Min contrast: ${this.config.minContrast}:1`);

    try {
      // Launch browser
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();

      // Set viewport and user agent
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      // Navigate to page
      this.logger.info(`Loading page: ${this.config.url}`);
      await page.goto(this.config.url, {
        waitUntil: 'networkidle0',
        timeout: this.config.timeout
      });

      // Extract all text elements
      this.logger.info('Extracting text elements from page...');
      const elements = await page.evaluate(() => {
        // Define selectors for text elements
        const selectors = [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'li', 'a', 'button',
          'span:not([aria-hidden])', 'label', 'td', 'th'
        ];

        const textElements = [];

        selectors.forEach(selector => {
          const nodes = document.querySelectorAll(selector);
          nodes.forEach(node => {
            // Skip if text is too short (less than 3 chars) or whitespace only
            const text = node.textContent?.trim();
            if (!text || text.length < 3) return;

            // Skip if hidden
            const style = window.getComputedStyle(node);
            if (style.display === 'none' ||
                style.visibility === 'hidden' ||
                style.opacity === '0') {
              return;
            }

            const computedStyle = window.getComputedStyle(node);

            textElements.push({
              tag: node.tagName.toLowerCase(),
              text: text.substring(0, 100), // First 100 chars
              fontFamily: computedStyle.fontFamily,
              fontSize: parseFloat(computedStyle.fontSize),
              fontWeight: parseInt(computedStyle.fontWeight),
              lineHeight: parseFloat(computedStyle.lineHeight),
              letterSpacing: parseFloat(computedStyle.letterSpacing),
              color: computedStyle.color,
              backgroundColor: computedStyle.backgroundColor,
              textAlign: computedStyle.textAlign,
              className: node.className || '',
              id: node.id || ''
            });
          });
        });

        return textElements;
      });

      this.logger.info(`Found ${elements.length} text elements`);

      // Remove duplicates (same tag, same text start, same class)
      const uniqueElements = this.deduplicateElements(elements);
      this.logger.info(`After deduplication: ${uniqueElements.length} unique elements`);

      // Validate each element
      const progress = new ProgressTracker(uniqueElements.length, this.logger);

      for (const element of uniqueElements) {
        progress.advance(`Checking: ${element.tag} - "${element.text.substring(0, 30)}..."`);

        const validationResult = await this.validateElement(page, element);
        this.results.elements.push(validationResult);

        if (validationResult.passed) {
          this.results.passedElements++;
        } else {
          this.results.failedElements++;
        }
      }

      this.results.totalElements = uniqueElements.length;
      progress.complete();

      // Check heading hierarchy if enabled
      if (this.config.checkHierarchy) {
        this.logger.info('Checking heading hierarchy...');
        this.results.hierarchy = await this.checkHeadingHierarchy(elements);
      }

      // Check font fallbacks if enabled
      if (this.config.checkFallbacks) {
        this.logger.info('Checking font fallbacks...');
        this.results.fallbacks = await this.checkFontFallbacks(elements);
      }

      // Compare with reference if provided
      if (this.config.referenceUrl) {
        this.logger.info('Comparing with reference...');
        const referenceResults = await this.checkReference(browser);
        this.results.referenceComparison = referenceResults;
      }

      await browser.close();

      // Generate report
      return this.generateReport();

    } catch (error) {
      this.logger.error(`Typography check failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Remove duplicate elements (same tag, text, class)
   */
  deduplicateElements(elements) {
    const seen = new Set();
    const unique = [];

    for (const element of elements) {
      // Create a unique key based on tag, text start, and class
      const key = `${element.tag}:${element.text.substring(0, 20)}:${element.className}`;

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(element);
      }
    }

    return unique;
  }

  /**
   * Validate a single text element
   */
  async validateElement(page, element) {
    const result = {
      tag: element.tag,
      text: element.text,
      passed: true,
      issues: [],
      metadata: {
        fontFamily: element.fontFamily,
        fontSize: element.fontSize,
        fontWeight: element.fontWeight,
        lineHeight: element.lineHeight,
        letterSpacing: element.letterSpacing,
        color: element.color,
        backgroundColor: element.backgroundColor
      }
    };

    try {
      // Test 1: Font size readable
      const fontSizeTest = this.testFontSize(element);
      result.metadata.fontSizeTest = fontSizeTest;

      if (!fontSizeTest.passed) {
        result.passed = false;
        result.issues.push({
          type: 'font_too_small',
          severity: fontSizeTest.severity,
          message: fontSizeTest.message
        });
      }

      // Test 2: Line height appropriate
      const lineHeightTest = this.testLineHeight(element);
      result.metadata.lineHeightTest = lineHeightTest;

      if (!lineHeightTest.passed) {
        result.passed = false;
        result.issues.push({
          type: 'poor_line_height',
          severity: 'warning',
          message: lineHeightTest.message
        });
      }

      // Test 3: Letter spacing comfortable
      const letterSpacingTest = this.testLetterSpacing(element);
      result.metadata.letterSpacingTest = letterSpacingTest;

      if (!letterSpacingTest.passed) {
        result.passed = false;
        result.issues.push({
          type: 'poor_letter_spacing',
          severity: 'info',
          message: letterSpacingTest.message
        });
      }

      // Test 4: Contrast ratio
      const contrastTest = this.testContrast(element);
      result.metadata.contrastTest = contrastTest;

      if (!contrastTest.passed) {
        result.passed = false;
        result.issues.push({
          type: 'poor_contrast',
          severity: contrastTest.severity,
          message: contrastTest.message
        });
      }

      // Test 5: Font family loaded
      const fontFamilyTest = this.testFontFamily(element);
      result.metadata.fontFamilyTest = fontFamilyTest;

      if (!fontFamilyTest.passed) {
        result.passed = false;
        result.issues.push({
          type: 'font_not_loaded',
          severity: 'warning',
          message: fontFamilyTest.message
        });
      }

      // Test 6: H1 size not too large
      if (element.tag === 'h1') {
        const h1SizeTest = this.testH1Size(element);
        result.metadata.h1SizeTest = h1SizeTest;

        if (!h1SizeTest.passed) {
          result.passed = false;
          result.issues.push({
            type: 'h1_too_large',
            severity: 'warning',
            message: h1SizeTest.message
          });
        }
      }

    } catch (error) {
      result.passed = false;
      result.issues.push({
        type: 'validation_error',
        severity: 'error',
        message: `Validation error: ${error.message}`
      });
    }

    return result;
  }

  /**
   * Test font size
   */
  testFontSize(element) {
    const { fontSize, tag } = element;

    // Headings are allowed to be smaller
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
      return {
        passed: true,
        message: `Heading size acceptable: ${fontSize}px`,
        fontSize
      };
    }

    if (fontSize < this.config.minFontSize) {
      return {
        passed: false,
        severity: 'warning',
        message: `Font too small: ${fontSize}px (min: ${this.config.minFontSize}px)`,
        fontSize
      };
    }

    return {
      passed: true,
      message: `Font size acceptable: ${fontSize}px`,
      fontSize
    };
  }

  /**
   * Test line height
   */
  testLineHeight(element) {
    const { lineHeight, fontSize } = element;

    // Calculate line height as ratio of font size
    const ratio = lineHeight / fontSize;

    if (ratio < this.config.minLineHeight) {
      return {
        passed: false,
        message: `Line height too tight: ${ratio.toFixed(2)} (min: ${this.config.minLineHeight})`,
        ratio
      };
    }

    if (ratio > this.config.maxLineHeight) {
      return {
        passed: false,
        message: `Line height too loose: ${ratio.toFixed(2)} (max: ${this.config.maxLineHeight})`,
        ratio
      };
    }

    return {
      passed: true,
      message: `Line height acceptable: ${ratio.toFixed(2)}`,
      ratio
    };
  }

  /**
   * Test letter spacing
   */
  testLetterSpacing(element) {
    const { letterSpacing, fontSize } = element;

    // Letter spacing should be between -0.5px and 2px for readability
    // Or as a ratio: between -0.03em and 0.1em
    const minSpacing = -0.5;
    const maxSpacing = Math.max(2, fontSize * 0.1);

    if (letterSpacing < minSpacing) {
      return {
        passed: false,
        message: `Letter spacing too tight: ${letterSpacing}px (min: ${minSpacing}px)`,
        letterSpacing
      };
    }

    if (letterSpacing > maxSpacing) {
      return {
        passed: false,
        message: `Letter spacing too wide: ${letterSpacing}px (max: ${maxSpacing}px)`,
        letterSpacing
      };
    }

    return {
      passed: true,
      message: `Letter spacing acceptable: ${letterSpacing}px`,
      letterSpacing
    };
  }

  /**
   * Test contrast ratio
   */
  testContrast(element) {
    const { color, backgroundColor } = element;

    // Parse colors
    const foreground = this.parseColor(color);
    const background = this.parseColor(backgroundColor);

    if (!foreground || !background) {
      return {
        passed: true,
        severity: 'info',
        message: 'Could not calculate contrast (transparent or complex color)',
        contrastRatio: null
      };
    }

    // Calculate contrast ratio using WCAG formula
    const contrastRatio = this.calculateContrastRatio(foreground, background);

    if (contrastRatio < this.config.minContrast) {
      return {
        passed: false,
        severity: 'critical',
        message: `Contrast too low: ${contrastRatio.toFixed(2)}:1 (min: ${this.config.minContrast}:1)`,
        contrastRatio
      };
    }

    return {
      passed: true,
      message: `Contrast acceptable: ${contrastRatio.toFixed(2)}:1`,
      contrastRatio
    };
  }

  /**
   * Test font family loaded
   */
  testFontFamily(element) {
    const { fontFamily } = element;

    // Check if font family is set to something specific
    if (!fontFamily || fontFamily === 'initial' || fontFamily === 'inherit') {
      return {
        passed: false,
        message: 'No font family specified',
        fontFamily
      };
    }

    // Check for fallbacks (good practice)
    const hasFallback = fontFamily.includes(',');

    return {
      passed: true,
      message: hasFallback
        ? `Font family with fallbacks: ${fontFamily.split(',')[0].trim()}...`
        : `Font family: ${fontFamily}`,
      fontFamily,
      hasFallback
    };
  }

  /**
   * Test H1 size not too large
   */
  testH1Size(element) {
    const { fontSize } = element;

    if (fontSize > this.config.maxFontSizeH1) {
      return {
        passed: false,
        message: `H1 too large: ${fontSize}px (max: ${this.config.maxFontSizeH1}px)`,
        fontSize
      };
    }

    return {
      passed: true,
      message: `H1 size acceptable: ${fontSize}px`,
      fontSize
    };
  }

  /**
   * Parse CSS color to RGB
   */
  parseColor(colorString) {
    // Handle rgb/rgba
    const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3])
      };
    }

    // Handle hex
    const hexMatch = colorString.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
    if (hexMatch) {
      return {
        r: parseInt(hexMatch[1], 16),
        g: parseInt(hexMatch[2], 16),
        b: parseInt(hexMatch[3], 16)
      };
    }

    return null;
  }

  /**
   * Calculate WCAG contrast ratio
   */
  calculateContrastRatio(color1, color2) {
    const getLuminance = (r, g, b) => {
      const [rs, gs, bs] = [r, g, b].map(v => {
        v = v / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(color1.r, color1.g, color1.b);
    const l2 = getLuminance(color2.r, color2.g, color2.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Check heading hierarchy
   */
  async checkHeadingHierarchy(elements) {
    // Filter only headings
    const headings = elements
      .filter(el => el.tag.startsWith('h'))
      .sort((a, b) => {
        // Sort by document order (we can't track actual order without positions)
        // For now, sort by heading level
        const levelA = parseInt(el.tag.charAt(1));
        const levelB = parseInt(b.tag.charAt(1));
        return levelA - levelB;
      });

    const issues = [];
    let previousLevel = 0;

    for (const heading of headings) {
      const level = parseInt(heading.tag.charAt(1));

      // Check for skipped levels (e.g., h1 -> h3)
      if (previousLevel > 0 && level > previousLevel + 1) {
        issues.push({
          type: 'skipped_heading_level',
          severity: 'warning',
          message: `Skipped heading level: h${previousLevel} -> h${level}`,
          heading: heading.text.substring(0, 50)
        });
      }

      // Check for multiple H1s
      if (level === 1) {
        const h1Count = headings.filter(h => h.tag === 'h1').length;
        if (h1Count > 1) {
          issues.push({
            type: 'multiple_h1',
            severity: 'warning',
            message: `Multiple H1 tags found (${h1Count}). Should have only one.`
          });
          break; // Only report once
        }
      }

      previousLevel = level;
    }

    return {
      totalHeadings: headings.length,
      h1Count: headings.filter(h => h.tag === 'h1').length,
      issues
    };
  }

  /**
   * Check font fallbacks
   */
  async checkFontFallbacks(elements) {
    const webSafeFonts = [
      'Arial', 'Helvetica', 'Times New Roman', 'Times', 'Courier New', 'Courier',
      'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
      'Trebuchet MS', 'Arial Black', 'Impact', 'sans-serif', 'serif', 'monospace'
    ];

    const uniqueFontFamilies = new Set();

    elements.forEach(el => {
      if (el.fontFamily) {
        // Extract primary font (before first comma)
        const primaryFont = el.fontFamily.split(',')[0].trim().replace(/['"]/g, '');
        uniqueFontFamilies.add(primaryFont);
      }
    });

    const fonts = Array.from(uniqueFontFamilies);
    const issues = [];

    fonts.forEach(font => {
      // Check if it's a web-safe font
      const isWebSafe = webSafeFonts.some(safe =>
        font.toLowerCase().includes(safe.toLowerCase())
      );

      // Check if it has a fallback in the original elements
      const elementWithFallback = elements.find(el =>
        el.fontFamily && el.fontFamily.includes(',') &&
        el.fontFamily.split(',')[0].toLowerCase().includes(font.toLowerCase())
      );

      if (!isWebSafe && !elementWithFallback) {
        issues.push({
          type: 'no_fallback',
          severity: 'warning',
          message: `Font "${font}" may not have proper fallback`,
          font
        });
      }
    });

    return {
      uniqueFonts: fonts,
      totalUnique: fonts.length,
      issues
    };
  }

  /**
   * Compare with reference site
   */
  async checkReference(browser) {
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      await page.goto(this.config.referenceUrl, {
        waitUntil: 'networkidle0',
        timeout: this.config.timeout
      });

      // Extract reference typography
      const referenceElements = await page.evaluate(() => {
        const elements = [];

        ['h1', 'h2', 'h3', 'p'].forEach(selector => {
          const node = document.querySelector(selector);
          if (node) {
            const style = window.getComputedStyle(node);
            elements.push({
              tag: selector,
              fontSize: parseFloat(style.fontSize),
              fontFamily: style.fontFamily,
              fontWeight: parseInt(style.fontWeight),
              lineHeight: parseFloat(style.lineHeight)
            });
          }
        });

        return elements;
      });

      await page.close();

      return {
        url: this.config.referenceUrl,
        elements: referenceElements,
        comparison: 'Comparison data collected (detailed analysis requires MCP)'
      };

    } catch (error) {
      return {
        url: this.config.referenceUrl,
        error: `Could not load reference: ${error.message}`
      };
    }
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

    this.logger.info(`Typography check complete: ${report.summary.passed}/${report.summary.total} passed (${report.summary.passRate}% pass rate)`);

    return report;
  }

  /**
   * Generate recommendations based on issues found
   */
  generateRecommendations() {
    const recommendations = [];

    // Count issue types
    const issueCounts = {};
    this.results.elements.forEach(el => {
      el.issues.forEach(issue => {
        issueCounts[issue.type] = (issueCounts[issue.type] || 0) + 1;
      });
    });

    // Generate recommendations
    if (issueCounts.font_too_small) {
      recommendations.push({
        priority: 'critical',
        issue: 'font_too_small',
        count: issueCounts.font_too_small,
        recommendation: `Increase font sizes to at least ${this.config.minFontSize}px for body text`
      });
    }

    if (issueCounts.poor_contrast) {
      recommendations.push({
        priority: 'critical',
        issue: 'poor_contrast',
        count: issueCounts.poor_contrast,
        recommendation: `Increase color contrast to meet WCAG AA (${this.config.minContrast}:1 minimum)`
      });
    }

    if (issueCounts.poor_line_height) {
      recommendations.push({
        priority: 'medium',
        issue: 'poor_line_height',
        count: issueCounts.poor_line_height,
        recommendation: `Set line height between ${this.config.minLineHeight}-${this.config.maxLineHeight} for better readability`
      });
    }

    if (this.results.hierarchy?.issues.length > 0) {
      const skippedLevels = this.results.hierarchy.issues.filter(i => i.type === 'skipped_heading_level').length;
      if (skippedLevels > 0) {
        recommendations.push({
          priority: 'medium',
          issue: 'heading_hierarchy',
          count: skippedLevels,
          recommendation: 'Fix heading hierarchy to avoid skipping levels (e.g., h1 → h2 → h3)'
        });
      }

      if (this.results.hierarchy.h1Count > 1) {
        recommendations.push({
          priority: 'low',
          issue: 'multiple_h1',
          recommendation: 'Use only one H1 tag per page for better SEO and accessibility'
        });
      }
    }

    if (this.results.fallbacks?.issues.length > 0) {
      recommendations.push({
        priority: 'low',
        issue: 'font_fallbacks',
        count: this.results.fallbacks.issues.length,
        recommendation: 'Add web-safe font fallbacks for better cross-platform compatibility'
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
    console.error('Usage: node typography-checker.js <url> [reference-url]');
    console.error('Example: node typography-checker.js http://localhost:3000 https://competitor.com');
    process.exit(1);
  }

  const checker = new TypographyChecker({
    url,
    referenceUrl,
    minFontSize: 16,
    minLineHeight: 1.4,
    maxLineHeight: 1.6,
    minContrast: 4.5
  });

  try {
    const report = await checker.check();
    console.log('\n=== Typography Validation Report ===');
    console.log(JSON.stringify(report, null, 2));

    // Exit with error code if any elements failed
    process.exit(report.summary.failed === 0 ? 0 : 1);
  } catch (error) {
    console.error('Typography check failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default TypographyChecker;
