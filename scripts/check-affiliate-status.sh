#!/bin/bash
# Affiliate Status Checker
# Quick way to see which affiliate links are configured

echo "🔍 AFFILIATE STATUS CHECK"
echo "========================"
echo ""

# Check config file
CONFIG_FILE="src/config/affiliate-links.ts"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Config file not found: $CONFIG_FILE"
    exit 1
fi

# Count configured vs empty (more robust grep)
CONFIGURED=$(grep -E "affiliateUrl: '[^']+" "$CONFIG_FILE" 2>/dev/null | wc -l)
EMPTY=$(grep -E "affiliateUrl: ''" "$CONFIG_FILE" 2>/dev/null | wc -l)

echo "📊 STATUS:"
echo "   Configured: $CONFIGURED"
echo "   Empty: $EMPTY"
echo ""

if [ "$CONFIGURED" -eq 0 ]; then
    echo "⚠️  NO AFFILIATE LINKS CONFIGURED"
    echo ""
    echo "🚨 Your site cannot generate revenue yet!"
    echo ""
    echo "QUICK START (30 minutes):"
    echo "1. Join 10Web program: https://10web.io/affiliate-program/"
    echo "2. Get your tracking link"
    echo "3. Update: src/config/affiliate-links.ts"
    echo "4. Run: npm run build"
    echo ""
    echo "See: docs/AFFILIATE_SETUP_GUIDE.md"
else
    echo "✅ $CONFIGURED affiliate link(s) configured"
    echo ""
    echo "Tools with affiliate links:"
    grep -B 3 "affiliateUrl: '[^']+" "$CONFIG_FILE" 2>/dev/null | grep "name:" | head -10 | sed 's/.*name: /  - /'
fi

echo ""
echo "========================"
echo "Next steps:"
if [ "$CONFIGURED" -eq 0 ]; then
    echo "  → Join at least one affiliate program"
    echo "  → Update src/config/affiliate-links.ts"
else
    echo "  ✓ Add more affiliate programs"
    echo "  ✓ Deploy your site"
fi
