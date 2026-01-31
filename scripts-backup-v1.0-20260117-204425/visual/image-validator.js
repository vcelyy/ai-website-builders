#!/usr/bin/env node
/**
 * Image Validator - Comprehensive Image Testing
 * Validates all images for loading, accessibility, format, and size
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Logger, ProgressTracker } from '../lib/shared.js';
import { IMAGE_STANDARDS } from '../lib/quality-gates.js';
import https from 'https';
import http from 'http';
import { URL } from 'url';

puppeteer.use(StealthPlugin());

export class ImageValidator {
  constructor(config = {}) {
    this.config = {
      url: config.url,
      maxFileSize: config.maxFileSize || IMAGE_STANDARDS.maxFileSize,
      requireAlt: config.requireAlt !== undefined ? config.requireAlt : true,
      formats: config.formats || IMAGE_STANDARDS.formats,
      timeout: config.timeout || 30000
    };

    this.logger = new Logger('image-validator.log');
    this.results = {
      timestamp: new Date().toISOString(),
      url: this.config.url,
      totalImages: 0,
      passedImages: 0,
      failedImages: 0,
      images: []
    };
  }

  /**
   * Main validation flow
   */
  async validate() {
    this.logger.info(`Starting Image Validator for: ${this.config.url}`);
    this.logger.info(`Max file size: ${this.config.maxFileSize} bytes`);
    this.logger.info(`Required formats: ${this.config.formats.join(', ')}`);

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

      // Extract all images
      this.logger.info('Extracting images from page...');
      const images = await page.evaluate(() => {
        const imgElements = document.querySelectorAll('img');
        return Array.from(imgElements).map(img => ({
          src: img.src,
          alt: img.alt || '',
          width: img.width,
          height: img.height,
          loading: img.loading || 'eager',
          srcset: img.srcset || '',
          sizes: img.sizes || '',
          className: img.className || '',
          id: img.id || ''
        }));
      });

      this.logger.info(`Found ${images.length} images`);

      // Validate each image
      const progress = new ProgressTracker(images.length, this.logger);

      for (const image of images) {
        progress.advance(`Validating: ${image.src.substring(0, 50)}...`);

        const validationResult = await this.validateImage(image);
        this.results.images.push(validationResult);

        if (validationResult.passed) {
          this.results.passedImages++;
        } else {
          this.results.failedImages++;
        }
      }

      this.results.totalImages = images.length;
      progress.complete();

      await browser.close();

      // Generate report
      return this.generateReport();

    } catch (error) {
      this.logger.error(`Validation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate a single image
   */
  async validateImage(image) {
    const result = {
      src: image.src,
      alt: image.alt,
      width: image.width,
      height: image.height,
      passed: true,
      issues: [],
      metadata: {}
    };

    // Skip empty or data URLs
    if (!image.src || image.src.startsWith('data:')) {
      result.metadata.note = 'Skipped (data URL or empty)';
      return result;
    }

    try {
      // Test 1: Does image load?
      const loadResult = await this.testImageLoad(image.src);
      result.metadata.loadTest = loadResult;

      if (!loadResult.success) {
        result.passed = false;
        result.issues.push({
          type: 'load_failed',
          severity: 'critical',
          message: `Image failed to load: ${loadResult.error}`
        });
        return result; // Exit early if can't load
      }

      // Test 2: Has alt text?
      if (this.config.requireAlt) {
        const altTest = this.testAltText(image.alt);
        result.metadata.altTest = altTest;

        if (!altTest.passed) {
          result.passed = false;
          result.issues.push({
            type: 'missing_alt',
            severity: 'critical',
            message: altTest.message
          });
        }
      }

      // Test 3: Valid format?
      const formatTest = this.testFormat(image.src);
      result.metadata.formatTest = formatTest;

      if (!formatTest.passed) {
        result.passed = false;
        result.issues.push({
          type: 'invalid_format',
          severity: 'warning',
          message: formatTest.message
        });
      }

      // Test 4: File size acceptable?
      const sizeTest = await this.testFileSize(image.src, loadResult.contentLength);
      result.metadata.sizeTest = sizeTest;

      if (!sizeTest.passed) {
        result.passed = false;
        result.issues.push({
          type: 'file_too_large',
          severity: 'warning',
          message: sizeTest.message
        });
      }

      // Test 5: Dimensions reasonable?
      const dimensionTest = this.testDimensions(image.width, image.height);
      result.metadata.dimensionTest = dimensionTest;

      if (!dimensionTest.passed) {
        result.passed = false;
        result.issues.push({
          type: 'poor_dimensions',
          severity: 'info',
          message: dimensionTest.message
        });
      }

      // Test 6: Accessibility (if we can analyze it)
      // This would require MCP tool for actual visual analysis
      // For now, log that it would be done
      this.logger.info('  Accessibility check would use MCP vision tool');

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
   * Test if image loads successfully
   */
  async testImageLoad(src) {
    return new Promise((resolve) => {
      const protocol = src.startsWith('https') ? https : http;

      const req = protocol.request(src, (res) => {
        // Check status code
        if (res.statusCode === 200) {
          const contentLength = parseInt(res.headers['content-length'], 10);
          resolve({
            success: true,
            statusCode: res.statusCode,
            contentType: res.headers['content-type'],
            contentLength: contentLength
          });
        } else {
          resolve({
            success: false,
            statusCode: res.statusCode,
            error: `HTTP ${res.statusCode}`
          });
        }
      });

      req.on('error', (error) => {
        resolve({
          success: false,
          error: error.message
        });
      });

      req.setTimeout(10000, () => {
        req.abort();
        resolve({
          success: false,
          error: 'Request timeout (10s)'
        });
      });

      req.end();
    });
  }

  /**
   * Test alt text presence
   */
  testAltText(alt) {
    if (!alt || alt.trim() === '') {
      return {
        passed: false,
        message: 'Missing alt text',
        hasAlt: false
      };
    }

    // Check for generic/descriptive alt text
    const genericPatterns = [
      /^(image|img|picture|photo|pic)$/i,
      /^\d+$/,
      /^(.)\1*$/  // Single repeated character
    ];

    for (const pattern of genericPatterns) {
      if (pattern.test(alt)) {
        return {
          passed: false,
          message: `Generic alt text: "${alt}"`,
          hasAlt: true,
          isGeneric: true
        };
      }
    }

    return {
      passed: true,
      message: `Alt text present: "${alt.substring(0, 50)}${alt.length > 50 ? '...' : ''}"`,
      hasAlt: true,
      isGeneric: false
    };
  }

  /**
   * Test image format
   */
  testFormat(src) {
    const extension = src.split('.').pop().toLowerCase().split('?')[0];

    if (!this.config.formats.includes(extension)) {
      return {
        passed: false,
        message: `Invalid format: "${extension}". Allowed: ${this.config.formats.join(', ')}`,
        format: extension
      };
    }

    return {
      passed: true,
      message: `Valid format: ${extension}`,
      format: extension
    };
  }

  /**
   * Test file size
   */
  async testFileSize(src, contentLength) {
    if (!contentLength) {
      return {
        passed: true,
        message: 'Could not determine file size (might be chunked)',
        size: null
      };
    }

    if (contentLength > this.config.maxFileSize) {
      const sizeKB = Math.round(contentLength / 1024);
      const maxKB = Math.round(this.config.maxFileSize / 1024);
      return {
        passed: false,
        message: `File too large: ${sizeKB}KB (max: ${maxKB}KB)`,
        size: contentLength
      };
    }

    const sizeKB = Math.round(contentLength / 1024);
    return {
      passed: true,
      message: `File size acceptable: ${sizeKB}KB`,
      size: contentLength
    };
  }

  /**
   * Test image dimensions
   */
  testDimensions(width, height) {
    // Check if dimensions are too small (quality issue)
    const minDimension = 72; // From IMAGE_STANDARDS

    if (width && width < minDimension) {
      return {
        passed: false,
        message: `Width too small: ${width}px (min: ${minDimension}px)`,
        width,
        height
      };
    }

    if (height && height < minDimension) {
      return {
        passed: false,
        message: `Height too small: ${height}px (min: ${minDimension}px)`,
        width,
        height
      };
    }

    return {
      passed: true,
      message: `Dimensions acceptable: ${width}x${height}`,
      width,
      height
    };
  }

  /**
   * Generate validation report
   */
  generateReport() {
    const report = {
      ...this.results,
      summary: {
        total: this.results.totalImages,
        passed: this.results.passedImages,
        failed: this.results.failedImages,
        passRate: this.results.totalImages > 0
          ? Math.round((this.results.passedImages / this.results.totalImages) * 100)
          : 0
      },
      recommendations: this.generateRecommendations()
    };

    this.logger.info(`Validation complete: ${report.summary.passed}/${report.summary.total} passed (${report.summary.passRate}% pass rate)`);

    return report;
  }

  /**
   * Generate recommendations based on issues found
   */
  generateRecommendations() {
    const recommendations = [];

    // Count issue types
    const issueCounts = {};
    this.results.images.forEach(img => {
      img.issues.forEach(issue => {
        issueCounts[issue.type] = (issueCounts[issue.type] || 0) + 1;
      });
    });

    // Generate recommendations
    if (issueCounts.missing_alt) {
      recommendations.push({
        priority: 'critical',
        issue: 'missing_alt',
        count: issueCounts.missing_alt,
        recommendation: 'Add descriptive alt text to all images for accessibility'
      });
    }

    if (issueCounts.load_failed) {
      recommendations.push({
        priority: 'critical',
        issue: 'load_failed',
        count: issueCounts.load_failed,
        recommendation: 'Fix broken image URLs or remove orphaned image references'
      });
    }

    if (issueCounts.file_too_large) {
      recommendations.push({
        priority: 'medium',
        issue: 'file_too_large',
        count: issueCounts.file_too_large,
        recommendation: `Compress images or convert to WebP (max: ${Math.round(this.config.maxFileSize / 1024)}KB)`
      });
    }

    if (issueCounts.invalid_format) {
      recommendations.push({
        priority: 'low',
        issue: 'invalid_format',
        count: issueCounts.invalid_format,
        recommendation: `Convert images to: ${this.config.formats.join(', ')}`
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
    console.error('Usage: node image-validator.js <url>');
    console.error('Example: node image-validator.js http://localhost:3000');
    process.exit(1);
  }

  const validator = new ImageValidator({
    url,
    maxFileSize: 500000,
    requireAlt: true,
    formats: ['webp', 'jpg', 'jpeg', 'png', 'svg', 'gif']
  });

  try {
    const report = await validator.validate();
    console.log('\n=== Image Validation Report ===');
    console.log(JSON.stringify(report, null, 2));

    // Exit with error code if any images failed
    process.exit(report.summary.failed === 0 ? 0 : 1);
  } catch (error) {
    console.error('Validation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default ImageValidator;
