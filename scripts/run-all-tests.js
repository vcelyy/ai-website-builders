#!/usr/bin/env node
/**
 * Run All Tests - Orchestrator for Autonomous Website Testing Suite
 * Runs all testers in optimized phases and generates combined report
 */

import { CSSLayoutTester } from './visual/css-layout-tester.js';
import { ImageValidator } from './visual/image-validator.js';
import { InteractiveTester } from './visual/interactive-tester.js';
import { TypographyChecker } from './visual/typography-checker.js';
import { ResponsiveTester } from './visual/responsive-tester.js';
import { CrossBrowserTester } from './visual/cross-browser-tester.js';
import { A11yTester } from './quality/a11y-tester.js';
import { PerformanceTester } from './quality/performance-tester.js';
import { SEOTester } from './quality/seo-tester.js';
import { SecurityTester } from './quality/security-tester.js';
import { ContentQualityTester } from './quality/content-quality-tester.js';
import { Logger, FileHelper } from './lib/shared.js';
import { QUALITY_GATES } from './lib/quality-gates.js';
import fs from 'fs';
import path from 'path';

const logger = new Logger('test-suite.log');

/**
 * Default configuration for test suite
 */
const DEFAULT_CONFIG = {
  url: '',
  referenceUrl: '',
  projectPath: process.cwd(),
  outputDir: './test-results',

  // Quality gates
  qualityGates: {
    lighthouse: 90,
    wcag: 'AA',
    coverage: 80,
    maxCriticalIssues: 0,
    maxHighIssues: 5
  },

  // Test selection
  tests: {
    // Visual tests
    layout: { enabled: true, components: [], referenceUrl: '' },
    images: { enabled: true, maxFileSize: 500000, requireAlt: true },
    interactive: { enabled: true, minTappableSize: 44 },
    typography: { enabled: true, minFontSize: 16, minContrast: 4.5 },
    responsive: { enabled: true, viewports: [375, 768, 1024, 1920] },
    crossBrowser: { enabled: true, browsers: ['chrome', 'firefox'] },

    // Quality tests
    accessibility: { enabled: true, level: 'AA' },
    performance: { enabled: true, lighthouseMin: 90 },
    seo: { enabled: true },
    security: { enabled: true },
    contentQuality: { enabled: true, minQualityScore: 7 }
  },

  // Execution options
  parallel: true,
  failFast: false,
  timeout: 60000
};

/**
 * Test Suite Orchestrator
 */
export class TestSuite {
  constructor(config = {}) {
    this.config = this.mergeConfig(DEFAULT_CONFIG, config);
    this.results = {
      timestamp: new Date().toISOString(),
      url: this.config.url,
      config: this.config,
      tests: [],
      summary: null
    };
  }

  /**
   * Merge user config with defaults
   */
  mergeConfig(defaults, userConfig) {
    return {
      ...defaults,
      ...userConfig,
      qualityGates: { ...defaults.qualityGates, ...userConfig.qualityGates },
      tests: this.deepMerge(defaults.tests, userConfig.tests || {})
    };
  }

  /**
   * Deep merge for nested objects
   */
  deepMerge(target, source) {
    const output = { ...target };

    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        output[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }

    return output;
  }

  /**
   * Run all tests
   */
  async run() {
    logger.info('='.repeat(60));
    logger.info('AUTONOMOUS WEBSITE TESTING SUITE');
    logger.info('='.repeat(60));
    logger.info(`URL: ${this.config.url}`);
    logger.info(`Reference: ${this.config.referenceUrl || 'none'}`);
    logger.info(`Output: ${this.config.outputDir}`);
    logger.info('='.repeat(60));

    const startTime = Date.now();

    try {
      // Ensure output directory exists
      fs.mkdirSync(this.config.outputDir, { recursive: true });

      // Run tests in phases
      await this.runPhase1_FastParallel();
      await this.runPhase2_MediumSpeed();
      await this.runPhase3_SlowSequential();

      // Generate combined report
      const combinedReport = this.generateCombinedReport();

      // Save results
      const resultsPath = path.join(this.config.outputDir, 'test-results.json');
      FileHelper.writeJSON(resultsPath, combinedReport);
      logger.success(`Results saved to: ${resultsPath}`);

      // Print summary
      this.printSummary(combinedReport);

      const duration = Math.round((Date.now() - startTime) / 1000);
      logger.info(`Total test duration: ${duration}s`);

      return combinedReport;

    } catch (error) {
      logger.error(`Test suite failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Phase 1: Fast parallel tests
   */
  async runPhase1_FastParallel() {
    logger.info('');
    logger.info('PHASE 1: Fast Parallel Tests');
    logger.info('-'.repeat(40));

    const tests = [];

    // Visual tests that can run quickly
    if (this.config.tests.images.enabled) {
      tests.push({
        name: 'Image Validator',
        run: () => new ImageValidator({ url: this.config.url }).validate()
      });
    }

    if (this.config.tests.typography.enabled) {
      tests.push({
        name: 'Typography Checker',
        run: () => new TypographyChecker({ url: this.config.url }).check()
      });
    }

    if (this.config.tests.interactive.enabled) {
      tests.push({
        name: 'Interactive Tester',
        run: () => new InteractiveTester({
          url: this.config.url,
          minTappableSize: this.config.tests.interactive.minTappableSize
        }).test()
      });
    }

    if (this.config.tests.contentQuality.enabled) {
      tests.push({
        name: 'Content Quality Tester',
        run: () => new ContentQualityTester({ url: this.config.url }).test()
      });
    }

    await this.executeTests(tests, 'phase1');
  }

  /**
   * Phase 2: Medium speed tests
   */
  async runPhase2_MediumSpeed() {
    logger.info('');
    logger.info('PHASE 2: Medium Speed Tests');
    logger.info('-'.repeat(40));

    const tests = [];

    // Medium speed tests
    if (this.config.tests.accessibility.enabled) {
      tests.push({
        name: 'Accessibility Tester',
        run: () => new A11yTester({
          url: this.config.url,
          wcagLevel: this.config.tests.accessibility.level
        }).test()
      });
    }

    if (this.config.tests.seo.enabled) {
      tests.push({
        name: 'SEO Tester',
        run: () => new SEOTester({ url: this.config.url }).test()
      });
    }

    if (this.config.tests.security.enabled) {
      tests.push({
        name: 'Security Tester',
        run: () => new SecurityTester({
          url: this.config.url,
          projectPath: this.config.projectPath
        }).test()
      });
    }

    await this.executeTests(tests, 'phase2');
  }

  /**
   * Phase 3: Slow sequential tests
   */
  async runPhase3_SlowSequential() {
    logger.info('');
    logger.info('PHASE 3: Slow Sequential Tests');
    logger.info('-'.repeat(40));

    // These tests are slower, run sequentially

    // Layout tester (if components specified)
    if (this.config.tests.layout.enabled && this.config.tests.layout.components.length > 0) {
      logger.info('Running CSS Layout Tester...');
      for (const component of this.config.tests.layout.components) {
        const referenceUrl = this.config.tests.layout.referenceUrl || this.config.referenceUrl;

        const result = await new CSSLayoutTester({
          componentPath: component,
          referenceUrl: referenceUrl
        }).test();

        this.results.tests.push({
          phase: 'phase3',
          name: `Layout Tester - ${path.basename(component)}`,
          result,
          passed: result.success,
          duration: result.duration || 0
        });

        logger.info(`  Layout test for ${component}: ${result.success ? 'PASSED' : 'FAILED'}`);

        // Fail fast if enabled
        if (this.config.failFast && !result.success) {
          logger.warning('Fail-fast enabled: stopping tests');
          break;
        }
      }
    }

    // Responsive tester (multiple viewports)
    if (this.config.tests.responsive.enabled) {
      logger.info('Running Responsive Tester...');

      const result = await new ResponsiveTester({
        url: this.config.url,
        referenceUrl: this.config.referenceUrl,
        viewports: this.config.tests.responsive.viewports.map(v => ({ width: v, height: 1080, name: `${v}px`, type: 'desktop' }))
      }).test();

      this.results.tests.push({
        phase: 'phase3',
        name: 'Responsive Tester',
        result,
        passed: result.summary.failed === 0,
        duration: 0
      });

      logger.info(`  Responsive test: ${result.summary.failed === 0 ? 'PASSED' : `FAILED (${result.summary.failed} viewport(s) failed)}`);
    }

    // Performance tester
    if (this.config.tests.performance.enabled) {
      logger.info('Running Performance Tester...');

      const result = await new PerformanceTester({
        url: this.config.url,
        lighthouseThreshold: this.config.tests.performance.lighthouseMin
      }).test();

      this.results.tests.push({
        phase: 'phase3',
        name: 'Performance Tester',
        result,
        passed: result.summary.passed,
        duration: 0
      });

      logger.info(`  Performance test: ${result.summary.passed ? 'PASSED' : 'FAILED'}`);
    }

    // Cross-browser tester
    if (this.config.tests.crossBrowser.enabled) {
      logger.info('Running Cross-Browser Tester...');

      const result = await new CrossBrowserTester({
        url: this.config.url,
        referenceUrl: this.config.referenceUrl,
        browsers: this.config.tests.crossBrowser.browsers
      }).test();

      this.results.tests.push({
        phase: 'phase3',
        name: 'Cross-Browser Tester',
        result,
        passed: result.summary.failed === 0,
        duration: 0
      });

      logger.info(`  Cross-browser test: ${result.summary.failed === 0 ? 'PASSED' : `FAILED (${result.summary.failed} browser(s) failed)}`);
    }
  }

  /**
   * Execute a list of tests
   */
  async executeTests(tests, phase) {
    if (this.config.parallel && tests.length > 1) {
      // Run in parallel
      const results = await Promise.allSettled(
        tests.map(test => this.executeTest(test, phase))
      );

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          this.results.tests.push(result.value);
        } else {
          logger.error(`${tests[index].name} failed: ${result.reason.message}`);
          this.results.tests.push({
            phase,
            name: tests[index].name,
            error: result.reason.message,
            passed: false
          });
        }
      });

    } else {
      // Run sequentially
      for (const test of tests) {
        const result = await this.executeTest(test, phase);
        this.results.tests.push(result);

        // Fail fast if enabled
        if (this.config.failFast && !result.passed) {
          logger.warning('Fail-fast enabled: stopping tests');
          break;
        }
      }
    }
  }

  /**
   * Execute a single test
   */
  async executeTest(test, phase) {
    logger.info(`Running: ${test.name}...`);

    const startTime = Date.now();

    try {
      const result = await test.run();
      const duration = Date.now() - startTime;

      const passed = result.summary ? result.summary.passed : result.passed;

      logger.info(`  ${test.name}: ${passed ? 'PASSED' : 'FAILED'} (${duration}ms)`);

      return {
        phase,
        name: test.name,
        result,
        passed,
        duration
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`  ${test.name} ERROR: ${error.message}`);

      return {
        phase,
        name: test.name,
        error: error.message,
        passed: false,
        duration
      };
    }
  }

  /**
   * Generate combined report
   */
  generateCombinedReport() {
    const totalTests = this.results.tests.length;
    const passedTests = this.results.tests.filter(t => t.passed).length;
    const failedTests = totalTests - passedTests;

    // Count issues by severity
    const issueCounts = {
      critical: 0,
      serious: 0,
      high: 0,
      moderate: 0,
      minor: 0,
      info: 0
    };

    this.results.tests.forEach(test => {
      if (test.result && test.result.allIssues) {
        test.result.allIssues.forEach(issue => {
          const severity = (issue.severity || 'info').toLowerCase();
          if (issueCounts[severity] !== undefined) {
            issueCounts[severity]++;
          } else if (severity === 'error') {
            issueCounts.serious++;
          }
        });
      }
    });

    // Check against quality gates
    const qualityGateCheck = this.checkQualityGates(issueCounts);

    const summary = {
      totalTests,
      passedTests,
      failedTests,
      passRate: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0,
      issueCounts,
      qualityGatesPassed: qualityGateCheck.passed,
      overallPassed: failedTests === 0 && qualityGateCheck.passed
    };

    this.results.summary = summary;

    // Generate recommendations
    const recommendations = this.generateRecommendations();

    return {
      ...this.results,
      summary,
      recommendations
    };
  }

  /**
   * Check against quality gates
   */
  checkQualityGates(issueCounts) {
    const gates = this.config.qualityGates;
    const failures = [];

    if (issueCounts.critical > gates.maxCriticalIssues) {
      failures.push(`Too many critical issues: ${issueCounts.critical} (max: ${gates.maxCriticalIssues})`);
    }

    if (issueCounts.high > gates.maxHighIssues) {
      failures.push(`Too many high severity issues: ${issueCounts.high} (max: ${gates.maxHighIssues})`);
    }

    return {
      passed: failures.length === 0,
      failures
    };
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Collect all recommendations from all tests
    this.results.tests.forEach(test => {
      if (test.result && test.result.recommendations) {
        recommendations.push(...test.result.recommendations);
      }
    });

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, serious: 2, moderate: 3, medium: 4, low: 4, minor: 5, info: 6 };

    recommendations.sort((a, b) => {
      const pa = priorityOrder[a.priority?.toLowerCase()] || 999;
      const pb = priorityOrder[b.priority?.toLowerCase()] || 999;
      return pa - pb;
    });

    return recommendations;
  }

  /**
   * Print summary to console
   */
  printSummary(report) {
    logger.info('');
    logger.info('='.repeat(60));
    logger.info('TEST SUMMARY');
    logger.info('='.repeat(60));
    logger.info(`Total Tests: ${report.summary.totalTests}`);
    logger.info(`Passed: ${report.summary.passedTests}`);
    logger.info(`Failed: ${report.summary.failedTests}`);
    logger.info(`Pass Rate: ${report.summary.passRate}%`);
    logger.info('');
    logger.info('Issues by Severity:');
    logger.info(`  Critical: ${report.summary.issueCounts.critical}`);
    logger.info(`  Serious:  ${report.summary.issueCounts.serious}`);
    logger.info(`  High:     ${report.summary.issueCounts.high}`);
    logger.info(`  Moderate: ${report.summary.issueCounts.moderate}`);
    logger.info(`  Minor:    ${report.summary.issueCounts.minor}`);
    logger.info(`  Info:     ${report.summary.issueCounts.info}`);
    logger.info('');
    logger.info(`Quality Gates: ${report.summary.qualityGatesPassed ? 'PASSED' : 'FAILED'}`);
    logger.info(`Overall: ${report.summary.overallPassed ? 'PASSED' : 'FAILED'}`);
    logger.info('='.repeat(60));

    // Show top recommendations
    if (report.recommendations.length > 0) {
      logger.info('');
      logger.info('TOP RECOMMENDATIONS:');
      const topRecommendations = report.recommendations.slice(0, 5);
      topRecommendations.forEach((rec, i) => {
        logger.info(`  ${i + 1}. [${rec.priority?.toUpperCase() || 'INFO'}] ${rec.recommendation}`);
      });
      if (report.recommendations.length > 5) {
        logger.info(`  ... and ${report.recommendations.length - 5} more`);
      }
    }
  }
}

/**
 * Load config from file
 */
function loadConfig(configPath) {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  return {};
}

/**
 * CLI entry point
 */
export async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: node run-all-tests.js <url> [config-file]');
    console.error('Example: node run-all-tests.js http://localhost:3000 test-config.json');
    console.error('');
    console.error('Config file format (JSON):');
    console.error(JSON.stringify({
      url: 'http://localhost:3000',
      referenceUrl: '',
      outputDir: './test-results',
      tests: {
        layout: { enabled: true, components: [] },
        images: { enabled: true },
        interactive: { enabled: true },
        typography: { enabled: true },
        responsive: { enabled: true },
        crossBrowser: { enabled: true },
        accessibility: { enabled: true },
        performance: { enabled: true },
        seo: { enabled: true },
        security: { enabled: true },
        contentQuality: { enabled: true }
      }
    }, null, 2));
    process.exit(1);
  }

  const url = args[0];
  const configPath = args[1];

  // Load config
  let config = { url };
  if (configPath) {
    const fileConfig = loadConfig(configPath);
    config = { ...fileConfig, url };
  }

  const suite = new TestSuite(config);

  try {
    const report = await suite.run();

    // Exit with error code if overall failed
    process.exit(report.summary.overallPassed ? 0 : 1);

  } catch (error) {
    logger.error(`Test suite failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default TestSuite;
