/**
 * Quality Gates for Autonomous Website Testing Suite
 * Defines thresholds and criteria for passing tests
 */

/**
 * Core Web Vitals thresholds
 */
export const CORE_WEB_VITALS = {
  LCP: { good: 2500, needsImprovement: 4000 },  // Largest Contentful Paint (ms)
  FID: { good: 100, needsImprovement: 300 },     // First Input Delay (ms)
  CLS: { good: 0.1, needsImprovement: 0.25 }     // Cumulative Layout Shift
};

/**
 * Lighthouse score thresholds
 */
export const LIGHTHOUSE_SCORES = {
  overall: 90,           // Minimum overall score
  performance: 90,
  accessibility: 90,
  bestPractices: 90,
  seo: 80
};

/**
 * WCAG accessibility levels
 */
export const WCAG_LEVELS = {
  A: {
    contrast: '3:1',
    fontSize: 18,
    boldFontSize: 14
  },
  AA: {
    contrast: '4.5:1',
    fontSize: 16,
    boldFontSize: 12
  },
  AAA: {
    contrast: '7:1',
    fontSize: 16,
    boldFontSize: 12
  }
};

/**
 * Bundle size limits
 */
export const BUNDLE_LIMITS = {
  total: 500000,         // 500KB max total bundle
  chunk: 250000,         // 250KB max per chunk
  initial: 300000        // 300KB max initial load
};

/**
 * Image quality standards
 */
export const IMAGE_STANDARDS = {
  maxFileSize: 500000,   // 500KB max file size
  minDimensions: 72,     // Min width/height for quality
  formats: ['webp', 'jpg', 'jpeg', 'png', 'svg', 'gif'],
  requireAlt: true,
  requireResponsive: true
};

/**
 * Typography standards
 */
export const TYPOGRAPHY_STANDARDS = {
  minFontSize: 16,       // Min body text size (px)
  minLineHeight: 1.4,    // Min line height ratio
  maxLineHeight: 1.6,    // Max line height ratio
  minContrast: 4.5,      // Min contrast ratio
  maxFontSizeH1: 60,     // Max H1 size (px)
  headingScale: 1.2      // Each heading level 20% smaller
};

/**
 * Interactive element standards
 */
export const INTERACTIVE_STANDARDS = {
  minTappableSize: 44,   // Min touch target size (px)
  minFocusVisible: true,
  requireHover: true,
  requireActive: true
};

/**
 * Responsive breakpoints
 */
export const BREAKPOINTS = {
  mobile: { min: 375, max: 414 },
  tablet: { min: 768, max: 1024 },
  desktop: { min: 1280, max: 2560 }
};

/**
 * SEO requirements
 */
export const SEO_REQUIREMENTS = {
  requireTitle: true,
  titleLength: { min: 30, max: 60 },
  requireDescription: true,
  descriptionLength: { min: 120, max: 160 },
  requireOG: true,        // Open Graph tags
  requireCanonical: true,
  requireStructuredData: false,  // Optional
  maxHeadingDepth: 4      // Don't go deeper than h4
};

/**
 * Security thresholds
 */
export const SECURITY_THRESHOLDS = {
  maxVulnerabilities: {
    critical: 0,
    high: 0,
    medium: 5,
    low: 10
  },
  requireHTTPS: true,
  requireSecurityHeaders: ['CSP', 'HSTS', 'X-Frame-Options', 'X-Content-Type-Options']
};

/**
 * Content quality thresholds (anti-AI-slop)
 */
export const CONTENT_QUALITY_THRESHOLDS = {
  maxGenericPhrases: 2,          // Max occurrences of generic phrases
  maxFrameworkDefaults: 3,       // Max default Tailwind/Bootstrap classes
  maxCorporateSlop: 1,           // Max corporate buzzwords
  minSpecificExamples: 1,        // Require specific examples
  minPersonalVoice: 1            // Require personal touches
};

/**
 * Generic phrases to detect (AI slop)
 */
export const GENERIC_PHRASES = [
  'great for',
  'user-friendly',
  'powerful',
  'state-of-the-art',
  'cutting-edge',
  'innovative',
  'industry-leading',
  'world-class',
  'revolutionary'
];

/**
 * Framework defaults to detect (lazy design)
 */
export const FRAMEWORK_DEFAULTS = {
  tailwind: ['p-6', 'gap-3', 'shadow-xl', 'text-gray-600', 'bg-white'],
  bootstrap: ['#007bff', '#6c757d', '#28a745', '#17a2b8', 'card', 'navbar']
};

/**
 * Corporate slop phrases (buzzwords)
 */
export const CORPORATE_SLOP = [
  'leverage',
  'synergy',
  'innovative solutions',
  'game-changer',
  'paradigm shift',
  'best practices',
  'thought leader',
  'deep dive',
  'circle back',
  'move the needle'
];

/**
 * Quality Gate Checker
 */
export class QualityGateChecker {
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Check if result passes quality gates
   */
  check(results, category) {
    const gates = this.getGatesForCategory(category);
    const passed = [];
    const failed = [];

    for (const [gate, threshold] of Object.entries(gates)) {
      const value = this.getValue(results, gate);
      const passes = this.compare(value, threshold);

      if (passes) {
        passed.push({ gate, value, threshold });
      } else {
        failed.push({ gate, value, threshold });
      }
    }

    return {
      passed,
      failed,
      overall: failed.length === 0
    };
  }

  /**
   * Get gates for a specific category
   */
  getGatesForCategory(category) {
    switch (category) {
      case 'performance':
        return {
          lighthouse: LIGHTHOUSE_SCORES.overall,
          lcp: CORE_WEB_VITALS.LCP.good,
          fid: CORE_WEB_VITALS.FID.good,
          cls: CORE_WEB_VITALS.CLS.good
        };
      case 'accessibility':
        return {
          wcag: 'AA',
          contrast: TYPOGRAPHY_STANDARDS.minContrast
        };
      case 'seo':
        return SEO_REQUIREMENTS;
      case 'security':
        return SECURITY_THRESHOLDS;
      case 'images':
        return IMAGE_STANDARDS;
      case 'typography':
        return TYPOGRAPHY_STANDARDS;
      case 'interactive':
        return INTERACTIVE_STANDARDS;
      case 'content':
        return CONTENT_QUALITY_THRESHOLDS;
      default:
        return {};
    }
  }

  /**
   * Extract value from results
   */
  getValue(results, path) {
    const keys = path.split('.');
    let value = results;

    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = value[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Compare value to threshold
   */
  compare(value, threshold) {
    if (typeof threshold === 'object') {
      // Handle min/max thresholds
      if (threshold.min !== undefined && value < threshold.min) return false;
      if (threshold.max !== undefined && value > threshold.max) return false;
      return true;
    }

    if (typeof threshold === 'number') {
      return value >= threshold;
    }

    if (typeof threshold === 'boolean') {
      return value === threshold;
    }

    return value === threshold;
  }

  /**
   * Generate quality report
   */
  generateReport(checkResults) {
    const report = {
      timestamp: new Date().toISOString(),
      overall: checkResults.overall,
      passed: checkResults.passed.length,
      failed: checkResults.failed.length,
      details: {
        passed: checkResults.passed,
        failed: checkResults.failed
      }
    };

    return report;
  }
}

export default {
  CORE_WEB_VITALS,
  LIGHTHOUSE_SCORES,
  WCAG_LEVELS,
  BUNDLE_LIMITS,
  IMAGE_STANDARDS,
  TYPOGRAPHY_STANDARDS,
  INTERACTIVE_STANDARDS,
  BREAKPOINTS,
  SEO_REQUIREMENTS,
  SECURITY_THRESHOLDS,
  CONTENT_QUALITY_THRESHOLDS,
  GENERIC_PHRASES,
  FRAMEWORK_DEFAULTS,
  CORPORATE_SLOP,
  QualityGateChecker
};
