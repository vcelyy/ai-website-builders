#!/usr/bin/env node
/**
 * Visual Match Loop - Automated CSS Refinement
 * Iteratively adjusts CSS until visual match achieved
 *
 * Usage: node visual-match-loop.js <component-path> <reference-url>
 * Example: node visual-match-loop.js src/components/Hero.astro https://competitor.com
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { createMCPClient } from './lib/mcp-wrapper.js';
import { Logger } from './lib/shared.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

puppeteer.use(StealthPlugin());

export class VisualMatchLoop {
  constructor(config) {
    this.config = {
      componentPath: config.componentPath,
      referenceUrl: config.referenceUrl,
      outputPath: config.outputPath || path.dirname(config.componentPath),
      maxIterations: config.maxIterations || 10,
      matchThreshold: config.matchThreshold || 98, // percent
      screenshotsDir: config.screenshotsDir || './screenshots/iterations',
      devServerUrl: config.devServerUrl || 'http://localhost:3000'
    };

    this.logger = new Logger('visual-match-loop.log');
    this.mcp = createMCPClient(this.logger);
    this.iterations = [];
    this.referencePath = null;
  }

  /**
   * Main execution flow
   */
  async run() {
    this.logger.info(`Starting Visual Match Loop for: ${this.config.componentPath}`);
    this.logger.info(`Reference: ${this.config.referenceUrl}`);

    // Ensure directories exist
    fs.mkdirSync(this.config.screenshotsDir, { recursive: true });
    fs.mkdirSync(path.join(this.config.screenshotsDir, 'backups'), { recursive: true });

    let iteration = 0;
    let matchAchieved = false;
    let previousQuality = 0;

    while (iteration < this.config.maxIterations && !matchAchieved) {
      iteration++;
      this.logger.info(`\n${'='.repeat(60)}`);
      this.logger.info(`ITERATION ${iteration}/${this.config.maxIterations}`);
      this.logger.info(`${'='.repeat(60)}`);

      // Step 1: Capture reference (first time only)
      if (iteration === 1) {
        this.referencePath = await this.captureReference();
      }

      // Step 2: Build/capture our component
      const ourPath = await this.captureOurComponent(iteration);

      // Step 3: Run visual diff
      const diff = await this.runVisualDiff(this.referencePath, ourPath);
      this.iterations.push({ iteration, diff, timestamp: Date.now() });

      // Step 4: Check if match achieved
      if (diff.matchAchieved || diff.matchPercentage >= this.config.matchThreshold) {
        matchAchieved = true;
        this.logger.info(`\n✅ MATCH ACHIEVED: ${diff.matchPercentage || '>98'}%`);
        break;
      }

      // Step 5: Quality ratchet (ensure improvement)
      const currentQuality = diff.matchPercentage || 0;
      if (iteration > 1 && currentQuality < previousQuality) {
        this.logger.warning(`Quality decreased: ${previousQuality}% → ${currentQuality}%`);
        this.logger.warning('Reverting changes and trying different approach...');
        await this.revertChanges(iteration);
        // Exit loop to avoid infinite degradation
        break;
      }
      previousQuality = currentQuality;

      // Step 6: Apply CSS fixes
      await this.applyCSSFixes(diff.fixes || [], iteration);

      // Step 7: Trigger rebuild
      await this.triggerRebuild();

      this.logger.info(`Iteration ${iteration} complete. Match: ${currentQuality}%`);
    }

    // Generate report
    return this.generateReport(matchAchieved, iteration);
  }

  /**
   * Capture reference screenshot
   */
  async captureReference() {
    this.logger.info('Capturing reference screenshot...');

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      await page.goto(this.config.referenceUrl, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      const referencePath = path.join(this.config.screenshotsDir, 'reference.png');
      await page.screenshot({ path: referencePath, fullPage: false });

      await page.close();
      this.logger.info(`Reference saved: ${referencePath}`);
      return referencePath;

    } finally {
      await browser.close();
    }
  }

  /**
   * Capture our component screenshot
   */
  async captureOurComponent(iteration) {
    const ourPath = path.join(
      this.config.screenshotsDir,
      `iteration-${iteration}.png`
    );

    // Ensure dev server is running
    const isRunning = await this.isDevServerRunning();
    if (!isRunning) {
      this.logger.warning('Dev server not running. Starting it...');
      await this.startDevServer();
    }

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      // Navigate to our component
      const componentUrl = this.getComponentUrl();
      this.logger.info(`Navigating to: ${componentUrl}`);

      await page.goto(componentUrl, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      await page.screenshot({ path: ourPath, fullPage: false });
      await page.close();

      this.logger.info(`Our component saved: ${ourPath}`);
      return ourPath;

    } finally {
      await browser.close();
    }
  }

  /**
   * Run visual diff via MCP
   */
  async runVisualDiff(referencePath, ourPath) {
    this.logger.info('Running visual diff via MCP...');

    try {
      const diff = await this.mcp.visualDiff(referencePath, ourPath, {
        prompt: `Report specific CSS measurement differences. Focus on:
        - Spacing (padding, margin, gap)
        - Typography (font size, line height, letter spacing)
        - Colors (exact hex values)
        - Layout (alignment, positioning)
        - Dimensions (width, height, border radius)

        Provide EXACT measurements in your feedback.`
      });

      this.logger.info(`Match: ${diff.matchPercentage || diff.matchAchieved ? 'Yes' : 'No'} (${diff.matchPercentage || 0}%)`);

      if (diff.fixes && diff.fixes.length > 0) {
        this.logger.info(`Fixes needed: ${diff.fixes.length}`);
        diff.fixes.forEach(fix => {
          this.logger.info(`  - ${fix.property}: ${fix.from} → ${fix.to}`);
        });
      }

      return diff;

    } catch (error) {
      this.logger.error(`Visual diff failed: ${error.message}`);
      return {
        matchAchieved: false,
        matchPercentage: 0,
        fixes: [],
        error: error.message
      };
    }
  }

  /**
   * Apply CSS fixes to component file
   */
  async applyCSSFixes(fixes, iteration) {
    if (!fixes || fixes.length === 0) {
      this.logger.info('No fixes to apply');
      return;
    }

    this.logger.info(`Applying ${fixes.length} CSS fixes...`);

    const componentFile = path.resolve(this.config.componentPath);

    if (!fs.existsSync(componentFile)) {
      this.logger.error(`Component file not found: ${componentFile}`);
      return;
    }

    // Create backup
    const backupPath = path.join(
      this.config.screenshotsDir,
      'backups',
      `${path.basename(componentFile)}.v${iteration}.bak`
    );
    fs.copyFileSync(componentFile, backupPath);
    this.logger.info(`Backup saved: ${backupPath}`);

    // Read and modify content
    let content = fs.readFileSync(componentFile, 'utf-8');
    let appliedCount = 0;

    fixes.forEach(fix => {
      // Try to find and replace the CSS property
      const patterns = [
        // Match with any whitespace variations
        new RegExp(`${fix.property}\\s*:\\s*[^;]+`, 'g'),
        // Match with space before
        new RegExp(`\\s+${fix.property}\\s*:\\s*[^;]+`, 'g'),
        // Match within style attribute
        new RegExp(`${fix.property}\\s*=\\s*["'][^"']*["']`, 'g')
      ];

      let replaced = false;
      for (const pattern of patterns) {
        if (pattern.test(content)) {
          content = content.replace(pattern, `${fix.property}: ${fix.to}`);
          replaced = true;
          break;
        }
      }

      if (replaced) {
        appliedCount++;
        this.logger.info(`  ✓ ${fix.property}: ${fix.from} → ${fix.to}`);
      } else {
        this.logger.warning(`  ! Property ${fix.property} not found in source`);
      }
    });

    // Write back
    fs.writeFileSync(componentFile, content);
    this.logger.info(`Applied ${appliedCount}/${fixes.length} fixes`);
  }

  /**
   * Revert changes from last iteration
   */
  async revertChanges(iteration) {
    const componentFile = path.resolve(this.config.componentPath);
    const backupPath = path.join(
      this.config.screenshotsDir,
      'backups',
      `${path.basename(componentFile)}.v${iteration - 1}.bak`
    );

    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, componentFile);
      this.logger.info(`Reverted to v${iteration - 1}`);
    } else {
      this.logger.error(`Backup not found: ${backupPath}`);
    }
  }

  /**
   * Trigger rebuild of component
   */
  async triggerRebuild() {
    // For Astro/Next.js/Vite, the watch mode should pick up file changes
    this.logger.info('File saved. Watch mode should trigger rebuild...');

    // Wait a moment for rebuild to start
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  /**
   * Check if dev server is running
   */
  async isDevServerRunning() {
    try {
      const response = await fetch(this.config.devServerUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok || response.status === 404; // 404 means server is running
    } catch {
      return false;
    }
  }

  /**
   * Start dev server (if needed)
   */
  async startDevServer() {
    this.logger.info('Note: Start dev server manually before running this script');
    this.logger.info(`Expected URL: ${this.config.devServerUrl}`);
    // In production, this could spawn a child process
  }

  /**
   * Get URL for component
   */
  getComponentUrl() {
    // Convert file path to URL route
    const relativePath = path.relative(process.cwd(), this.config.componentPath);

    // Handle different file types
    if (relativePath.includes('src/pages/')) {
      // Astro pages
      const route = relativePath
        .replace('src/pages/', '')
        .replace(/\.(astro|mdx)$/, '')
        .replace(/\/index$/, '') || '/';
      return new URL(route, this.config.devServerUrl).href;
    } else if (relativePath.includes('src/components/')) {
      // Components - might need a test page
      const componentName = path.basename(relativePath).replace(/\.(astro|tsx|jsx)$/, '');
      this.logger.warning(`Component URL may need manual verification for: ${componentName}`);
      return `${this.config.devServerUrl}/?component=${componentName}`;
    }

    // Default to root
    return this.config.devServerUrl;
  }

  /**
   * Generate final report
   */
  generateReport(success, finalIteration) {
    const report = {
      success,
      iterations: finalIteration,
      maxIterations: this.config.maxIterations,
      componentPath: this.config.componentPath,
      referenceUrl: this.config.referenceUrl,
      finalQuality: this.iterations[finalIteration - 1]?.diff?.matchPercentage || 0,
      history: this.iterations,
      summary: success
        ? `Visual match achieved in ${finalIteration} iterations`
        : `Failed to achieve match after ${finalIteration} iterations`
    };

    // Save report
    const reportPath = path.join(this.config.screenshotsDir, 'report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.logger.info(`Report saved: ${reportPath}`);

    return report;
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
    console.error('Usage: node visual-match-loop.js <component-path> <reference-url>');
    console.error('Example: node visual-match-loop.js src/components/Hero.astro https://competitor.com');
    process.exit(1);
  }

  const loop = new VisualMatchLoop({
    componentPath,
    referenceUrl,
    maxIterations: 10
  });

  try {
    const result = await loop.run();
    console.log('\n=== Visual Match Loop Results ===');
    console.log(JSON.stringify(result, null, 2));

    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('Visual match loop failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default VisualMatchLoop;
