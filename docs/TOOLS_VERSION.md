# Tools Version - ai-website-builders

> **What testing tools are deployed**

## Current Deployment

**Date:** January 18, 2026
**Version:** v2.0
**Source:** `/root/business-partner/templates/website-workflow/scripts/`

## Deployed Tools

### Visual Testers
| Tool | Lines | Status |
|------|-------|--------|
| CSS Layout Tester | 322 | ✅ |
| Image Validator | 567 | ✅ v2.0 |
| Interactive Tester | 688 | ✅ |
| Typography Checker | 742 | ✅ |
| Responsive Tester | 708 | ✅ v2.0 |
| Cross-Browser Tester | 664 | ✅ |

### Quality Testers
| Tool | Lines | Status |
|------|-------|--------|
| A11y Tester | 1020 | ✅ |
| Performance Tester | 868 | ✅ |
| SEO Tester | 986 | ✅ |
| Security Tester | 892 | ✅ |
| Content Quality Tester | NEW | ✅ NEW |

## MCP Integration

**Status:** ✅ Enabled (dual-mode: Claude Code + HTTP bridge)

**Core Changes:**
- mcp-wrapper.js: 561 lines (+284 from v1.0)
- RealMCPClient: Direct MCP access
- HTTPMCPClient: HTTP bridge mode
- MockMCPClient: Graceful fallback

## Dependencies

**package.json:**
```json
{
  "puppeteer-extra": "^3.3.6",
  "puppeteer-extra-plugin-stealth": "^2.11.2",
  "lighthouse": "^11.0.0",
  "axe-core": "^4.8.0"
}
```

## Quick Check

```bash
# Check version
wc -l scripts/lib/mcp-wrapper.js
# 561 = v2.0, 277 = v1.0

# Check MCP support
grep "RealMCPClient" scripts/lib/mcp-wrapper.js
# If found = v2.0
```

## Migration Status

- [x] Backup created
- [x] New version copied
- [x] Dependencies updated
- [x] Tests verified
- [x] Documentation updated

**Last Check:** January 18, 2026 - ✅ v2.0 deployed successfully
