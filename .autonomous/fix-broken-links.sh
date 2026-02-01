#!/bin/bash
# broken-links-fix.sh
# Automated fix for broken internal links
# Created: 2026-02-01
# Priority: Fix 18 clear redirect links, identify 19 out-of-scope links

set -e  # Exit on error

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="/root/business-projects/ai-website-builders"
SRC_DIR="$PROJECT_ROOT/src"
BACKUP_DIR="$PROJECT_ROOT/.autonomous/backups/$(date +%Y%m%d_%H%M%S)"
WORK_LOG="$PROJECT_ROOT/.autonomous/work_log.txt"
DRY_RUN=true  # Default to dry-run

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --apply)
      DRY_RUN=false
      shift
      ;;
    --help)
      echo "Usage: $0 [--apply]"
      echo ""
      echo "Options:"
      echo "  --apply    Actually apply fixes (default: dry-run)"
      echo "  --help     Show this help"
      echo ""
      echo "Examples:"
      echo "  $0              # Preview changes (dry-run)"
      echo "  $0 --apply      # Apply fixes"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}=== Broken Links Fix Script ===${NC}"
echo "Date: $(date)"
echo "Mode: $([ "$DRY_RUN" = true ] && echo 'DRY-RUN (preview)' || echo 'APPLY (will make changes)')"
echo ""

# Log start
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting broken links fix (mode: $([ "$DRY_RUN" = true ] && echo 'dry-run' || echo 'apply'))" >> "$WORK_LOG"

# Priority 1: Clear redirects (broken -> correct)
declare -A REDIRECTS=(
  ["/best-ai-website-builder-for-bloggers"]="/best-ai-website-builder-for-blogs"
  ["/best-ai-website-builder-for-cpas"]="/best-ai-website-builder-for-accountants"
  ["/best-ai-website-builder-for-designers"]="/best-ai-website-builder-for-creatives"
  ["/best-ai-website-builder-for-fashion-brands"]="/best-ai-website-builder-for-beauty-brands"
  ["/best-ai-website-builder-for-fitness-professionals"]="/best-ai-website-builder-for-fitness"
  ["/best-ai-website-builder-for-hotels"]="/best-ai-website-builder-for-real-estate"
  ["/best-ai-website-builder-for-it-consultants"]="/best-ai-website-builder-for-consultants"
  ["/best-ai-website-builder-for-lead-generation"]="/best-ai-website-builder-for-landing-pages"
  ["/best-ai-website-builder-for-small-business-owners"]="/best-ai-website-builder-for-small-business"
  ["/best-ai-website-builder-for-small-local-business"]="/best-ai-website-builder-for-small-business"
  ["/comparisons/squarespace-vs-wix-detailed"]="/comparisons/squarespace-vs-wix"
  ["/comparisons/webflow-vs-framer-detailed-v2"]="/comparisons/webflow-vs-framer"
  ["/comparisons/squarespace-vs-webflow-detailed-v2"]="/comparisons/squarespace-vs-webflow"
)

# Priority 2: Out of scope (should be removed)
declare -a OUT_OF_SCOPE=(
  "/comparisons/framer-vs-figma"
  "/comparisons/kajabi-vs-webflow"
  "/comparisons/shopify-vs-bigcommerce"
  "/comparisons/shopify-vs-squarespace"
  "/comparisons/shopify-vs-webflow"
  "/comparisons/shopify-vs-wix"
  "/comparisons/squarespace-vs-shopify"
  "/comparisons/webflow-vs-ghost"
)

# Step 1: Scan current state
echo -e "${YELLOW}Step 1: Scanning current state...${NC}"
echo ""

P1_TOTAL=0
for broken in "${!REDIRECTS[@]}"; do
  count=$(grep -r "href=\"$broken\"" "$SRC_DIR" 2>/dev/null | wc -l)
  if [ "$count" -gt 0 ]; then
    echo "  $broken → ${REDIRECTS[$broken]}: $count occurrences"
    P1_TOTAL=$((P1_TOTAL + count))
  fi
done
echo ""
echo "  Priority 1 total: $P1_TOTAL broken links to fix"
echo ""

P2_TOTAL=0
echo -e "${YELLOW}Priority 2: Out of scope (for manual review)${NC}"
for link in "${OUT_OF_SCOPE[@]}"; do
  count=$(grep -r "href=\"$link\"" "$SRC_DIR" 2>/dev/null | wc -l)
  if [ "$count" -gt 0 ]; then
    echo "  $link: $count occurrences (remove manually)"
    P2_TOTAL=$((P2_TOTAL + count))
  fi
done
echo ""
echo "  Priority 2 total: $P2_TOTAL links to remove manually"
echo ""

# Summary
echo -e "${BLUE}Summary:${NC}"
echo "  Priority 1 (auto-fix): $P1_TOTAL links"
echo "  Priority 2 (manual): $P2_TOTAL links"
echo "  Total: $((P1_TOTAL + P2_TOTAL)) links"
echo ""

# Exit if dry-run
if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}DRY-RUN MODE: No changes made${NC}"
  echo "To apply fixes, run: $0 --apply"
  exit 0
fi

# Step 2: Create backup
echo -e "${YELLOW}Step 2: Creating backup...${NC}"
mkdir -p "$BACKUP_DIR"
cp -r "$SRC_DIR" "$BACKUP_DIR/"
echo "  Backup created: $BACKUP_DIR"
echo ""

# Step 3: Apply fixes
echo -e "${YELLOW}Step 3: Applying Priority 1 fixes...${NC}"
echo ""

FIXES_APPLIED=0
for broken in "${!REDIRECTS[@]}"; do
  correct="${REDIRECTS[$broken]}"

  # Find and count files with this broken link
  files=$(grep -rl "href=\"$broken\"" "$SRC_DIR" 2>/dev/null || true)
  count=$(echo "$files" | grep -c "^" || echo "0")

  if [ "$count" -gt 0 ]; then
    echo -e "${GREEN}Fixing: $broken → $correct ($count files)${NC}"

    # Apply fix with find -exec (more robust than while read)
    echo "$files" | while IFS= read -r file; do
      if [ -n "$file" ] && [ -f "$file" ]; then
        sed -i "s|href=\"$broken\"|href=\"$correct\"|g" "$file"
        echo "  ✓ Fixed: $file"
      fi
    done

    FIXES_APPLIED=$((FIXES_APPLIED + count))
  fi
done
echo ""
echo "  Fixes applied: $FIXES_APPLIED links"
echo ""

# Step 4: Verification
echo -e "${YELLOW}Step 4: Verifying fixes...${NC}"
echo ""

REMAINING=0
for broken in "${!REDIRECTS[@]}"; do
  count=$(grep -r "href=\"$broken\"" "$SRC_DIR" 2>/dev/null | wc -l)
  if [ "$count" -gt 0 ]; then
    echo -e "${RED}  ✗ Still found: $broken ($count occurrences)${NC}"
    REMAINING=$((REMAINING + count))
  fi
done
echo ""

if [ "$REMAINING" -eq 0 ]; then
  echo -e "${GREEN}✓ All Priority 1 fixes verified!${NC}"
else
  echo -e "${RED}✗ $REMAINING broken links remain${NC}"
fi
echo ""

# Step 5: Summary
echo -e "${BLUE}=== Fix Summary ===${NC}"
echo "  Backup: $BACKUP_DIR"
echo "  Files modified: $(find "$SRC_DIR" -name "*.astro" -newer "$BACKUP_DIR/src" 2>/dev/null | wc -l)"
echo "  Links fixed: $FIXES_APPLIED"
echo "  Links remaining: $REMAINING"
echo ""

# Log completion
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Fixed $FIXES_APPLIED links, $REMAINING remaining" >> "$WORK_LOG"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup: $BACKUP_DIR" >> "$WORK_LOG"

if [ "$REMAINING" -eq 0 ]; then
  echo -e "${GREEN}✓ SUCCESS: All Priority 1 broken links fixed!${NC}"
  exit 0
else
  echo -e "${RED}✗ WARNING: Some links remain broken${NC}"
  exit 1
fi
