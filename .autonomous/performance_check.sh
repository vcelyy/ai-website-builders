#!/bin/bash
# Performance Audit Script

echo "=== PERFORMANCE AUDIT ==="
echo ""

# Build time
echo "Build Performance:"
npm run build 2>&1 | grep -E "Completed in|built in|page\(s\)" | tail -5

echo ""
echo "Static Analysis:"

# Check for inline styles (bad for performance)
echo "- Inline style attributes:"
grep -r "style=\"" src/pages/ 2>/dev/null | grep -v "dist/" | wc -l

# Check for external scripts
echo "- External script tags:"
grep -r "<script.*src=" src/ 2>/dev/null | wc -l

# Check for preloading hints
echo "- Preload/prefetch hints:"
grep -r "rel=\"preload\"\|rel=\"prefetch\"" src/ 2>/dev/null | wc -l

# Check for lazy loading
echo "- Lazy loading attributes:"
grep -r "loading=\"lazy\"" src/ 2>/dev/null | wc -l

# Check for image optimization
echo "- WebP images or modern formats:"
find src/ -name "*.webp" -o -name "*.avif" 2>/dev/null | wc -l

# Check for CSS optimization
echo "- Inline CSS (<style> tags):"
grep -r "<style>" src/pages/ 2>/dev/null | wc -l

# Check for async/defer on scripts
echo "- Async/defer scripts:"
grep -r "async\|defer" src/layouts/*.astro 2>/dev/null | wc -l

# Check output size
echo ""
echo "Build Output Analysis:"
if [ -d "dist" ]; then
  echo "- Total dist size:"
  du -sh dist/ 2>/dev/null
  echo "- HTML files:"
  find dist/ -name "*.html" | wc -l
  echo "- CSS files:"
  find dist/ -name "*.css" | wc -l
  echo "- JS files:"
  find dist/ -name "*.js" | wc -l
fi

echo ""
echo "=== AUDIT COMPLETE ==="
