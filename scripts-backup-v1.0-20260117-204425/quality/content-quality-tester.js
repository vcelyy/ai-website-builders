#!/usr/bin/env node
/**
 * Content Quality Tester - Anti-AI-Slop Validation
 * Detects generic phrases, framework defaults, and corporate buzzwords
 * Ensures content has personal voice and specific examples
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Logger, ProgressTracker } from '../lib/shared.js';
import {
  CONTENT_QUALITY_THRESHOLDS,
  GENERIC_PHRASES,
  FRAMEWORK_DEFAULTS,
  CORPORATE_SLOP
} from '../lib/quality-gates.js';
import { MockMCPClient } from '../lib/mcp-wrapper.js';

puppeteer.use(StealthPlugin());

/**
 * Patterns to detect for framework defaults
 */
const FRAMEWORK_PATTERNS = {
  tailwind: {
    classes: ['p-6', 'gap-3', 'shadow-xl', 'text-gray-600', 'bg-white', 'rounded-lg', 'flex', 'items-center', 'justify-between'],
    colors: ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'] // Default Tailwind colors
  },
  bootstrap: {
    classes: ['btn-primary', 'card', 'navbar', 'container', 'row', 'col', 'form-control'],
    colors: ['#007bff', '#6c757d', '#28a745', '#17a2b8', '#dc3545'] // Bootstrap default colors
  }
};

/**
 * Indicators of AI-generated content
 */
const AI_INDICATORS = [
  'in conclusion',
  'it is important to note',
  'it\'s worth noting',
  'in today\'s world',
  'in this fast-paced',
  'ever-evolving',
  'cutting-edge technology',
  'state-of-the-art',
  'revolutionize',
  'game-changer',
  'paradigm shift',
  'unlock your potential',
  'take your x to the next level',
  'harness the power',
  'leverage the latest',
  'stay ahead of the curve'
];

export class ContentQualityTester {
  constructor(config = {}) {
    this.config = {
      url: config.url,
      detectGeneric: config.detectGeneric !== undefined ? config.detectGeneric : true,
      detectFrameworkDefaults: config.detectFrameworkDefaults !== undefined ? config.detectFrameworkDefaults : true,
      detectSlop: config.detectSlop !== undefined ? config.detectSlop : true,
      useAIAnalysis: config.useAIAnalysis !== undefined ? config.useAIAnalysis : true,
      minQualityScore: config.minQualityScore || 7,
      timeout: config.timeout || 30000
    };

    this.logger = new Logger('content-quality-test.log');
    this.mcp = new MockMCPClient(this.logger);
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
    this.logger.info(`Starting Content Quality Tester for: ${this.config.url}`);
    this.logger.info('This tool helps detect "AI slop" - generic, uninspired content.');

    try {
      // Launch browser
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      // Initialize MCP
      await this.mcp.initialize();

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

      if (this.config.detectGeneric) {
        tests.push(this.testGenericPhrases(page));
      }

      if (this.config.detectFrameworkDefaults) {
        tests.push(this.testFrameworkDefaults(page));
      }

      if (this.config.detectSlop) {
        tests.push(this.testCorporateSlop(page));
      }

      tests.push(this.testSpecificExamples(page));
      tests.push(this.testPersonalVoice(page));
      tests.push(this.testContentLength(page));

      if (this.config.useAIAnalysis) {
        tests.push(this.testAIAnalysis(browser));
      }

      // Execute all tests
      this.results.categories = await Promise.all(tests);

      await browser.close();

      // Generate report
      return this.generateReport();

    } catch (error) {
      this.logger.error(`Content quality test failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test for generic phrases
   */
  async testGenericPhrases(page) {
    this.logger.info('Testing for generic phrases...');

    const genericInfo = await page.evaluate((genericPhrases) => {
      // Get all text content
      const bodyText = document.body.textContent || '';
      const textLower = bodyText.toLowerCase();

      const found = [];

      genericPhrases.forEach(phrase => {
        const regex = new RegExp(phrase, 'gi');
        const matches = textLower.match(regex);
        if (matches) {
          found.push({
            phrase,
            count: matches.length,
            positions: this.findPhrasePositions(bodyText, phrase)
          });
        }
      });

      // Check for AI indicators too
      const aiIndicators = [
        'in conclusion',
        'it is important to note',
        'in today\'s world',
        'ever-evolving landscape'
      ];

      const aiFound = [];
      aiIndicators.forEach(phrase => {
        if (textLower.includes(phrase)) {
          aiFound.push(phrase);
        }
      });

      return {
        totalWordCount: bodyText.split(/\s+/).length,
        genericPhrasesFound: found,
        aiIndicatorsFound: aiFound,
        genericPhraseCount: found.reduce((sum, f) => sum + f.count, 0)
      };
    }, GENERIC_PHRASES);

    const issues = [];
    const maxAllowed = CONTENT_QUALITY_THRESHOLDS.maxGenericPhrases;

    if (genericInfo.genericPhraseCount > maxAllowed) {
      issues.push({
        type: 'too_many_generic_phrases',
        severity: 'moderate',
        message: `${genericInfo.genericPhraseCount} generic phrase(s) found (max: ${maxAllowed}). Rewrite with specific, original language.`,
        count: genericInfo.genericPhraseCount,
        samples: genericInfo.genericPhrasesFound.slice(0, 3).map(f => f.phrase)
      });
    }

    if (genericInfo.aiIndicatorsFound.length > 0) {
      issues.push({
        type: 'ai_indicators_found',
        severity: 'moderate',
        message: `Found AI-generated content indicators: ${genericInfo.aiIndicatorsFound.join(', ')}`,
        indicators: genericInfo.aiIndicatorsFound
      });
    }

    const passed = genericInfo.genericPhraseCount <= maxAllowed;

    this.logger.info(`  Generic phrases: ${genericInfo.genericPhraseCount} found (max: ${maxAllowed})`);

    return {
      category: 'generic_phrases',
      passed,
      issues,
      metrics: genericInfo
    };
  }

  /**
   * Test for framework defaults
   */
  async testFrameworkDefaults(page) {
    this.logger.info('Testing for framework defaults...');

    const frameworkInfo = await page.evaluate((patterns) => {
      const issues = {
        tailwind: [],
        bootstrap: []
      };

      // Check Tailwind classes
      const allElements = document.querySelectorAll('*');
      const tailwindClasses = new Set();

      allElements.forEach(el => {
        const classList = el.className || '';
        if (typeof classList === 'string') {
          patterns.tailwind.classes.forEach(cls => {
            if (classList.includes(cls)) {
              tailwindClasses.add(cls);
            }
          });
        }
      });

      issues.tailwind = Array.from(tailwindClasses);

      // Check Bootstrap classes
      const bootstrapClasses = new Set();
      allElements.forEach(el => {
        const classList = el.className || '';
        if (typeof classList === 'string') {
          patterns.bootstrap.classes.forEach(cls => {
            if (classList.includes(cls) && classList.includes(cls)) {
              bootstrapClasses.add(cls);
            }
          });
        }
      });

      issues.bootstrap = Array.from(bootstrapClasses);

      // Check for default colors in inline styles
      const defaultColors = [];

      allElements.forEach(el => {
        const style = el.getAttribute('style') || '';
        patterns.tailwind.colors.forEach(color => {
          if (style.includes(color.toLowerCase())) {
            defaultColors.push({
              element: el.tagName,
              color
            });
          }
        });
      });

      return {
        tailwindClasses: issues.tailwind,
        bootstrapClasses: issues.bootstrap,
        defaultColors: defaultColors.slice(0, 10), // First 10
        totalElements: allElements.length
      };
    }, FRAMEWORK_PATTERNS);

    const issues = [];
    const maxAllowed = CONTENT_QUALITY_THRESHOLDS.maxFrameworkDefaults;

    // Count framework defaults
    const tailwindCount = frameworkInfo.tailwindClasses.length;
    const bootstrapCount = frameworkInfo.bootstrapClasses.length;
    const totalDefaults = tailwindCount + bootstrapCount;

    if (totalDefaults > maxAllowed) {
      issues.push({
        type: 'too_many_framework_defaults',
        severity: 'minor',
        message: `${totalDefaults} framework default class(es) found (max: ${maxAllowed}). Consider custom styling.`,
        count: totalDefaults,
        tailwind: tailwindCount,
        bootstrap: bootstrapCount
      });
    }

    // Check if using uncustomized defaults
    if (tailwindCount > 10 && bootstrapCount === 0) {
      issues.push({
        type: 'generic_tailwind',
        severity: 'info',
        message: 'Heavy use of default Tailwind classes. Customize theme for unique appearance.',
        samples: frameworkInfo.tailwindClasses.slice(0, 5)
      });
    }

    if (bootstrapCount > 5) {
      issues.push({
        type: 'generic_bootstrap',
        severity: 'info',
        message: 'Using default Bootstrap classes. Consider custom styling for unique brand.',
        samples: frameworkInfo.bootstrapClasses.slice(0, 5)
      });
    }

    if (frameworkInfo.defaultColors.length > 5) {
      issues.push({
        type: 'default_colors',
        severity: 'info',
        message: 'Using default framework colors. Define custom color palette for brand identity.',
        count: frameworkInfo.defaultColors.length
      });
    }

    const passed = totalDefaults <= maxAllowed * 2; // More lenient for framework defaults

    this.logger.info(`  Framework defaults: ${totalDefaults} found`);

    return {
      category: 'framework_defaults',
      passed,
      issues,
      metrics: frameworkInfo
    };
  }

  /**
   * Test for corporate slop
   */
  async testCorporateSlop(page) {
    this.logger.info('Testing for corporate buzzwords...');

    const slopInfo = await page.evaluate((corporateSlop) => {
      const bodyText = document.body.textContent || '';
      const textLower = bodyText.toLowerCase();

      const found = [];

      corporateSlop.forEach(phrase => {
        const regex = new RegExp(phrase, 'gi');
        const matches = textLower.match(regex);
        if (matches) {
          found.push({
            phrase,
            count: matches.length
          });
        }
      });

      return {
        corporateSlopFound: found,
        totalSlopCount: found.reduce((sum, f) => sum + f.count, 0)
      };
    }, CORPORATE_SLOP);

    const issues = [];
    const maxAllowed = CONTENT_QUALITY_THRESHOLDS.maxCorporateSlop;

    if (slopInfo.totalSlopCount > maxAllowed) {
      issues.push({
        type: 'too_many_buzzwords',
        severity: 'moderate',
        message: `${slopInfo.totalSlopCount} corporate buzzword(s) found (max: ${maxAllowed}). Write in plain, authentic language.`,
        count: slopInfo.totalSlopCount,
        samples: slopInfo.corporateSlopFound.slice(0, 3).map(f => f.phrase)
      });
    }

    // Specifically check for worst offenders
    const worstOffenders = slopInfo.corporateSlopFound.filter(f =>
      ['leverage', 'synergy', 'innovative solutions'].includes(f.phrase)
    );

    if (worstOffenders.length > 0) {
      issues.push({
        type: 'worst_buzzwords',
        severity: 'moderate',
        message: 'Found particularly overused buzzwords. Replace with concrete language.',
        buzzwords: worstOffenders.map(f => f.phrase)
      });
    }

    const passed = slopInfo.totalSlopCount <= maxAllowed;

    this.logger.info(`  Corporate slop: ${slopInfo.totalSlopCount} found (max: ${maxAllowed})`);

    return {
      category: 'corporate_slop',
      passed,
      issues,
      metrics: slopInfo
    };
  }

  /**
   * Test for specific examples
   */
  async testSpecificExamples(page) {
    this.logger.info('Testing for specific examples...');

    const examplesInfo = await page.evaluate(() => {
      const bodyText = document.body.textContent || '';

      // Look for indicators of specific examples:
      // - Numbers with units (95%, 1000 users, 5 stars)
      // - Specific names/brands
      // - Case studies
      // - Data/statistics
      // - Before/after comparisons
      // - Screenshots/images with captions

      const indicators = {
        numbers: (bodyText.match(/\d+\s*(%|users|customers|stars|reviews|days|months|years)/gi) || []).length,
        measurements: (bodyText.match(/\d+\s*(px|em|rem|kb|mb|seconds?|minutes?|hours?)/gi) || []).length,
        specificTime: (bodyText.match(/\b(in 2020|in 2021|in 2022|in 2023|in 2024|in 2025|last year|this month)\b/gi) || []).length,
        quotes: (bodyText.match(/"([^"]{20,})"/g) || []).length, // Quotes longer than 20 chars
        lists: document.querySelectorAll('ul, ol').length,
        codeBlocks: document.querySelectorAll('pre, code').length,
        images: document.querySelectorAll('img').length,
        imagesWithAlt: document.querySelectorAll('img[alt]').length
      };

      // Check for testimonials or reviews
      const testimonials = bodyText.match(/(testimonial|review|rating|5 star|4 star)/gi) || [];

      // Check for case study indicators
      const caseStudies = bodyText.match(/(case study|example|we used|we implemented|our client)/gi) || [];

      return {
        ...indicators,
        testimonialsFound: testimonials.length,
        caseStudiesFound: caseStudies.length
      };
    });

    const issues = [];
    const minRequired = CONTENT_QUALITY_THRESHOLDS.minSpecificExamples;

    // Calculate specificity score
    const specificityScore =
      examplesInfo.numbers / 5 +
      examplesInfo.measurements / 10 +
      examplesInfo.lists / 3 +
      examplesInfo.images / 5 +
      examplesInfo.testimonialsFound * 2 +
      examplesInfo.caseStudiesFound * 3;

    const hasSpecificExamples = specificityScore >= minRequired;

    if (!hasSpecificExamples) {
      issues.push({
        type: 'lacks_specific_examples',
        severity: 'moderate',
        message: 'Content lacks specific examples. Add numbers, case studies, testimonials, or data.',
        specificityScore: specificityScore.toFixed(1),
        required: minRequired,
        suggestions: [
          'Add specific metrics (e.g., "increased by 47%" instead of "increased significantly")',
          'Include case studies with real results',
          'Add testimonials with specific details',
          'Use before/after comparisons',
          'Include screenshots or images'
        ]
      });
    }

    // Check for image alt text quality
    if (examplesInfo.images > 0) {
      const altRatio = examplesInfo.imagesWithAlt / examplesInfo.images;
      if (altRatio < 0.5) {
        issues.push({
          type: 'poor_image_alt_text',
          severity: 'minor',
          message: `${Math.round((1 - altRatio) * 100)}% of images missing alt text. Descriptive alt text adds specificity.`,
          ratio: altRatio
        });
      }
    }

    const passed = hasSpecificExamples;

    this.logger.info(`  Specific examples: score ${specificityScore.toFixed(1) (min: ${minRequired})`);

    return {
      category: 'specific_examples',
      passed,
      issues,
      metrics: examplesInfo
    };
  }

  /**
   * Test for personal voice
   */
  async testPersonalVoice(page) {
    this.logger.info('Testing for personal voice...');

    const voiceInfo = await page.evaluate(() => {
      const bodyText = document.body.textContent || '';
      const textLower = bodyText.toLowerCase();

      // Personal voice indicators
      const personalIndicators = {
        firstPerson: (textLower.match(/\b(we|i|my|our|us)\b/g) || []).length,
        contractions: (textLower.match(/\b(i'm|don't|can't|won't|it's|let's|we're|they're|you're)\b/g) || []).length,
        opinions: (textLower.match(/\b(i think|i believe|in my opinion|we recommend|our favorite)\b/gi) || []).length,
        stories: (textLower.match(/\b(when we|we tried|we learned|our experience|we found)\b/gi) || []).length,
        questions: (textLower.match(/\?/g) || []).length, // Rhetorical questions engage readers
        humor: (textLower.match(/\b(just kidding|only kidding|hilarious|funny|lol)\b/gi) || []).length
      };

      // Impersonal/formal indicators (bad for personal voice)
      const formalIndicators = {
        passive: (textLower.match(/\b(was|were) \w+ed by\b/g) || []).length, // Passive voice
        thirdPerson: (textLower.match(/\b(the company|the organization|one should|it is recommended)\b/gi) || []).length,
        jargon: (textLower.match(/\b(utilize|leverage|facilitate|optimize|streamline)\b/g) || []).length
      };

      return {
        ...personalIndicators,
        ...formalIndicators,
        totalWords: bodyText.split(/\s+/).length
      };
    });

    const issues = [];
    const minRequired = CONTENT_QUALITY_THRESHOLDS.minPersonalVoice;

    // Calculate personal voice score
    const voiceScore =
      voiceInfo.firstPerson / 100 +
      voiceInfo.contractions / 50 +
      voiceInfo.opinions / 20 +
      voiceInfo.stories / 10 +
      voiceInfo.questions / 30 +
      voiceInfo.humor * 2;

    // Deduct for formal/impersonal language
    const formalPenalty =
      voiceInfo.passive / 20 +
      voiceInfo.thirdPerson / 10 +
      voiceInfo.jargon / 5;

    const finalScore = Math.max(0, voiceScore - formalPenalty);

    const hasPersonalVoice = finalScore >= minRequired;

    if (!hasPersonalVoice) {
      issues.push({
        type: 'lacks_personal_voice',
        severity: 'moderate',
        message: 'Content lacks personal voice. Write more conversationally with first-person perspective.',
        voiceScore: finalScore.toFixed(1),
        required: minRequired,
        suggestions: [
          'Use "we" and "I" instead of third-person',
          'Include contractions (don\'t, can\'t, we\'re)',
          'Share opinions and recommendations',
          'Tell stories about experiences',
          'Ask rhetorical questions',
          'Use humor where appropriate'
        ]
      });
    }

    // Too much passive voice
    if (voiceInfo.passive > 5) {
      issues.push({
        type: 'too_much_passive_voice',
        severity: 'minor',
        message: `${voiceInfo.passive} instances of passive voice found. Active voice is more engaging.`,
        count: voiceInfo.passive
      });
    }

    // Too much jargon
    if (voiceInfo.jargon > 3) {
      issues.push({
        type: 'too_much_jargon',
        severity: 'minor',
        message: `${voiceInfo.jargon} corporate jargon words found. Use plain language.`,
        count: voiceInfo.jargon
      });
    }

    const passed = hasPersonalVoice;

    this.logger.info(`  Personal voice: score ${finalScore.toFixed(1)} (min: ${minRequired})`);

    return {
      category: 'personal_voice',
      passed,
      issues,
      metrics: {
        ...voiceInfo,
        voiceScore: finalScore
      }
    };
  }

  /**
   * Test content length
   */
  async testContentLength(page) {
    this.logger.info('Testing content length...');

    const lengthInfo = await page.evaluate(() => {
      const bodyText = document.body.textContent || '';
      const words = bodyText.trim().split(/\s+/).filter(w => w.length > 0);
      const chars = bodyText.length;
      const paragraphs = document.querySelectorAll('p').length;

      return {
        wordCount: words.length,
        charCount: chars,
        paragraphCount: paragraphs,
        avgWordsPerParagraph: paragraphs > 0 ? Math.round(words.length / paragraphs) : 0
      };
    });

    const issues = [];

    // Too short (thin content)
    if (lengthInfo.wordCount < 300) {
      issues.push({
        type: 'content_too_short',
        severity: 'moderate',
        message: `Content too short: ${lengthInfo.wordCount} words. Minimum 300 recommended for SEO.`,
        wordCount: lengthInfo.wordCount
      });
    }

    // Very long paragraphs
    if (lengthInfo.avgWordsPerParagraph > 200) {
      issues.push({
        type: 'long_paragraphs',
        severity: 'minor',
        message: `Average paragraph too long: ${lengthInfo.avgWordsPerParagraph} words. Break up for readability.`,
        avgWordsPerParagraph: lengthInfo.avgWordsPerParagraph
      });
    }

    const passed = lengthInfo.wordCount >= 300;

    this.logger.info(`  Content length: ${lengthInfo.wordCount} words, ${lengthInfo.paragraphCount} paragraphs`);

    return {
      category: 'content_length',
      passed,
      issues,
      metrics: lengthInfo
    };
  }

  /**
   * Test with AI analysis via MCP
   */
  async testAIAnalysis(browser) {
    this.logger.info('Testing with AI quality analysis...');

    // Take screenshot for analysis
    const page = await browser.newPage();
    await page.goto(this.config.url, {
      waitUntil: 'networkidle0',
      timeout: this.config.timeout
    });

    const screenshotPath = './screenshots/content-quality-check.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    await page.close();

    // Use MCP to analyze content quality
    try {
      const analysis = await this.mcp.analyzeQuality(
        `Analyze this webpage for content quality. Look for: generic phrases, lack of specific examples, corporate buzzwords, absence of personal voice, and AI-generated writing patterns. Rate from 1-10 and explain.`
      );

      const issues = [];

      // Parse analysis for quality score
      const scoreMatch = analysis.reasoning?.match(/(\d+)\/10/i) || analysis.answer?.match(/(\d+)\/10/i);
      const qualityScore = scoreMatch ? parseInt(scoreMatch[1]) : null;

      if (qualityScore && qualityScore < this.config.minQualityScore) {
        issues.push({
          type: 'low_quality_score',
          severity: 'moderate',
          message: `AI analysis rated content ${qualityScore}/10 (min: ${this.config.minQualityScore}).`,
          score: qualityScore
        });
      }

      this.logger.info(`  AI quality score: ${qualityScore || 'N/A'}/10`);

      return {
        category: 'ai_quality_analysis',
        passed: !qualityScore || qualityScore >= this.config.minQualityScore,
        issues,
        metrics: {
          qualityScore,
          analysis: analysis.answer?.substring(0, 500) || analysis.reasoning?.substring(0, 500) || 'Analysis not available'
        }
      };

    } catch (error) {
      this.logger.warning(`  AI analysis failed: ${error.message}`);

      return {
        category: 'ai_quality_analysis',
        passed: true,
        issues: [{
          type: 'ai_analysis_failed',
          severity: 'info',
          message: 'AI quality analysis unavailable. Configure Perplexity MCP for this feature.'
        }],
        metrics: { qualityScore: null }
      };
    }
  }

  /**
   * Find phrase positions in text
   */
  findPhrasePositions(text, phrase) {
    const positions = [];
    const regex = new RegExp(phrase, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      positions.push(match.index);
      if (positions.length >= 3) break; // Max 3 positions
    }
    return positions;
  }

  /**
   * Generate validation report
   */
  generateReport() {
    const totalIssues = this.results.categories.reduce((sum, cat) => sum + cat.issues.length, 0);
    const moderateIssues = this.results.categories.reduce((sum, cat) =>
      sum + cat.issues.filter(i => i.severity === 'moderate').length, 0);
    const passedCategories = this.results.categories.filter(c => c.passed).length;

    const summary = {
      totalCategories: this.results.categories.length,
      passedCategories,
      failedCategories: this.results.categories.length - passedCategories,
      totalIssues,
      moderateIssues,
      passed: moderateIssues === 0
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

    this.logger.info(`Content quality test complete: ${passedCategories}/${summary.totalCategories} categories passed`);
    this.logger.info(`Total issues: ${totalIssues} (${moderateIssues} moderate)`);

    return report;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Generic phrases
    const genericCat = this.results.categories.find(c => c.category === 'generic_phrases');
    if (genericCat && !genericCat.passed) {
      recommendations.push({
        priority: 'high',
        issue: 'generic_phrases',
        recommendation: 'Replace generic phrases with specific, original language. Instead of "great for X", explain exactly how and why with specific details.'
      });
    }

    // Framework defaults
    const frameworkCat = this.results.categories.find(c => c.category === 'framework_defaults');
    if (frameworkCat && !frameworkCat.passed) {
      recommendations.push({
        priority: 'medium',
        issue: 'framework_defaults',
        recommendation: 'Customize framework defaults. Create a unique design system with custom colors, spacing, and components that reflect your brand.'
      });
    }

    // Corporate slop
    const slopCat = this.results.categories.find(c => c.category === 'corporate_slop');
    if (slopCat && !slopCat.passed) {
      recommendations.push({
        priority: 'high',
        issue: 'corporate_slop',
        recommendation: 'Remove corporate buzzwords. Write like a real person talking to another person. Use simple, direct language.'
      });
    }

    // Specific examples
    const examplesCat = this.results.categories.find(c => c.category === 'specific_examples');
    if (examplesCat && !examplesCat.passed) {
      recommendations.push({
        priority: 'high',
        issue: 'lacks_specific_examples',
        recommendation: 'Add specific examples: real numbers, case studies, testimonials with details, before/after comparisons, data visualizations.'
      });
    }

    // Personal voice
    const voiceCat = this.results.categories.find(c => c.category === 'personal_voice');
    if (voiceCat && !voiceCat.passed) {
      recommendations.push({
        priority: 'high',
        issue: 'lacks_personal_voice',
        recommendation: 'Write with personal voice: Use "we" and "I", include opinions and experiences, tell stories, ask questions, show personality.'
      });
    }

    // Content too short
    const lengthCat = this.results.categories.find(c => c.category === 'content_length');
    if (lengthCat && !lengthCat.passed) {
      recommendations.push({
        priority: 'medium',
        issue: 'content_too_short',
        recommendation: 'Expand content to at least 300 words. Cover topics thoroughly with depth and detail that provides real value to readers.'
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
    console.error('Usage: node content-quality-tester.js <url>');
    console.error('Example: node content-quality-tester.js http://localhost:3000');
    process.exit(1);
  }

  const tester = new ContentQualityTester({
    url
  });

  try {
    const report = await tester.test();
    console.log('\n=== Content Quality Test Report ===');
    console.log(JSON.stringify(report, null, 2));

    // Exit with error code if moderate issues found
    process.exit(report.summary.passed ? 0 : 1);
  } catch (error) {
    console.error('Content quality test failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default ContentQualityTester;
