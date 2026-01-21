#!/usr/bin/env node
/**
 * Security Tester - Automated Security Vulnerability Scanning
 * Checks for XSS, security headers, HTTPS, cookie security, and common vulnerabilities
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Logger } from '../lib/shared.js';
import { SECURITY_THRESHOLDS } from '../lib/quality-gates.js';
import https from 'https';
import http from 'http';
import { URL } from 'url';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

puppeteer.use(StealthPlugin());

/**
 * Security headers to check
 */
const SECURITY_HEADERS = {
  'Content-Security-Policy': {
    description: 'Prevents XSS attacks by controlling resources the browser can load',
    severity: 'high',
    recommended: true
  },
  'Strict-Transport-Security': {
    description: 'Enforces HTTPS connections',
    severity: 'high',
    recommended: true
  },
  'X-Frame-Options': {
    description: 'Prevents clickjacking attacks',
    severity: 'medium',
    recommended: true
  },
  'X-Content-Type-Options': {
    description: 'Prevents MIME sniffing',
    severity: 'medium',
    recommended: true
  },
  'X-XSS-Protection': {
    description: 'Legacy XSS protection (mostly superseded by CSP)',
    severity: 'low',
    recommended: false
  },
  'Referrer-Policy': {
    description: 'Controls referrer information sent',
    severity: 'low',
    recommended: true
  },
  'Permissions-Policy': {
    description: 'Controls browser features and APIs',
    severity: 'medium',
    recommended: true
  }
};

/**
 * Common XSS patterns to check for
 */
const XSS_PATTERNS = [
  /<script[^>]*>[\s\S]*?<\/script>/gi,
  /javascript:/gi,
  /onerror\s*=/gi,
  /onload\s*=/gi,
  /onclick\s*=/gi,
  /<iframe[^>]*>/gi,
  /eval\s*\(/gi,
  /document\.write/gi
];

export class SecurityTester {
  constructor(config = {}) {
    this.config = {
      url: config.url,
      checkHeaders: config.checkHeaders !== undefined ? config.checkHeaders : true,
      checkHTTPS: config.checkHTTPS !== undefined ? config.checkHTTPS : true,
      checkCookies: config.checkCookies !== undefined ? config.checkCookies : true,
      checkDependencies: config.checkDependencies !== undefined ? config.checkDependencies : true,
      checkXSS: config.checkXSS !== undefined ? config.checkXSS : true,
      projectPath: config.projectPath || process.cwd(),
      timeout: config.timeout || 30000
    };

    this.logger = new Logger('security-test.log');
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
    this.logger.info(`Starting Security Tester for: ${this.config.url}`);
    this.logger.info('NOTE: This is a basic security check. For production, use professional security auditing tools.');

    try {
      // Launch browser
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      // Run all test categories
      const tests = [];

      if (this.config.checkHTTPS) {
        tests.push(this.testHTTPS());
      }

      if (this.config.checkHeaders) {
        tests.push(this.testSecurityHeaders(browser));
      }

      if (this.config.checkCookies) {
        tests.push(this.testCookieSecurity(browser));
      }

      if (this.config.checkXSS) {
        tests.push(this.testXSSVulnerabilities(browser));
      }

      if (this.config.checkDependencies) {
        tests.push(this.testDependencyVulnerabilities());
      }

      tests.push(this.testMixedContent(browser));
      tests.push(this.testFormsAndInputs(browser));

      // Execute all tests
      this.results.categories = await Promise.all(tests);

      await browser.close();

      // Generate report
      return this.generateReport();

    } catch (error) {
      this.logger.error(`Security test failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test HTTPS enforcement
   */
  async testHTTPS() {
    this.logger.info('Testing HTTPS enforcement...');

    const url = new URL(this.config.url);
    const isHTTPS = url.protocol === 'https:';
    const httpURL = url.protocol.replace('https', 'http') + '//' + url.host;

    let redirectsToHTTPS = false;
    let httpStatus = null;

    if (!isHTTPS) {
      // Check if HTTP redirects to HTTPS
      try {
        const result = await this.fetchHeaders(httpURL);
        if (result.statusCode >= 300 && result.statusCode < 400) {
          const location = result.headers['location'] || '';
          if (location.startsWith('https://')) {
            redirectsToHTTPS = true;
          }
        }
        httpStatus = result.statusCode;
      } catch (error) {
        // Can't connect to HTTP
      }
    }

    const issues = [];

    if (!isHTTPS && !redirectsToHTTPS) {
      issues.push({
        type: 'no_https',
        severity: 'critical',
        message: 'Site does not use HTTPS. All data transmitted is unencrypted.',
        recommendation: 'Install SSL certificate and redirect all HTTP traffic to HTTPS.'
      });
    }

    if (!isHTTPS && redirectsToHTTPS) {
      issues.push({
        type: 'http_redirects_to_https',
        severity: 'info',
        message: 'HTTP redirects to HTTPS (good practice). Consider using HSTS header.',
        recommendation: 'Add Strict-Transport-Security header to enforce HTTPS.'
      });
    }

    const passed = isHTTPS || redirectsToHTTPS;

    this.logger.info(`  HTTPS: ${isHTTPS ? 'yes' : redirectsToHTTPS ? 'redirects' : 'no'}`);

    return {
      category: 'https',
      passed,
      issues,
      metrics: {
        isHTTPS,
        redirectsToHTTPS,
        httpStatus
      }
    };
  }

  /**
   * Test security headers
   */
  async testSecurityHeaders(browser) {
    this.logger.info('Testing security headers...');

    const page = await browser.newPage();

    // Capture response headers
    const response = await page.goto(this.config.url, {
      waitUntil: 'domcontentloaded',
      timeout: this.config.timeout
    });

    const headers = response.headers();
    const server = headers['server'] || '';

    const issues = [];
    const presentHeaders = [];

    // Check each security header
    for (const [headerName, headerInfo] of Object.entries(SECURITY_HEADERS)) {
      const headerValue = headers[headerName.toLowerCase()];

      if (headerValue) {
        presentHeaders.push({
          name: headerName,
          value: headerValue.substring(0, 100)
        });

        // Validate header value
        if (headerName === 'Content-Security-Policy') {
          // Check for unsafe-inline or unsafe-eval
          if (headerValue.includes("'unsafe-inline'")) {
            issues.push({
              type: 'csp_unsafe_inline',
              severity: 'medium',
              message: 'CSP allows unsafe-inline. Reduces XSS protection.',
              header: headerName
            });
          }
          if (headerValue.includes("'unsafe-eval'")) {
            issues.push({
              type: 'csp_unsafe_eval',
              severity: 'medium',
              message: 'CSP allows unsafe-eval. Reduces XSS protection.',
              header: headerName
            });
          }
        }

        if (headerName === 'Strict-Transport-Security') {
          // Check max-age
          const maxAgeMatch = headerValue.match(/max-age=(\d+)/);
          if (maxAgeMatch) {
            const maxAge = parseInt(maxAgeMatch[1]);
            if (maxAge < 31536000) { // Less than 1 year
              issues.push({
                type: 'hsts_low_max_age',
                severity: 'low',
                message: `HSTS max-age is ${maxAge}s (recommended: 31536000s = 1 year)`,
                header: headerName
              });
            }
          }
          if (!headerValue.includes('includeSubDomains')) {
            issues.push({
              type: 'hsts_no_subdomains',
              severity: 'info',
              message: 'HSTS does not include subdomains. Consider adding includeSubDomains.',
              header: headerName
            });
          }
        }

        if (headerName === 'X-Frame-Options') {
          if (headerValue.toLowerCase() === 'sameorigin') {
            // Good
          } else if (headerValue.toLowerCase() === 'deny') {
            // Also good
          } else {
            issues.push({
              type: 'xfo_weak_value',
              severity: 'low',
              message: `X-Frame-Options value is "${headerValue}". Recommended: DENY or SAMEORIGIN.`,
              header: headerName
            });
          }
        }
      } else if (headerInfo.recommended) {
        issues.push({
          type: 'missing_security_header',
          severity: headerInfo.severity,
          message: `Missing security header: ${headerName}. ${headerInfo.description}`,
          header: headerName,
          recommendation: this.getHeaderRecommendation(headerName)
        });
      }
    }

    // Check for information disclosure
    if (server) {
      const serverInfo = server.toLowerCase();
      if (serverInfo.includes('nginx') || serverInfo.includes('apache') || serverInfo.includes('cloudflare')) {
        issues.push({
          type: 'server_disclosure',
          severity: 'info',
          message: `Server header discloses server information: ${server}`,
          recommendation: 'Configure server to hide version information.'
        });
      }
    }

    // Check X-Powered-By (information disclosure)
    const poweredBy = headers['x-powered-by'];
    if (poweredBy) {
      issues.push({
        type: 'x_powered_by_disclosure',
        severity: 'info',
        message: `X-Powered-By header discloses technology: ${poweredBy}`,
        recommendation: 'Remove X-Powered-By header to hide technology stack.'
      });
    }

    await page.close();

    const passed = issues.filter(i => i.severity === 'critical' || i.severity === 'high').length === 0;

    this.logger.info(`  Security headers: ${presentHeaders.length}/${Object.keys(SECURITY_HEADERS).length} present`);

    return {
      category: 'security_headers',
      passed,
      issues,
      metrics: {
        presentHeaders,
        server
      }
    };
  }

  /**
   * Test cookie security
   */
  async testCookieSecurity(browser) {
    this.logger.info('Testing cookie security...');

    const page = await browser.newPage();
    await page.goto(this.config.url, {
      waitUntil: 'networkidle0',
      timeout: this.config.timeout
    });

    const cookies = await page.cookies();
    const issues = [];

    if (cookies.length === 0) {
      this.logger.info('  No cookies found');
      await page.close();

      return {
        category: 'cookie_security',
        passed: true,
        issues: [],
        metrics: { cookies: [] }
      };
    }

    // Check each cookie
    const insecureCookies = [];
    const httponlyCookies = [];
    const samesiteCookies = [];

    cookies.forEach(cookie => {
      const cookieIssues = [];

      // Check Secure flag
      if (!cookie.secure && this.config.url.startsWith('https')) {
        cookieIssues.push('missing Secure flag');
        insecureCookies.push(cookie.name);
      }

      // Check HttpOnly flag
      if (!cookie.httpOnly) {
        cookieIssues.push('missing HttpOnly flag');
        httponlyCookies.push(cookie.name);
      }

      // Check SameSite attribute
      if (!cookie.sameSite || cookie.sameSite === 'none') {
        cookieIssues.push('missing or weak SameSite attribute');
        samesiteCookies.push(cookie.name);
      }

      // Check for overly broad domain
      if (cookie.domain && cookie.domain.startsWith('.')) {
        cookieIssues.push('overly broad domain (subdomain wildcard)');
      }

      if (cookieIssues.length > 0) {
        issues.push({
          type: 'insecure_cookie',
          severity: 'medium',
          message: `Cookie "${cookie.name}" has security issues: ${cookieIssues.join(', ')}`,
          cookie: cookie.name,
          issues: cookieIssues
        });
      }
    });

    await page.close();

    const passed = insecureCookies.length === 0;

    this.logger.info(`  Cookies: ${cookies.length} total, ${insecureCookies.length} insecure`);

    return {
      category: 'cookie_security',
      passed,
      issues,
      metrics: {
        totalCookies: cookies.length,
        insecureCookies: insecureCookies.length,
        cookieNames: cookies.map(c => c.name)
      }
    };
  }

  /**
   * Test XSS vulnerabilities (basic check)
   */
  async testXSSVulnerabilities(browser) {
    this.logger.info('Testing XSS vulnerabilities...');

    const page = await browser.newPage();
    await page.goto(this.config.url, {
      waitUntil: 'networkidle0',
      timeout: this.config.timeout
    });

    // Get page content and check for XSS patterns
    const pageInfo = await page.evaluate((patterns) => {
      const html = document.documentElement.outerHTML;
      const scripts = Array.from(document.querySelectorAll('script')).map(s => s.textContent || '');

      const issues = [];

      // Check HTML for potential XSS patterns
      patterns.forEach((pattern, index) => {
        const matches = html.match(pattern);
        if (matches) {
          issues.push({
            pattern: pattern.toString(),
            count: matches.length,
            samples: matches.slice(0, 3).map(m => m.toString().substring(0, 50))
          });
        }
      });

      // Check for dangerouslySetInnerHTML or innerHTML usage in scripts
      scripts.forEach((script, index) => {
        if (script.includes('.innerHTML') || script.includes('dangerouslySetInnerHTML')) {
          issues.push({
            type: 'innerhtml_usage',
            message: `Script ${index + 1} uses innerHTML or dangerouslySetInnerHTML`,
            severity: 'medium'
          });
        }
      });

      return {
        issues,
        scriptCount: scripts.length
      };
    }, XSS_PATTERNS);

    const issues = [];

    // Check URL parameters for potential XSS
    const url = new URL(this.config.url);
    url.searchParams.forEach((value, key) => {
      XSS_PATTERNS.forEach(pattern => {
        if (pattern.test(value)) {
          issues.push({
            type: 'xss_in_parameter',
            severity: 'high',
            message: `URL parameter "${key}" contains potential XSS pattern`,
            parameter: key,
            value: value.substring(0, 50)
          });
        }
      });
    });

    // Add page analysis issues
    pageInfo.issues.forEach(issue => {
      if (!issue.type) {
        issues.push({
          type: 'potential_xss_pattern',
          severity: 'medium',
          message: `Found potential XSS pattern: ${issue.pattern}`,
          count: issue.count,
          samples: issue.samples
        });
      } else {
        issues.push(issue);
      }
    });

    await page.close();

    // Note: This is a very basic check. Real XSS testing requires specialized tools
    const passed = issues.filter(i => i.severity === 'high' || i.severity === 'critical').length === 0;

    this.logger.info(`  XSS: ${issues.length} potential issue(s) found`);

    return {
      category: 'xss',
      passed,
      issues,
      metrics: {
        scriptCount: pageInfo.scriptCount,
        note: 'Basic XSS check only. Use OWASP ZAP or Burp Suite for comprehensive testing.'
      }
    };
  }

  /**
   * Test dependency vulnerabilities (npm audit style)
   */
  async testDependencyVulnerabilities() {
    this.logger.info('Testing dependency vulnerabilities...');

    const issues = [];

    // Check for package.json
    const packageJsonPath = join(this.config.projectPath, 'package.json');
    const packageLockJsonPath = join(this.config.projectPath, 'package-lock.json');
    const yarnLockPath = join(this.config.projectPath, 'yarn.lock');

    let hasPackageJson = existsSync(packageJsonPath);
    let hasLockFile = existsSync(packageLockJsonPath) || existsSync(yarnLockPath);

    if (!hasPackageJson) {
      this.logger.info('  No package.json found (not a Node.js project?)');

      return {
        category: 'dependency_vulnerabilities',
        passed: true,
        issues: [{
          type: 'no_package_json',
          severity: 'info',
          message: 'No package.json found. This appears to be a non-Node.js project.'
        }],
        metrics: {
          hasPackageJson: false
        }
      };
    }

    if (!hasLockFile) {
      issues.push({
        type: 'no_lock_file',
        severity: 'info',
        message: 'No lock file found (package-lock.json or yarn.lock). Consider committing lock files for better security.'
      });
    }

    // Note: We can't run actual npm audit here without shell access
    // But we can report on what should be done
    issues.push({
      type: 'audit_recommendation',
      severity: 'info',
      message: 'Run "npm audit" to check for known vulnerabilities in dependencies.',
      command: 'npm audit',
      fixCommand: 'npm audit fix'
    });

    this.logger.info('  Dependencies: Run "npm audit" for vulnerability check');

    return {
      category: 'dependency_vulnerabilities',
      passed: true, // Can't actually test without npm
      issues,
      metrics: {
        hasPackageJson,
        hasLockFile
      }
    };
  }

  /**
   * Test mixed content
   */
  async testMixedContent(browser) {
    this.logger.info('Testing mixed content...');

    const page = await browser.newPage();

    // Track resource URLs
    const resourceUrls = [];
    page.on('response', async (response) => {
      resourceUrls.push(response.url());
    });

    await page.goto(this.config.url, {
      waitUntil: 'networkidle0',
      timeout: this.config.timeout
    });

    const isHTTPS = this.config.url.startsWith('https:');
    const issues = [];

    if (isHTTPS) {
      // Check for HTTP resources on HTTPS page (mixed content)
      const httpResources = resourceUrls.filter(url => url.startsWith('http:'));

      if (httpResources.length > 0) {
        issues.push({
          type: 'mixed_content',
          severity: 'medium',
          message: `${httpResources.length} HTTP resource(s) loaded on HTTPS page (mixed content).`,
          count: httpResources.length,
          samples: httpResources.slice(0, 5)
        });
      }
    }

    await page.close();

    const passed = issues.length === 0;

    this.logger.info(`  Mixed content: ${passed ? 'none' : issues[0].count + ' found'}`);

    return {
      category: 'mixed_content',
      passed,
      issues,
      metrics: {
        isHTTPS,
        totalResources: resourceUrls.length,
        httpResources: isHTTPS ? resourceUrls.filter(u => u.startsWith('http:')).length : 0
      }
    };
  }

  /**
   * Test forms and inputs for security
   */
  async testFormsAndInputs(browser) {
    this.logger.info('Testing forms and inputs...');

    const page = await browser.newPage();
    await page.goto(this.config.url, {
      waitUntil: 'networkidle0',
      timeout: this.config.timeout
    });

    const formInfo = await page.evaluate(() => {
      const forms = document.querySelectorAll('form');
      const inputs = document.querySelectorAll('input, textarea, select');

      const issues = [];

      // Check forms
      forms.forEach((form, index) => {
        const action = form.getAttribute('action') || '';
        const method = (form.getAttribute('method') || 'GET').toUpperCase();

        // Form without action might submit to current page
        if (!action) {
          issues.push({
            type: 'form_no_action',
            severity: 'info',
            message: `Form ${index + 1} has no action attribute. Will submit to current page.`
          });
        }

        // GET forms can be less secure for sensitive data
        if (method === 'GET') {
          const passwordInput = form.querySelector('input[type="password"]');
          if (passwordInput) {
            issues.push({
              type: 'password_in_get_form',
              severity: 'high',
              message: `Form ${index + 1} uses GET method with password field. Passwords will be visible in URL.`
            });
          }
        }
      });

      // Check inputs
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      passwordInputs.forEach((input, index) => {
        const form = input.closest('form');
        const hasAutocomplete = input.hasAttribute('autocomplete');

        if (!hasAutocomplete) {
          issues.push({
            type: 'password_no_autocomplete',
            severity: 'low',
            message: `Password input ${index + 1} has no autocomplete attribute. Consider autocomplete="new-password" for login forms.`
          });
        }
      });

      return {
        totalForms: forms.length,
        totalInputs: inputs.length,
        passwordInputs: passwordInputs.length,
        issues
      };
    });

    const issues = formInfo.issues;

    await page.close();

    const passed = issues.filter(i => i.severity === 'high' || i.severity === 'critical').length === 0;

    this.logger.info(`  Forms: ${formInfo.totalForms} total, ${formInfo.passwordInputs} password inputs`);

    return {
      category: 'forms_security',
      passed,
      issues,
      metrics: formInfo
    };
  }

  /**
   * Get recommendation for a security header
   */
  getHeaderRecommendation(headerName) {
    const recommendations = {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };

    return recommendations[headerName] || '';
  }

  /**
   * Fetch headers from a URL
   */
  fetchHeaders(url) {
    return new Promise((resolve) => {
      const protocol = url.startsWith('https') ? https : http;

      const req = protocol.get(url, (res) => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers
        });
      });

      req.on('error', () => {
        resolve({ statusCode: 0, headers: {} });
      });

      req.setTimeout(5000, () => {
        req.abort();
        resolve({ statusCode: 0, headers: {} });
      });
    });
  }

  /**
   * Generate validation report
   */
  generateReport() {
    const totalIssues = this.results.categories.reduce((sum, cat) => sum + cat.issues.length, 0);
    const criticalIssues = this.results.categories.reduce((sum, cat) =>
      sum + cat.issues.filter(i => i.severity === 'critical').length, 0);
    const highIssues = this.results.categories.reduce((sum, cat) =>
      sum + cat.issues.filter(i => i.severity === 'high').length, 0);
    const passedCategories = this.results.categories.filter(c => c.passed).length;

    const summary = {
      totalCategories: this.results.categories.length,
      passedCategories,
      failedCategories: this.results.categories.length - passedCategories,
      totalIssues,
      criticalIssues,
      highIssues,
      passed: criticalIssues === 0 && highIssues === 0
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

    this.logger.info(`Security test complete: ${passedCategories}/${summary.totalCategories} categories passed`);
    this.logger.info(`Total issues: ${totalIssues} (${criticalIssues} critical, ${highIssues} high)`);

    return report;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Critical security issues
    const hasNoHTTPS = this.results.categories.find(c => c.category === 'https')?.issues.some(i => i.type === 'no_https');
    if (hasNoHTTPS) {
      recommendations.push({
        priority: 'critical',
        issue: 'no_https',
        recommendation: 'Implement HTTPS immediately. Get an SSL certificate and redirect all HTTP traffic to HTTPS.'
      });
    }

    // Missing security headers
    const headersCat = this.results.categories.find(c => c.category === 'security_headers');
    const missingHeaders = headersCat?.issues.filter(i => i.type === 'missing_security_header') || [];
    if (missingHeaders.length > 0) {
      recommendations.push({
        priority: 'high',
        issue: 'missing_security_headers',
        count: missingHeaders.length,
        recommendation: `Add missing security headers: ${missingHeaders.map(h => h.header).join(', ')}. Configure in server settings or use security middleware.`
      });
    }

    // Cookie security
    const cookiesCat = this.results.categories.find(c => c.category === 'cookie_security');
    if (cookiesCat?.metrics.insecureCookies > 0) {
      recommendations.push({
        priority: 'medium',
        issue: 'insecure_cookies',
        count: cookiesCat.metrics.insecureCookies,
        recommendation: 'Secure cookies by adding Secure, HttpOnly, and SameSite attributes. Especially for session cookies.'
      });
    }

    // Mixed content
    const mixedContentCat = this.results.categories.find(c => c.category === 'mixed_content');
    if (mixedContentCat?.issues.some(i => i.type === 'mixed_content')) {
      recommendations.push({
        priority: 'medium',
        issue: 'mixed_content',
        recommendation: 'Fix mixed content by using HTTPS for all resources or adding Content-Security-Policy header with upgrade-insecure-requests.'
      });
    }

    // XSS vulnerabilities
    const xssCat = this.results.categories.find(c => c.category === 'xss');
    if (xssCat?.issues.some(i => i.severity === 'high')) {
      recommendations.push({
        priority: 'high',
        issue: 'xss_vulnerabilities',
        recommendation: 'Fix XSS vulnerabilities. Use Content-Security-Policy header, sanitize user input, use textContent instead of innerHTML.'
      });
    }

    // Password in GET form
    const formsCat = this.results.categories.find(c => c.category === 'forms_security');
    if (formsCat?.issues.some(i => i.type === 'password_in_get_form')) {
      recommendations.push({
        priority: 'high',
        issue: 'password_in_get_form',
        recommendation: 'Change form method from GET to POST for forms containing password fields.'
      });
    }

    // Dependency audit
    const depsCat = this.results.categories.find(c => c.category === 'dependency_vulnerabilities');
    if (depsCat) {
      recommendations.push({
        priority: 'medium',
        issue: 'dependency_audit',
        recommendation: 'Run "npm audit" to check for known vulnerabilities. Fix with "npm audit fix". Keep dependencies updated.'
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
  const projectPath = args[1];

  if (!url) {
    console.error('Usage: node security-tester.js <url> [project-path]');
    console.error('Example: node security-tester.js http://localhost:3000 /path/to/project');
    process.exit(1);
  }

  const tester = new SecurityTester({
    url,
    projectPath: projectPath || process.cwd()
  });

  try {
    const report = await tester.test();
    console.log('\n=== Security Test Report ===');
    console.log(JSON.stringify(report, null, 2));

    // Exit with error code if critical or high severity issues found
    process.exit(report.summary.passed ? 0 : 1);
  } catch (error) {
    console.error('Security test failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default SecurityTester;
