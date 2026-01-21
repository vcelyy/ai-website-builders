/**
 * Shared Utilities for Autonomous Website Testing Suite
 * Provides common functions used across all testers
 */

import fs from 'fs';
import path from 'path';

/**
 * Logger with levels and file output
 */
export class Logger {
  constructor(logFile = 'test-results.log') {
    this.logFile = logFile;
    this.logPath = path.join(process.cwd(), logFile);
  }

  log(message, level = 'info', context = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context
    };

    // Console output with colors
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'
    };

    const color = colors[level] || colors.info;
    console.log(`${color}[${level.toUpperCase()}]${colors.reset} ${message}`);

    // File output
    try {
      fs.appendFileSync(this.logPath, JSON.stringify(logEntry) + '\n');
    } catch (err) {
      console.error('Failed to write to log file:', err.message);
    }
  }

  info(message, context) { this.log(message, 'info', context); }
  success(message, context) { this.log(message, 'success', context); }
  warning(message, context) { this.log(message, 'warning', context); }
  error(message, context) { this.log(message, 'error', context); }
}

/**
 * File operations helper
 */
export class FileHelper {
  static ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  static readJSON(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (err) {
      throw new Error(`Failed to read JSON from ${filePath}: ${err.message}`);
    }
  }

  static writeJSON(filePath, data) {
    try {
      this.ensureDir(path.dirname(filePath));
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
      throw new Error(`Failed to write JSON to ${filePath}: ${err.message}`);
    }
  }
}

/**
 * CSS Parser for extracting and manipulating styles
 */
export class CSSHelper {
  /**
   * Parse CSS content into structured object
   */
  static parseCSS(cssContent) {
    const rules = [];
    const ruleRegex = /([^{]+)\{([^}]+)\}/g;
    let match;

    while ((match = ruleRegex.exec(cssContent)) !== null) {
      const selector = match[1].trim();
      const declarations = match[2].trim();

      const props = {};
      declarations.split(';').forEach(decl => {
        const [property, value] = decl.split(':').map(s => s?.trim());
        if (property && value) {
          props[property] = value;
        }
      });

      rules.push({ selector, properties: props });
    }

    return rules;
  }

  /**
   * Generate CSS from structured object
   */
  static generateCSS(rules) {
    return rules.map(rule => {
      const declarations = Object.entries(rule.properties)
        .map(([prop, value]) => `  ${prop}: ${value};`)
        .join(';\n');
      return `${rule.selector} {\n${declarations}\n}`;
    }).join('\n\n');
  }

  /**
   * Extract CSS value by property
   */
  static getPropertyValue(cssContent, selector, property) {
    const rules = this.parseCSS(cssContent);
    const rule = rules.find(r => r.selector === selector);
    return rule?.properties[property];
  }

  /**
   * Set CSS value by property
   */
  static setPropertyValue(cssContent, selector, property, value) {
    const rules = this.parseCSS(cssContent);
    const ruleIndex = rules.findIndex(r => r.selector === selector);

    if (ruleIndex >= 0) {
      rules[ruleIndex].properties[property] = value;
    } else {
      rules.push({ selector, properties: { [property]: value } });
    }

    return this.generateCSS(rules);
  }
}

/**
 * Version tracker for iteration history
 */
export class VersionTracker {
  constructor(componentPath) {
    this.componentPath = componentPath;
    this.versionsDir = path.join(path.dirname(componentPath), '.versions');
    FileHelper.ensureDir(this.versionsDir);
  }

  /**
   * Save a version with metadata
   */
  saveVersion(version, content, metadata = {}) {
    const versionFile = path.join(
      this.versionsDir,
      `v${version}-${Date.now()}.css`
    );

    const metaFile = path.join(
      this.versionsDir,
      `v${version}-${Date.now()}.meta.json`
    );

    fs.writeFileSync(versionFile, content);
    FileHelper.writeJSON(metaFile, {
      version,
      timestamp: new Date().toISOString(),
      ...metadata
    });

    return { versionFile, metaFile };
  }

  /**
   * Get latest version number
   */
  getLatestVersion() {
    const files = fs.readdirSync(this.versionsDir);
    const versions = files
      .filter(f => f.endsWith('.meta.json'))
      .map(f => {
        const meta = FileHelper.readJSON(path.join(this.versionsDir, f));
        return meta.version;
      });

    return versions.length > 0 ? Math.max(...versions) : 0;
  }
}

/**
 * Progress tracker for long-running operations
 */
export class ProgressTracker {
  constructor(totalSteps, logger) {
    this.totalSteps = totalSteps;
    this.currentStep = 0;
    this.logger = logger;
    this.startTime = Date.now();
  }

  advance(stepName) {
    this.currentStep++;
    const progress = Math.round((this.currentStep / this.totalSteps) * 100);
    const elapsed = Math.round((Date.now() - this.startTime) / 1000);

    this.logger.info(
      `[${this.currentStep}/${this.totalSteps}] ${stepName} (${progress}%, ${elapsed}s elapsed)`
    );
  }

  complete() {
    const elapsed = Math.round((Date.now() - this.startTime) / 1000);
    this.logger.success(`Completed in ${elapsed}s`);
  }
}

/**
 * Utility to wait for async operations
 */
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry utility for flaky operations
 */
export async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) {
        throw new Error(`Failed after ${maxAttempts} attempts: ${err.message}`);
      }
      await wait(delay * attempt);
    }
  }
}

// Export all utilities
export default {
  Logger,
  FileHelper,
  CSSHelper,
  VersionTracker,
  ProgressTracker,
  wait,
  retry
};
