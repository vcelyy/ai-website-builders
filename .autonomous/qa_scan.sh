#!/bin/bash
# QA Scan Script - Check for common issues

echo "=== QA SCAN REPORT ==="
echo "Date: $(date)"
echo ""

# Count pages by type
echo "PAGE COUNTS:"
echo "- Reviews: $(ls -1 src/pages/reviews/*.astro 2>/dev/null | wc -l)"
echo "- Comparisons: $(ls -1 src/pages/comparisons/*.astro 2>/dev/null | wc -l)"
echo "- Best-for: $(ls -1 src/pages/best-*.astro 2>/dev/null | wc -l)"
echo "- Guides: $(ls -1 src/pages/guides/*.astro 2>/dev/null | wc -l)"
echo "- Categories: $(ls -1 src/pages/categories/*.astro 2>/dev/null | wc -l)"
echo "- Deals: $(ls -1 src/pages/deals/*.astro 2>/dev/null | wc -l)"
echo ""

# Check for common issues
echo "COMMON ISSUE CHECKS:"

# Check for placeholder text (TODO, FIXME, PLACEHOLDER)
echo "- Placeholder text occurrences:"
grep -r "TODO\|FIXME\|PLACEHOLDER\|XXX" src/pages/*.astro src/pages/**/*.astro 2>/dev/null | wc -l

# Check for broken image references
echo "- Broken image references (missing .png/.jpg):"
grep -r "src=\".*\.(png|jpg|jpeg)\"" src/pages/ 2>/dev/null | grep -v "dist/" | wc -l

# Check for affiliate links
echo "- Pages with affiliate configuration:"
grep -r "getAffiliateCTA\|AFFILIATE_LINKS" src/pages/reviews/*.astro 2>/dev/null | wc -l

# Check for schema markup
echo "- Pages with StructuredData component:"
grep -r "StructuredData" src/pages/reviews/*.astro src/pages/comparisons/*.astro 2>/dev/null | wc -l

# Check for "My Experience" sections (authenticity)
echo "- Pages with 'My Experience' sections:"
grep -r "My Experience" src/pages/comparisons/*.astro 2>/dev/null | wc -l

# Check for proper headings
echo "- Pages without H1:"
for file in src/pages/reviews/*.astro src/pages/comparisons/*.astro; do
  if [ -f "$file" ] && ! grep -q "<h1" "$file"; then
    echo "  $file"
  fi
done | wc -l

# Check for brutal truth sections
echo "- Pages with 'The brutal truth' sections:"
grep -r "The brutal truth\|The lesson" src/pages/comparisons/*.astro 2>/dev/null | wc -l

echo ""
echo "=== SCAN COMPLETE ==="
