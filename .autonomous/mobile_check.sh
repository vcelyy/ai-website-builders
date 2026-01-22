#!/bin/bash
# Mobile Responsive Check Script

echo "=== MOBILE RESPONSIVE CHECK ==="
echo ""

# Check for responsive breakpoints
echo "Responsive Classes Check:"
echo "- sm: breakpoint usage: $(grep -r "sm:" src/pages/*.astro src/pages/**/*.astro 2>/dev/null | wc -l)"
echo "- md: breakpoint usage: $(grep -r "md:" src/pages/*.astro src/pages/**/*.astro 2>/dev/null | wc -l)"
echo "- lg: breakpoint usage: $(grep -r "lg:" src/pages/*.astro src/pages/**/*.astro 2>/dev/null | wc -l)"
echo "- xl: breakpoint usage: $(grep -r "xl:" src/pages/*.astro src/pages/**/*.astro 2>/dev/null | wc -l)"
echo ""

# Check for mobile-specific issues
echo "Mobile-Specific Checks:"

# Check for fixed widths (bad for mobile)
echo "- Fixed width classes (potential mobile issues):"
grep -r "w-\[0-9]\+px\|width: [0-9]\+px" src/pages/ 2>/dev/null | grep -v "dist/" | wc -l

# Check for overflow handling on tables
echo "- Tables with overflow handling:"
grep -r "overflow-x-auto" src/pages/comparisons/*.astro 2>/dev/null | wc -l

# Check for responsive images
echo "- Responsive image classes:"
grep -r "max-w-full\|w-full" src/pages/ 2>/dev/null | grep -v "dist/" | wc -l

# Check for tap targets (buttons should be 44px minimum)
echo "- Small buttons (potential tap target issues):"
grep -r "class=\".*px-[0-3] py-[0-3]" src/pages/ 2>/dev/null | grep -v "dist/" | wc -l

# Check for text sizes (should be 16px minimum for mobile)
echo "- Text size classes (using Tailwind scale):"
grep -r "text-xs\|text-sm\|text-base\|text-lg" src/pages/ 2>/dev/null | grep -v "dist/" | wc -l

# Check for hamburger menu or mobile navigation
echo "- Mobile navigation components:"
grep -r "mobile\|hamburger\|menu" src/layouts/*.astro src/components/*.astro 2>/dev/null | wc -l

echo ""
echo "=== CHECK COMPLETE ==="
