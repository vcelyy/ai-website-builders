#!/bin/bash

# Affiliate Status Checker
# Shows current status of affiliate codes in the project

echo "==================================="
echo "Affiliate Status Checker"
echo "==================================="
echo ""

# Count placeholder codes
PLACEHOLDERS=$(grep -c "YOUR_CODE" src/config/affiliate-links.ts 2>/dev/null || echo "0")

echo "📊 AFFILIATE CODE STATUS"
echo "------------------------"
echo "Placeholder codes: $PLACEHOLDERS"
echo ""

if [ "$PLACEHOLDERS" -eq "0" ]; then
    echo "✅ All affiliate codes configured!"
    echo ""
    echo "Next step: Generate traffic"
else
    echo "⏳ $PLACEHOLDERS placeholder codes found"
    echo ""
    echo "Next step: Join affiliate programs"
    echo "See: AFFILIATE-SIGNUP-GUIDE.md"
fi

echo ""
echo "📋 AFFILIATE PROGRAMS"
echo "--------------------"

# Extract affiliate program names
grep -E "^\s+'[^']':\s*{" src/config/affiliate-links.ts | sed "s/.*'\([^']*\)'.*/\1/" | while read program; do
    # Check if this program has placeholder
    if grep -A 5 "'$program':" src/config/affiliate-links.ts | grep -q "YOUR_CODE"; then
        echo "❌ $program - needs signup"
    else
        echo "✅ $program - configured"
    fi
done

echo ""
echo "🔗 NEXT ACTIONS"
echo "--------------"
if [ "$PLACEHOLDERS" -gt "0" ]; then
    echo "1. Read AFFILIATE-SIGNUP-GUIDE.md"
    echo "2. Join 10Web affiliate program (70% commission!)"
    echo "3. Update src/config/affiliate-links.ts"
    echo "4. Run: npm run build"
    echo "5. Deploy: git push"
else
    echo "1. Build: npm run build"
    echo "2. Deploy: git push"
    echo "3. Share site to generate traffic"
    echo "4. Monitor affiliate dashboards"
fi

echo ""
echo "💰 REVENUE TARGET"
echo "----------------"
echo "Target: \$2,000/month"
echo "Requires: ~25 referrals @ \$80 avg commission"
echo ""
