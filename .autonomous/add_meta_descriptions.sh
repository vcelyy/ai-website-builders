#!/bin/bash
# Find comparison pages missing meta descriptions

echo "Finding comparison pages without meta descriptions..."
grep -L "description=" src/pages/comparisons/*.astro 2>/dev/null | head -20
