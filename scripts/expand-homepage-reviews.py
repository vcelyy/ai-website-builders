#!/usr/bin/env python3
"""
Extract review data from all review files and expand homepage tools array.
Then update the homepage index.astro file with all tools.
"""

import os
import re
import shutil
from pathlib import Path
from datetime import datetime

# Colors for output
GREEN = '\033[92m'
BLUE = '\033[94m'
RED = '\033[91m'
YELLOW = '\033[93m'
RESET = '\033[0m'

REVIEWS_DIR = Path('/root/business-projects/ai-website-builders/src/pages/reviews')
HOMEPAGE_FILE = Path('/root/business-projects/ai-website-builders/src/pages/index.astro')

# Backup directory
BACKUP_DIR = Path('/root/business-projects/ai-website-builders/backups')

def get_color_for_score(score):
    """Assign gradient color based on score tier."""
    if score >= 9.0:
        return 'from-orange-500 to-red-600'
    elif score >= 8.5:
        return 'from-indigo-500 to-purple-600'
    elif score >= 8.0:
        return 'from-blue-500 to-cyan-600'
    elif score >= 7.5:
        return 'from-green-500 to-emerald-600'
    elif score >= 7.0:
        return 'from-yellow-500 to-orange-600'
    else:
        return 'from-gray-500 to-gray-600'

def get_verdict_for_score(score, content):
    """Extract or generate a verdict based on score."""
    # Try to extract from review
    verdict_patterns = [
        r"verdict:\s*['\"]([^'\"]+)['\"]",
        r"description:\s*['\"]([^{']{30,80?)\.\s",
    ]

    for pattern in verdict_patterns:
        match = re.search(pattern, content, re.DOTALL)
        if match:
            verdict = match.group(1).strip()
            verdict = re.sub(r'\s+', ' ', verdict)[:55]
            return verdict

    # Fallback to score-based verdicts
    if score >= 9.0:
        return 'Best overall design quality'
    elif score >= 8.5:
        return 'Excellent choice for most'
    elif score >= 8.0:
        return 'Solid with minor drawbacks'
    elif score >= 7.5:
        return 'Good for specific use cases'
    elif score >= 7.0:
        return 'Acceptable but better exist'
    else:
        return 'Difficult to recommend'

def extract_review_data(review_file):
    """Extract score, name, verdict from a review file."""
    content = review_file.read_text()

    # Extract score from reviewData.score
    score_match = re.search(r"score:\s*['\"]([\d.]+)['\"]", content)
    if not score_match:
        return None

    score = float(score_match.group(1))

    # Extract tool name from filename
    name = review_file.stem.replace('-ai', '').replace('-', ' ').title()
    # Handle special cases
    name = name.replace('Ai', 'AI').replace('10web', '10Web')
    name = name.replace('Pineapple Builder Ai', 'Pineapple Builder')
    name = name.replace('Teleporthq', 'TeleportHQ')
    name = name.replace('Godaddy', 'GoDaddy')
    name = name.replace('Web Com', 'web.com')
    name = name.replace('Site123', 'Site123')
    name = name.replace('Ionos', 'IONOS')
    name = name.replace('Namecheap', 'Namecheap')

    # Get verdict
    verdict = get_verdict_for_score(score, content)

    # Determine slug
    slug = f"/reviews/{review_file.stem}"

    # Assign color based on score tier
    color = get_color_for_score(score)

    return {
        'name': name,
        'score': score,
        'verdict': verdict,
        'color': color,
        'slug': slug,
        'file': review_file.name
    }

def generate_tools_array(reviews):
    """Generate the tools array code for the homepage."""
    lines = ["const tools = ["]
    for r in reviews:
        lines.append(f"\t{{ name: '{r['name']}', score: {r['score']}, verdict: '{r['verdict']}', color: '{r['color']}', slug: '{r['slug']}' }},")
    lines.append("];")
    return '\n'.join(lines)

def update_homepage(reviews):
    """Update the homepage with the expanded tools array."""
    # Create backup
    BACKUP_DIR.mkdir(exist_ok=True)
    backup_file = BACKUP_DIR / f"index.astro.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    shutil.copy2(HOMEPAGE_FILE, backup_file)
    print(f"{GREEN}✓{RESET} Backup created: {backup_file.name}")

    # Read homepage
    content = HOMEPAGE_FILE.read_text()

    # Generate new tools array
    new_tools_array = generate_tools_array(reviews)

    # Find and replace the tools array
    # Pattern: from "const tools = [" to the closing "];"
    pattern = r"const tools = \[.*?\];"
    replacement = new_tools_array

    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    if new_content == content:
        print(f"{RED}✗{RESET} Failed to find tools array in homepage")
        return False

    # Write updated content
    HOMEPAGE_FILE.write_text(new_content)
    print(f"{GREEN}✓{RESET} Homepage updated with {len(reviews)} tools")
    return True

def main():
    print(f"{BLUE}=== Homepage Review Discovery Fix ==={RESET}")
    print(f"{BLUE}Extracting review data from all review files...{RESET}\n")

    # Get all review files (excluding index.astro)
    review_files = [f for f in REVIEWS_DIR.glob('*.astro') if f.name != 'index.astro']

    reviews = []
    for review_file in sorted(review_files):
        data = extract_review_data(review_file)
        if data:
            reviews.append(data)
            print(f"{GREEN}✓{RESET} {data['name']:25} | Score: {data['score']:.1f}")

    # Sort by score (descending)
    reviews.sort(key=lambda x: x['score'], reverse=True)

    print(f"\n{YELLOW}Total reviews extracted: {len(reviews)}{RESET}")

    print(f"\n{YELLOW}Top 10 by score:{RESET}")
    for i, r in enumerate(reviews[:10], 1):
        print(f"  {i:2}. {r['name']:25} | {r['score']}")

    print(f"\n{YELLOW}Previously missing from homepage:{RESET}")
    for r in reviews[10:]:
        print(f"  • {r['name']:25} | {r['score']}")

    print(f"\n{BLUE}=== Updating Homepage ==={RESET}")
    if update_homepage(reviews):
        print(f"\n{GREEN}=== Success! ==={RESET}")
        print(f"Next: Rebuild site with 'npm run build'")
    else:
        print(f"\n{RED}=== Failed ==={RESET}")
        return 1

    return 0

if __name__ == '__main__':
    exit(main())
