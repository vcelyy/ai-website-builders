#!/bin/bash
# Internal Link Checker - Verify key pages exist

echo "=== INTERNAL LINK CHECK ==="
echo ""

# Check for broken internal links (referenced but don't exist)
echo "Checking key pages..."

# Key pages that should exist
key_pages=(
  "src/pages/index.astro"
  "src/pages/about.astro"
  "src/pages/reviews/index.astro"
  "src/pages/comparisons.astro"
  "src/pages/guides.astro"
  "src/pages/methodology.astro"
  "src/pages/deals/index.astro"
)

for page in "${key_pages[@]}"; do
  if [ -f "$page" ]; then
    echo "✓ EXISTS: $page"
  else
    echo "✗ MISSING: $page"
  fi
done

echo ""
echo "Checking review pages..."
reviews=(
  "10web-ai"
  "webflow-ai"
  "durable-ai"
  "framer-ai"
  "wix-ai"
  "squarespace-ai"
)

for review in "${reviews[@]}"; do
  if [ -f "src/pages/reviews/$review.astro" ]; then
    echo "✓ EXISTS: $review"
  else
    echo "✗ MISSING: $review"
  fi
done

echo ""
echo "=== CHECK COMPLETE ==="
