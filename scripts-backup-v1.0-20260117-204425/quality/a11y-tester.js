#!/usr/bin/env node
/**
 * Accessibility Tester - WCAG 2.1 AA Compliance Validation
 * Comprehensive accessibility checking including screen reader, keyboard, and contrast
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Logger, ProgressTracker } from '../lib/shared.js';
import { WCAG_LEVELS, INTERACTIVE_STANDARDS } from '../lib/quality-gates.js';
import { MockMCPClient } from '../lib/mcp-wrapper.js';

puppeteer.use(StealthPlugin());

export class A11yTester {
  constructor(config = {}) {
    this.config = {
      url: config.url,
      wcagLevel: config.wcagLevel || 'AA',
      testKeyboard: config.testKeyboard !== undefined ? config.testKeyboard : true,
      testScreenReader: config.testScreenReader !== undefined ? config.testScreenReader : true,
      testContrast: config.testContrast !== undefined ? config.testContrast : true,
      testAria: config.testAria !== undefined ? config.testAria : true,
      testSemantic: config.testSemantic !== undefined ? config.testSemantic : true,
      testForms: config.testForms !== undefined ? config.testForms : true,
      testSkipLinks: config.testSkipLinks !== undefined ? config.testSkipLinks : true,
      timeout: config.timeout || 30000
    };

    this.logger = new Logger('a11y-test.log');
    this.mcp = new MockMCPClient(this.logger);
    this.results = {
      timestamp: new Date().toISOString(),
      url: this.config.url,
      wcagLevel: this.config.wcagLevel,
      categories: [],
      summary: null
    };
  }

  /**
   * Main validation flow
   */
  async test() {
    this.logger.info(`Starting Accessibility Tester for: ${this.config.url}`);
    this.logger.info(`WCAG Level: ${this.config.wcagLevel}`);

    try {
      // Initialize MCP
      await this.mcp.initialize();

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

      // Run all test categories
      const tests = [];

      if (this.config.testSemantic) {
        tests.push(this.testSemanticHTML(page));
      }
      if (this.config.testContrast) {
        tests.push(this.testColorContrast(page));
      }
      if (this.config.testAria) {
        tests.push(this.testARIA(page));
      }
      if (this.config.testKeyboard) {
        tests.push(this.testKeyboardNavigation(page));
      }
      if (this.config.testForms) {
        tests.push(this.testForms(page));
      }
      if (this.config.testSkipLinks) {
        tests.push(this.testSkipLinks(page));
      }
      if (this.config.testScreenReader) {
        tests.push(this.testScreenReaderCompatibility(page));
      }

      // Execute all tests
      this.results.categories = await Promise.all(tests);

      await browser.close();

      // Generate report
      return this.generateReport();

    } catch (error) {
      this.logger.error(`Accessibility test failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test semantic HTML
   */
  async testSemanticHTML(page) {
    this.logger.info('Testing semantic HTML...');

    const result = await page.evaluate(() => {
      const issues = [];

      // Check for proper heading structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headingOrder = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));

      for (let i = 1; i < headingOrder.length; i++) {
        if (headingOrder[i] > headingOrder[i - 1] + 1) {
          issues.push({
            type: 'heading_skip',
            severity: 'moderate',
            message: `Skipped heading level: h${headingOrder[i - 1]} → h${headingOrder[i]}`
          });
        }
      }

      // Check for multiple H1s
      const h1Count = document.querySelectorAll('h1').length;
      if (h1Count === 0) {
        issues.push({
          type: 'no_h1',
          severity: 'serious',
          message: 'No H1 tag found on page'
        });
      } else if (h1Count > 1) {
        issues.push({
          type: 'multiple_h1',
          severity: 'moderate',
          message: `Multiple H1 tags found (${h1Count}). Should have only one.`
        });
      }

      // Check for landmarks
      const landmarks = [
        'header', 'nav', 'main', 'aside', 'footer', 'article', 'section'
      ];
      const foundLandmarks = landmarks.map(l => document.querySelector(l)).filter(Boolean);

      if (!document.querySelector('main') && !document.querySelector('[role="main"]')) {
        issues.push({
          type: 'no_main',
          severity: 'serious',
          message: 'No <main> landmark or role="main" found'
        });
      }

      // Check for semantic buttons vs divs with onclick
      const divButtons = document.querySelectorAll('div[onclick], span[onclick]');
      if (divButtons.length > 0) {
        issues.push({
          type: 'non_semantic_clickable',
          severity: 'moderate',
          count: divButtons.length,
          message: `${divButtons.length} clickable element(s) using non-semantic <div> or <span>. Use <button> instead.`
        });
      }

      // Check for links with meaningful text
      const links = document.querySelectorAll('a[href]');
      const emptyLinks = Array.from(links).filter(a => !a.textContent?.trim() && !a.getAttribute('aria-label'));
      if (emptyLinks.length > 0) {
        issues.push({
          type: 'empty_link',
          severity: 'serious',
          count: emptyLinks.length,
          message: `${emptyLinks.length} link(s) with no meaningful text or aria-label`
        });
      }

      // Check for images without alt
      const images = document.querySelectorAll('img');
      const missingAlt = Array.from(images).filter(img => !img.hasAttribute('alt'));
      if (missingAlt.length > 0) {
        issues.push({
          type: 'missing_alt',
          severity: 'serious',
          count: missingAlt.length,
          message: `${missingAlt.length} image(s) missing alt attribute`
        });
      }

      return {
        category: 'semantic_html',
        passed: issues.filter(i => i.severity === 'serious').length === 0,
        issues,
        stats: {
          headings: headings.length,
          h1Count,
          landmarks: foundLandmarks.length,
          totalLinks: links.length,
          totalImages: images.length
        }
      };
    });

    this.logger.info(`  Found ${result.issues.length} semantic issues`);
    return result;
  }

  /**
   * Test color contrast
   */
  async testColorContrast(page) {
    this.logger.info('Testing color contrast...');

    const result = await page.evaluate((minContrast) => {
      const issues = [];

      // Helper function to calculate luminance
      const getLuminance = (r, g, b) => {
        const [rs, gs, bs] = [r, g, b].map(v => {
          v = v / 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      };

      // Helper function to calculate contrast ratio
      const getContrastRatio = (color1, color2) => {
        const l1 = getLuminance(color1.r, color1.g, color1.b);
        const l2 = getLuminance(color2.r, color2.g, color2.b);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
      };

      // Parse color to RGB
      const parseColor = (colorString) => {
        const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgbMatch) {
          return {
            r: parseInt(rgbMatch[1]),
            g: parseInt(rgbMatch[2]),
            b: parseInt(rgbMatch[3])
          };
        }
        const hexMatch = colorString.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
        if (hexMatch) {
          return {
            r: parseInt(hexMatch[1], 16),
            g: parseInt(hexMatch[2], 16),
            b: parseInt(hexMatch[3], 16)
          };
        }
        return null;
      };

      // Check text elements
      const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button, label, li');
      const checked = new Set();

      textElements.forEach(el => {
        // Skip if already checked or no text
        const key = `${el.tagName}-${el.textContent?.substring(0, 20)}`;
        if (checked.has(key)) return;
        checked.add(key);

        const text = el.textContent?.trim();
        if (!text || text.length < 3) return;

        const style = window.getComputedStyle(el);
        const foreground = parseColor(style.color);
        const background = parseColor(style.backgroundColor);

        if (foreground && background && background.a !== 0) {
          const ratio = getContrastRatio(foreground, background);
          const fontSize = parseFloat(style.fontSize);
          const fontWeight = parseInt(style.fontWeight);

          // Large text gets lower contrast requirement (3:1 instead of 4.5:1)
          const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
          const requiredContrast = isLargeText ? 3 : minContrast;

          if (ratio < requiredContrast) {
            issues.push({
              type: 'low_contrast',
              severity: 'serious',
              element: el.tagName.toLowerCase(),
              text: text.substring(0, 30),
              contrast: ratio.toFixed(2),
              required: requiredContrast,
              isLargeText
            });
          }
        }
      });

      return {
        category: 'color_contrast',
        passed: issues.length === 0,
        issues,
        stats: {
          elementsChecked: checked.size,
          failingElements: issues.length
        }
      };
    }, WCAG_LEVELS.AA.contrast);

    this.logger.info(`  Found ${result.issues.length} contrast issues`);
    return result;
  }

  /**
   * Test ARIA attributes
   */
  async testARIA(page) {
    this.logger.info('Testing ARIA attributes...');

    const result = await page.evaluate(() => {
      const issues = [];

      // Check for invalid ARIA roles
      const validRoles = [
        'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
        'cell', 'checkbox', 'columnheader', 'combobox', 'complementary', 'contentinfo',
        'definition', 'dialog', 'directory', 'document', 'feed', 'figure', 'form',
        'grid', 'gridcell', 'group', 'heading', 'img', 'link', 'list', 'listbox',
        'listitem', 'log', 'main', 'marquee', 'math', 'menu', 'menubar', 'menuitem',
        'menuitemcheckbox', 'menuitemradio', 'navigation', 'none', 'note', 'option',
        'presentation', 'progressbar', 'radio', 'radiogroup', 'region', 'row',
        'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox', 'separator',
        'slider', 'spinbutton', 'status', 'switch', 'tab', 'table', 'tablist',
        'tabpanel', 'term', 'textbox', 'timer', 'toolbar', 'tooltip', 'tree',
        'treegrid', 'treeitem'
      ];

      const elementsWithRole = document.querySelectorAll('[role]');
      elementsWithRole.forEach(el => {
        const role = el.getAttribute('role');
        const roles = role.split(' ').filter(r => r);

        roles.forEach(r => {
          if (!validRoles.includes(r)) {
            issues.push({
              type: 'invalid_role',
              severity: 'moderate',
              role: r,
              element: el.tagName.toLowerCase()
            });
          }
        });
      });

      // Check for aria-label on interactive elements without text
      const interactiveElements = document.querySelectorAll('button, a[href], [role="button"], [role="link"]');
      interactiveElements.forEach(el => {
        const text = el.textContent?.trim();
        const ariaLabel = el.getAttribute('aria-label');
        const labelledBy = el.getAttribute('aria-labelledby');

        if (!text && !ariaLabel && !labelledBy) {
          issues.push({
            type: 'interactive_no_label',
            severity: 'serious',
            element: el.tagName.toLowerCase(),
            message: 'Interactive element has no accessible name'
          });
        }
      });

      // Check for aria-hidden on focusable elements (problematic)
      const hiddenFocusable = document.querySelectorAll('[aria-hidden="true"] a, [aria-hidden="true"] button, [aria-hidden="true"] input, [aria-hidden="true"] [tabindex]');
      if (hiddenFocusable.length > 0) {
        issues.push({
          type: 'hidden_focusable',
          severity: 'moderate',
          count: hiddenFocusable.length,
          message: `${hiddenFocusable.length} focusable element(s) hidden with aria-hidden but still focusable`
        });
      }

      // Check for aria-expanded on buttons
      const expandedButtons = document.querySelectorAll('button[aria-expanded]');
      expandedButtons.forEach(btn => {
        const value = btn.getAttribute('aria-expanded');
        if (value !== 'true' && value !== 'false') {
          issues.push({
            type: 'invalid_expanded_value',
            severity: 'moderate',
            element: 'button',
            value: value,
            message: 'aria-expanded must be "true" or "false"'
          });
        }
      });

      return {
        category: 'aria',
        passed: issues.filter(i => i.severity === 'serious').length === 0,
        issues,
        stats: {
          elementsWithRole: elementsWithRole.length,
          interactiveElements: interactiveElements.length
        }
      };
    });

    this.logger.info(`  Found ${result.issues.length} ARIA issues`);
    return result;
  }

  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation(page) {
    this.logger.info('Testing keyboard navigation...');

    const result = {
      category: 'keyboard_navigation',
      passed: true,
      issues: [],
      stats: {}
    };

    // Get all focusable elements
    const focusableElements = await page.evaluate(() => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ].join(', ');

      const elements = Array.from(document.querySelectorAll(focusableSelectors));
      return elements.map(el => ({
        tag: el.tagName.toLowerCase(),
        type: el.type || '',
        hasOnclick: el.hasAttribute('onclick'),
        tabIndex: el.getAttribute('tabindex'),
        text: el.textContent?.substring(0, 30) || ''
      }));
    });

    result.stats.totalFocusable = focusableElements.length;

    // Check for elements that might not be keyboard accessible
    const clickOnlyElements = focusableElements.filter(el => el.hasOnclick && el.tag !== 'button' && el.tag !== 'a');
    if (clickOnlyElements.length > 0) {
      result.issues.push({
        type: 'click_only_interactive',
        severity: 'moderate',
        count: clickOnlyElements.length,
        message: `${clickOnlyElements.length} element(s) with onclick but may not be keyboard accessible`
      });
      result.passed = false;
    }

    // Check for positive tabindex (should generally use 0 or -1)
    const positiveTabindex = focusableElements.filter(el => el.tabIndex && parseInt(el.tabIndex) > 0);
    if (positiveTabindex.length > 0) {
      result.issues.push({
        type: 'positive_tabindex',
        severity: 'minor',
        count: positiveTabindex.length,
        message: `${positiveTabindex.length} element(s) with positive tabindex. Consider using logical DOM order instead.`
      });
    }

    // Test tab order by pressing Tab
    try {
      const tabResults = [];

      // Press Tab a few times and track focus
      for (let i = 0; i < Math.min(10, focusableElements.length); i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);

        const focusedElement = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el) return null;
          return {
            tag: el.tagName.toLowerCase(),
            id: el.id || '',
            className: el.className || '',
            text: el.textContent?.substring(0, 30) || ''
          };
        });

        if (focusedElement) {
          tabResults.push(focusedElement);
        }
      }

      result.stats.tabSequenceSample = tabResults;

    } catch (error) {
      result.issues.push({
        type: 'tab_test_error',
        severity: 'minor',
        message: `Could not test tab navigation: ${error.message}`
      });
    }

    // Check for skip links
    const skipLinks = await page.evaluate(() => {
      const skipLink = document.querySelector('a[href^="#"]:first-child');
      return {
        hasSkipLink: !!skipLink,
        skipLinkText: skipLink?.textContent || ''
      };
    });

    result.stats.hasSkipLinks = skipLinks.hasSkipLink;

    if (!skipLinks.hasSkipLink) {
      result.issues.push({
        type: 'no_skip_link',
        severity: 'moderate',
        message: 'No skip navigation link found for keyboard users'
      });
      result.passed = false;
    }

    this.logger.info(`  Found ${result.issues.length} keyboard navigation issues`);
    return result;
  }

  /**
   * Test forms
   */
  async testForms(page) {
    this.logger.info('Testing forms...');

    const result = await page.evaluate(() => {
      const issues = [];
      const forms = document.querySelectorAll('form');

      if (forms.length === 0) {
        return {
          category: 'forms',
          passed: true,
          issues: [],
          stats: { forms: 0, message: 'No forms found on page' }
        };
      }

      forms.forEach((form, formIndex) => {
        const inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach((input, inputIndex) => {
          const inputType = input.type || input.tagName.toLowerCase();

          // Skip hidden inputs
          if (inputType === 'hidden') return;

          // Check for label association
          const id = input.id;
          const label = id ? document.querySelector(`label[for="${id}"]`) : null;
          const wrappedLabel = input.closest('label');

          if (!label && !wrappedLabel) {
            const ariaLabel = input.getAttribute('aria-label');
            const labelledBy = input.getAttribute('aria-labelledby');

            if (!ariaLabel && !labelledBy) {
              issues.push({
                type: 'unlabeled_input',
                severity: 'serious',
                form: formIndex + 1,
                input: inputIndex + 1,
                inputType,
                name: input.name || input.id || '',
                message: `Input has no associated label, aria-label, or aria-labelledby`
              });
            }
          }

          // Check required fields have aria-required or required attribute
          if (input.hasAttribute('required')) {
            const ariaRequired = input.hasAttribute('aria-required');
            if (!ariaRequired) {
              // This is actually fine - required attribute is sufficient
              // But we'll note it for consistency
            }
          }
        });

        // Check for form submit button
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (!submitButton) {
          const buttons = form.querySelectorAll('button');
          if (buttons.length === 0) {
            issues.push({
              type: 'no_submit_button',
              severity: 'moderate',
              form: formIndex + 1,
              message: 'Form has no submit button'
            });
          }
        }

        // Check for proper form labeling
        const formHasLegend = form.querySelector('legend');
        const formHasAriaLabel = form.hasAttribute('aria-label') || form.hasAttribute('aria-labelledby');

        if (!formHasLegend && !formHasAriaLabel && inputs.length > 1) {
          issues.push({
            type: 'unlabeled_form',
            severity: 'minor',
            form: formIndex + 1,
            message: 'Form has multiple inputs but no legend or aria-label'
          });
        }
      });

      return {
        category: 'forms',
        passed: issues.filter(i => i.severity === 'serious').length === 0,
        issues,
        stats: {
          forms: forms.length,
          totalInputs: Array.from(forms).reduce((sum, f) => sum + f.querySelectorAll('input, select, textarea').length, 0)
        }
      };
    });

    this.logger.info(`  Found ${result.issues.length} form issues`);
    return result;
  }

  /**
   * Test skip links
   */
  async testSkipLinks(page) {
    this.logger.info('Testing skip links...');

    const result = await page.evaluate(() => {
      const issues = [];

      // Find skip links (usually at the top of the page)
      const skipLinks = Array.from(document.querySelectorAll('a'))
        .filter(a => {
          const text = a.textContent?.toLowerCase() || '';
          const href = a.getAttribute('href') || '';
          return text.includes('skip') || text.includes('jump') ||
                 href.includes('skip') || href.includes('main') ||
                 a.classList.contains('skip-link');
        });

      if (skipLinks.length === 0) {
        issues.push({
          type: 'no_skip_links',
          severity: 'moderate',
          message: 'No skip links found. Add a "Skip to main content" link for keyboard users.'
        });
      } else {
        // Check if skip link is visible when focused
        skipLinks.forEach(link => {
          const style = window.getComputedStyle(link);
          if (style.display === 'none' || style.visibility === 'hidden') {
            issues.push({
              type: 'hidden_skip_link',
              severity: 'moderate',
              message: 'Skip link is hidden. It should be visible when focused.'
            });
          }

          // Check if target exists
          const href = link.getAttribute('href');
          if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (!target) {
              issues.push({
                type: 'broken_skip_link',
                severity: 'moderate',
                target: href,
                message: `Skip link target "${href}" does not exist`
              });
            }
          }
        });
      }

      // Check for main landmark (required for skip links to work)
      const main = document.querySelector('main, [role="main"]');
      if (!main) {
        issues.push({
          type: 'no_main_landmark',
          severity: 'serious',
          message: 'No <main> landmark found. Required for "Skip to main content" links.'
        });
      }

      return {
        category: 'skip_links',
        passed: issues.filter(i => i.severity === 'serious').length === 0,
        issues,
        stats: {
          skipLinksFound: skipLinks.length,
          hasMainLandmark: !!main
        }
      };
    });

    this.logger.info(`  Found ${result.issues.length} skip link issues`);
    return result;
  }

  /**
   * Test screen reader compatibility
   */
  async testScreenReaderCompatibility(page) {
    this.logger.info('Testing screen reader compatibility...');

    // Take screenshot for MCP analysis
    const screenshotPath = './screenshots/a11y-screen-reader-check.png';
    await page.screenshot({ path: screenshotPath, fullPage: false });

    // Use MCP to analyze for screen reader issues
    const analysis = await this.mcp.analyzeImage(screenshotPath,
      'Analyze this webpage for screen reader accessibility issues. Look for: lack of headings, poor structure, missing landmarks, unlabelled images or buttons, or other accessibility problems.'
    );

    const result = await page.evaluate(() => {
      const issues = [];

      // Check for language declaration
      const html = document.documentElement;
      const lang = html.getAttribute('lang');
      if (!lang) {
        issues.push({
          type: 'no_lang_attribute',
          severity: 'serious',
          message: 'No lang attribute on <html> element. Critical for screen readers.'
        });
      }

      // Check for page title
      const title = document.title;
      if (!title || title.trim() === '') {
        issues.push({
          type: 'no_page_title',
          severity: 'serious',
          message: 'No page title. Screen readers announce this first.'
        });
      }

      // Check for proper heading hierarchy (already tested in semantic HTML, but critical for screen readers)
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headings.length === 0) {
        issues.push({
          type: 'no_headings',
          severity: 'moderate',
          message: 'No headings found. Screen readers use headings for navigation.'
        });
      }

      // Check for landmark regions
      const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], header, nav, main, aside, footer');
      if (landmarks.length === 0) {
        issues.push({
          type: 'no_landmarks',
          severity: 'moderate',
          message: 'No landmark regions. Screen readers use these for navigation.'
        });
      }

      // Check for lists (screen readers announce number of items)
      const lists = document.querySelectorAll('ul, ol');
      if (lists.length === 0) {
        issues.push({
          type: 'no_lists',
          severity: 'info',
          message: 'No lists found. Lists help screen readers understand grouped content.'
        });
      }

      return {
        category: 'screen_reader',
        passed: issues.filter(i => i.severity === 'serious').length === 0,
        issues,
        stats: {
          hasLang: !!lang,
          lang: lang || '',
          hasTitle: !!title,
          headingCount: headings.length,
          landmarkCount: landmarks.length
        }
      };
    });

    result.mcpAnalysis = analysis;

    this.logger.info(`  Found ${result.issues.length} screen reader issues`);
    return result;
  }

  /**
   * Generate validation report
   */
  generateReport() {
    // Count issues by severity
    const severityCounts = {
      serious: 0,
      moderate: 0,
      minor: 0
    };

    this.results.categories.forEach(cat => {
      cat.issues.forEach(issue => {
        if (severityCounts[issue.severity] !== undefined) {
          severityCounts[issue.severity]++;
        }
      });
    });

    const totalIssues = this.results.categories.reduce((sum, cat) => sum + cat.issues.length, 0);
    const seriousIssues = severityCounts.serious;
    const passedCategories = this.results.categories.filter(c => c.passed).length;

    const summary = {
      totalCategories: this.results.categories.length,
      passedCategories,
      failedCategories: this.results.categories.length - passedCategories,
      totalIssues,
      seriousIssues,
      moderateIssues: severityCounts.moderate,
      minorIssues: severityCounts.minor,
      wcagLevel: this.config.wcagLevel,
      passed: seriousIssues === 0
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

    this.logger.info(`Accessibility test complete: ${passedCategories}/${summary.totalCategories} categories passed`);
    this.logger.info(`Total issues: ${totalIssues} (${seriousIssues} serious, ${severityCounts.moderate} moderate, ${severityCounts.minor} minor)`);

    return report;
  }

  /**
   * Generate recommendations based on issues found
   */
  generateRecommendations() {
    const recommendations = [];

    // Group issues by type
    const issueTypes = {};
    this.results.categories.forEach(cat => {
      cat.issues.forEach(issue => {
        const key = issue.type;
        if (!issueTypes[key]) {
          issueTypes[key] = [];
        }
        issueTypes[key].push(issue);
      });
    });

    // Generate recommendations for each issue type

    // Heading issues
    if (issueTypes.heading_skip || issueTypes.no_h1 || issueTypes.multiple_h1) {
      recommendations.push({
        priority: 'high',
        issue: 'heading_structure',
        recommendation: 'Fix heading hierarchy: Use single H1, don\'t skip levels (H1 → H2 → H3). Headings should form an outline of the page.'
      });
    }

    // Contrast issues
    if (issueTypes.low_contrast) {
      recommendations.push({
        priority: 'critical',
        issue: 'color_contrast',
        count: issueTypes.low_contrast.length,
        recommendation: `Increase color contrast to meet WCAG ${this.config.wcagLevel} (minimum ${WCAG_LEVELS[this.config.wcagLevel].contrast}:1 for normal text). Use a contrast checker tool.`
      });
    }

    // Missing alt text
    if (issueTypes.missing_alt) {
      recommendations.push({
        priority: 'critical',
        issue: 'missing_alt',
        count: issueTypes.missing_alt.length,
        recommendation: 'Add alt attributes to all images. Use empty alt="" for decorative images.'
      });
    }

    // ARIA issues
    if (issueTypes.invalid_role || issueTypes.interactive_no_label) {
      recommendations.push({
        priority: 'high',
        issue: 'aria_attributes',
        recommendation: 'Fix ARIA attributes: Use valid roles, ensure interactive elements have accessible names, validate with axe DevTools.'
      });
    }

    // Keyboard issues
    if (issueTypes.click_only_interactive || issueTypes.no_skip_link) {
      recommendations.push({
        priority: 'high',
        issue: 'keyboard_navigation',
        recommendation: 'Ensure all interactive elements are keyboard accessible. Add skip navigation link. Test by tabbing through the page.'
      });
    }

    // Form issues
    if (issueTypes.unlabeled_input) {
      recommendations.push({
        priority: 'critical',
        issue: 'form_labels',
        count: issueTypes.unlabeled_input.length,
        recommendation: 'Associate all form inputs with labels using <label for="id"> or aria-label. Required for screen reader users.'
      });
    }

    // Screen reader issues
    if (issueTypes.no_lang_attribute || issueTypes.no_page_title) {
      recommendations.push({
        priority: 'critical',
        issue: 'screen_reader_basics',
        recommendation: 'Add lang attribute to <html> and ensure each page has a descriptive <title>. These are fundamental for screen reader users.'
      });
    }

    // Semantic HTML issues
    if (issueTypes.non_semantic_clickable || issueTypes.no_main) {
      recommendations.push({
        priority: 'medium',
        issue: 'semantic_html',
        recommendation: 'Use semantic HTML elements (<button> instead of <div>, <main> for main content). Semantic elements are inherently accessible.'
      });
    }

    // Landmark issues
    if (issueTypes.no_main || issueTypes.no_landmarks) {
      recommendations.push({
        priority: 'medium',
        issue: 'landmarks',
        recommendation: 'Add ARIA landmarks: <header>, <nav>, <main>, <footer>. These help screen reader users navigate quickly.'
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
  const level = args[1] || 'AA';

  if (!url) {
    console.error('Usage: node a11y-tester.js <url> [wcag-level]');
    console.error('Example: node a11y-tester.js http://localhost:3000 AA');
    console.error('');
    console.error('WCAG Levels: A, AA, AAA (default: AA)');
    process.exit(1);
  }

  const tester = new A11yTester({
    url,
    wcagLevel: level.toUpperCase()
  });

  try {
    const report = await tester.test();
    console.log('\n=== Accessibility Test Report ===');
    console.log(JSON.stringify(report, null, 2));

    // Exit with error code if serious issues found
    process.exit(report.summary.passed ? 0 : 1);
  } catch (error) {
    console.error('Accessibility test failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default A11yTester;
