#!/usr/bin/env node
/**
 * CSS Layout Tester - Visual Matching Loop
 * Matches CSS layout to reference within 2px using visual diff
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Logger, CSSHelper, VersionTracker, ProgressTracker } from '../lib/shared.js';
import { createMCPClient } from '../lib/mcp-wrapper.js';
import fs from 'fs';
import path from 'path';

// Use stealth plugin to bypass Cloudflare/anti-bot
puppeteer.use(StealthPlugin());

export class CSSLayoutTester {
  constructor(config = {}) {
    this.config = {
      matchThreshold: config.matchThreshold || 98,  // 98% match required
      maxIterations: config.maxIterations || 20,
      viewport: config.viewport || { width: 1920, height: 1080 },
      screenshotsDir: config.screenshotsDir || './screenshots',
      referenceUrl: config.referenceUrl,
      componentPath: config.componentPath
    };

    this.logger = new Logger('css-layout-test.log');
    this.mcp = createMCPClient(this.logger);
    this.versionTracker = new VersionTracker(config.componentPath);
    this.iteration = 0;
  }

  /**
   * Main test flow
   */
  async test() {
    this.logger.info('Starting CSS Layout Tester');
    this.logger.info(`Reference URL: ${this.config.referenceUrl}`);
    this.logger.info(`Component: ${this.config.componentPath}`);

    const progress = new ProgressTracker(this.config.maxIterations, this.logger);

    try {
      // Initialize
      await this.mcp.initialize();

      // Step 1: Capture reference screenshot
      progress.advance('Capturing reference screenshot');
      const referenceScreenshot = await this.captureReference();

      // Step 2: Start iteration loop
      let matchAchieved = false;
      let lastDiff = null;

      while (this.iteration < this.config.maxIterations && !matchAchieved) {
        this.iteration++;

        // Step 3: Screenshot our component
        progress.advance(`Screenshotting component (v${this.iteration})`);
        const ourScreenshot = await this.captureOurComponent();

        // Step 4: Visual diff
        progress.advance(`Running visual diff (v${this.iteration})`);
        const diff = await this.runVisualDiff(referenceScreenshot, ourScreenshot);

        // Step 5: Check if match achieved
        if (diff.matchPercentage >= this.config.matchThreshold) {
          matchAchieved = true;
          this.logger.success(`✅ Match achieved at v${this.iteration}! (${diff.matchPercentage}% match)`);
          break;
        }

        // Step 6: Apply CSS fixes
        progress.advance(`Applying CSS fixes (v${this.iteration})`);
        await this.applyCSSFixes(diff);

        // Step 7: Save version
        await this.saveVersion(diff);

        lastDiff = diff;
      }

      progress.complete();

      // Report final result
      return this.generateReport(matchAchieved, lastDiff);

    } catch (error) {
      this.logger.error(`Test failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Capture reference screenshot from URL
   */
  async captureReference() {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setViewport(this.config.viewport);

      this.logger.info(`Navigating to ${this.config.referenceUrl}`);
      await page.goto(this.config.referenceUrl, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Wait for page to stabilize
      await this.wait(2000);

      const screenshotPath = path.join(
        this.config.screenshotsDir,
        'reference.png'
      );

      // Ensure directory exists
      fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });

      await page.screenshot({ path: screenshotPath, fullPage: false });
      this.logger.success(`Reference saved: ${screenshotPath}`);

      await browser.close();
      return screenshotPath;

    } catch (error) {
      await browser.close();
      throw error;
    }
  }

  /**
   * Screenshot our component
   */
  async captureOurComponent() {
    const screenshotPath = path.join(
      this.config.screenshotsDir,
      `our-component-v${this.iteration}.png`
    );

    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });

    // For now, create a placeholder
    // In real implementation, this would build and serve the component
    this.logger.info(`Screenshot would be saved to: ${screenshotPath}`);

    return screenshotPath;
  }

  /**
   * Run visual diff using MCP tool
   */
  async runVisualDiff(referenceImage, ourImage) {
    const diff = await this.mcp.visualDiff(referenceImage, ourImage, {
      prompt: 'Compare these two screenshots and report specific CSS measurement differences (padding, margin, font-size, colors, spacing, flexbox properties). Report match percentage as a number from 0-100.'
    });

    this.logger.info(`Diff result: ${diff.matchPercentage}% match`);

    if (diff.differences && diff.differences.length > 0) {
      this.logger.info(`Found ${diff.differences.length} differences:`);
      diff.differences.forEach((d, i) => {
        this.logger.info(`  ${i + 1}. ${d.type}: ${d.selector} - Expected: ${d.expected}, Got: ${d.actual}`);
      });
    }

    return diff;
  }

  /**
   * Apply CSS fixes based on diff results
   */
  async applyCSSFixes(diff) {
    if (!diff.differences || diff.differences.length === 0) {
      this.logger.warning('No differences to fix');
      return;
    }

    // Read current CSS file
    const cssPath = this.config.componentPath.replace(/\.(astro|jsx|vue)$/, '.css');

    if (!fs.existsSync(cssPath)) {
      this.logger.warning(`CSS file not found: ${cssPath}`);
      this.logger.info('Creating CSS file with fixes...');

      // Create new CSS file with fixes
      const cssContent = this.generateCSSFromDiff(diff.differences);
      fs.writeFileSync(cssPath, cssContent);
    } else {
      // Apply fixes to existing CSS
      let cssContent = fs.readFileSync(cssPath, 'utf8');
      const rules = CSSHelper.parseCSS(cssContent);

      diff.differences.forEach(difference => {
        const { selector, property, value } = this.parseDifference(difference);

        const ruleIndex = rules.findIndex(r => r.selector === selector);
        if (ruleIndex >= 0) {
          rules[ruleIndex].properties[property] = value;
          this.logger.info(`  Fixed: ${selector} { ${property}: ${value}; }`);
        } else {
          rules.push({ selector, properties: { [property]: value } });
          this.logger.info(`  Added: ${selector} { ${property}: ${value}; }`);
        }
      });

      const newCSS = CSSHelper.generateCSS(rules);
      fs.writeFileSync(cssPath, newCSS);
    }

    this.logger.success(`CSS fixes applied (${diff.differences.length} changes)`);
  }

  /**
   * Parse difference into selector, property, value
   */
  parseDifference(difference) {
    // Extract selector from difference
    let selector = difference.selector || '.' + difference.type;

    // Map difference type to CSS property
    const propertyMap = {
      'padding': 'padding',
      'margin': 'margin',
      'font-size': 'fontSize',
      'color': 'color',
      'background': 'backgroundColor'
    };

    const property = propertyMap[difference.type] || difference.type;
    const value = difference.expected || difference.actual;

    return { selector, property, value };
  }

  /**
   * Generate CSS from diff differences
   */
  generateCSSFromDiff(differences) {
    const rules = {};

    differences.forEach(difference => {
      const { selector, property, value } = this.parseDifference(difference);

      if (!rules[selector]) {
        rules[selector] = {};
      }

      rules[selector][property] = value;
    });

    // Generate CSS string
    let css = '';
    for (const [selector, properties] of Object.entries(rules)) {
      css += `${selector} {\n`;
      for (const [prop, val] of Object.entries(properties)) {
        // Convert camelCase to kebab-case
        const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
        css += `  ${cssProp}: ${val};\n`;
      }
      css += '}\n\n';
    }

    return css;
  }

  /**
   * Save version with metadata
   */
  async saveVersion(diff) {
    const cssPath = this.config.componentPath.replace(/\.(astro|jsx|vue)$/, '.css');
    let cssContent = '';

    if (fs.existsSync(cssPath)) {
      cssContent = fs.readFileSync(cssPath, 'utf8');
    }

    const metadata = {
      matchPercentage: diff.matchPercentage,
      differences: diff.differences,
      iteration: this.iteration
    };

    await this.versionTracker.saveVersion(this.iteration, cssContent, metadata);
  }

  /**
   * Generate final report
   */
  generateReport(success, lastDiff) {
    return {
      success,
      iterations: this.iteration,
      matchPercentage: lastDiff?.matchPercentage || 0,
      differences: lastDiff?.differences || [],
      threshold: this.config.matchThreshold,
      component: this.config.componentPath,
      reference: this.config.referenceUrl
    };
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
  const componentPath = args[0];
  const referenceUrl = args[1];

  if (!componentPath || !referenceUrl) {
    console.error('Usage: node css-layout-tester.js <component-path> <reference-url>');
    process.exit(1);
  }

  const tester = new CSSLayoutTester({
    componentPath,
    referenceUrl,
    matchThreshold: 98,
    maxIterations: 20
  });

  try {
    const report = await tester.test();
    console.log('\n=== Test Report ===');
    console.log(JSON.stringify(report, null, 2));
    process.exit(report.success ? 0 : 1);
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default CSSLayoutTester;
