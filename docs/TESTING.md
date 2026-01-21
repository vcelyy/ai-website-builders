# Testing Documentation - ai-website-builders

> **How and when to run tests**

## Quick Start

### Run All Tests
```bash
cd scripts
node run-all-tests.js http://localhost:3000
```

### Run Specific Tester
```bash
# Visual tests
cd scripts
node visual/css-layout-tester.js ./src/components/Hero.astro https://reference.com
node visual/image-validator.js http://localhost:3000
node visual/typography-checker.js http://localhost:3000

# Quality tests
node quality/a11y-tester.js http://localhost:3000 AA
node quality/performance-tester.js http://localhost:3000
```

## When to Run Tests

### Before Deploying
Always run full test suite before deploying to production.

### After Code Changes
Run affected tests:
- **CSS/Layout changes** → `node visual/css-layout-tester.js`
- **New images** → `node visual/image-validator.js`
- **Content changes** → `node quality/content-quality-tester.js`
- **Performance work** → `node quality/performance-tester.js`

## Test Outputs

**Location:** `./test-results/`
- `test-results.json` - Machine-readable
- `test-results.html` - Human-readable
- `screenshots/` - Visual artifacts
- `validation/` - Component validations

## Quality Gates

- **Lighthouse:** ≥ 90
- **WCAG:** AA level
- **Bundle size:** ≤ 500KB
- **Critical issues:** 0

## Troubleshooting

**Tests timing out?**
- Check dev server is running
- Increase timeout in config

**Visual tests failing?**
- Check screenshots in test-results/
- Adjust threshold if needed

**MCP errors?**
- Tools will fallback to mock mode automatically
- See TESTING_MIGRATION_GUIDE.md for setup

## Version Info

**Deployed:** v2.0 (January 18, 2026)
**Status:** ✅ Up to date

See TOOLS_VERSION.md for details.

## MCP Integration

This project can use MCP (Model Context Protocol) tools for enhanced testing:

- **Visual Diff:** Compare screenshots with pixel-perfect accuracy
- **Image Analysis:** AI-powered accessibility checking
- **Content Quality:** Anti-AI-slop detection

**Setup:** See TESTING_MIGRATION_GUIDE.md for MCP configuration.

**Auto-detection:** Tools automatically detect if MCP is available and use it. If not, they fall back to mock mode.
