#!/usr/bin/env node

/**
 * Screenshot Capture Script for AI Website Builders Research
 *
 * Captures key sections from competitor websites for visual analysis
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Competitor sites to analyze
const COMPETITORS = [
  {
    name: 'digital-com',
    url: 'https://digital.com',
    shortName: 'digital'
  },
  {
    name: 'websitetooltester',
    url: 'https://websitetooltester.com',
    shortName: 'tooltester'
  },
  {
    name: 'codelessly',
    url: 'https://codelessly.dev',
    shortName: 'codelessly'
  },
  {
    name: 'websitebuilderexpert',
    url: 'https://websitebuilderexpert.com',
    shortName: 'wbe'
  }
];

// Sections to capture for each site
const SECTIONS = [
  { name: 'full-homepage', selector: 'body', height: 2000 },
  { name: 'hero', selector: 'header, .hero, section:first-of-type', height: 800 },
  { name: 'review-cards', selector: '.card, .review-card, .tile', height: 600 },
  { name: 'comparison-table', selector: 'table, .comparison, .compare-table', height: 800 },
  { name: 'scoring', selector: '.rating, .score, .stars, .review-score', height: 400 },
  { name: 'navigation', selector: 'nav, .navbar, .navigation', height: 200 },
  { name: 'footer', selector: 'footer', height: 400 }
];

async function captureScreenshots() {
  const browser = await chromium.launch({
    headless: true
  });

  const results = [];

  for (const competitor of COMPETITORS) {
    console.log(`\n=== Capturing ${competitor.name} ===`);

    const page = await browser.newPage();
    const viewport = { width: 1920, height: 1080 };

    try {
      // Navigate to site
      console.log(`Loading ${competitor.url}...`);
      await page.goto(competitor.url, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      await page.setViewportSize(viewport);
      await page.waitForTimeout(2000); // Allow animations to complete

      // Create competitor directory
      const outputDir = path.join(__dirname, '..', 'screenshots', 'references', competitor.shortName);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const competitorResults = {
        name: competitor.name,
        url: competitor.url,
        screenshots: []
      };

      // Capture each section
      for (const section of SECTIONS) {
        try {
          const filename = `${competitor.shortName}-${section.name}.png`;
          const filepath = path.join(outputDir, filename);

          console.log(`  Capturing: ${section.name}...`);

          // Try to find and scroll to the section
          if (section.selector !== 'body') {
            try {
              const element = await page.waitForSelector(section.selector, { timeout: 5000 });
              if (element) {
                await element.scrollIntoViewIfNeeded();
                await page.waitForTimeout(500);
              }
            } catch (e) {
              console.log(`    Warning: ${section.selector} not found, capturing viewport`);
            }
          }

          // Capture screenshot
          if (section.name === 'full-homepage') {
            // Full page scroll capture
            await page.screenshot({
              path: filepath,
              fullPage: true
            });
          } else {
            // Element or viewport capture
            const clip = await page.evaluate(({ selector, sectionHeight }) => {
              const el = selector === 'body' ? document.body : document.querySelector(selector);
              if (el) {
                const rect = el.getBoundingClientRect();
                return {
                  x: Math.max(0, rect.x - 20),
                  y: Math.max(0, rect.y - 20),
                  width: Math.min(rect.width + 40, window.innerWidth),
                  height: Math.min(sectionHeight, rect.height + 40)
                };
              }
              return null;
            }, { selector: section.selector, sectionHeight: section.height });

            if (clip) {
              await page.screenshot({
                path: filepath,
                clip
              });
            } else {
              await page.screenshot({
                path: filepath
              });
            }
          }

          competitorResults.screenshots.push({
            section: section.name,
            path: filepath,
            success: true
          });

          console.log(`    Saved: ${filename}`);

        } catch (error) {
          console.log(`    Error capturing ${section.name}: ${error.message}`);
          competitorResults.screenshots.push({
            section: section.name,
            error: error.message,
            success: false
          });
        }
      }

      results.push(competitorResults);

    } catch (error) {
      console.error(`Error processing ${competitor.name}: ${error.message}`);
      results.push({
        name: competitor.name,
        error: error.message,
        screenshots: []
      });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // Save results summary
  const summaryPath = path.join(__dirname, '..', 'screenshots', 'capture-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));

  console.log('\n=== Capture Complete ===');
  console.log(`Summary saved to: ${summaryPath}`);

  return results;
}

// Run capture
captureScreenshots()
  .then(results => {
    console.log('\n=== Results Summary ===');
    results.forEach(r => {
      const successCount = r.screenshots.filter(s => s.success).length;
      console.log(`${r.name}: ${successCount}/${r.screenshots.length} screenshots captured`);
    });
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
