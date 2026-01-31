#!/usr/bin/env python3
"""
Batch Add Affiliate CTAs to Comparison Pages

Adds ComparisonAffiliateCTAs component to comparison pages that don't have it.
Creates backups before modifying any files.
"""

import os
import re
import shutil
from pathlib import Path

COMPARISONS_DIR = Path('/root/business-projects/ai-website-builders/src/pages/comparisons')
BACKUP_DIR = Path('/root/business-projects/ai-website-builders/backups/comparison-ctas')

# Statistics
stats = {
    'total': 0,
    'updated': 0,
    'skipped': 0,
    'errors': 0
}


def has_component_import(content):
    """Check if page already has ComparisonAffiliateCTAs imported"""
    return 'ComparisonAffiliateCTAs' in content


def has_component_usage(content):
    """Check if page already uses the component"""
    return '<ComparisonAffiliateCTAs' in content


def find_tools_array(content):
    """Extract the tools array from the frontmatter"""
    # Match the tools array definition
    match = re.search(r'const tools\s*=\s*\[(.*?)\];', content, re.DOTALL)
    if match:
        return match.group(0)
    return None


def find_insertion_point(content):
    """Find where to insert the component"""
    # Pattern 1: After Recommendation section
    rec_pattern = r'(<!--[\s]*Recommendation[\s]*-->[\s\S]*?</div>[\s]*>)([\s\S]*?)(<!--[\s]*(?:FAQ|Related Comparisons|REAL|PLATFORM|DECISION))'
    match = re.search(rec_pattern, content)
    if match:
        return match.end(1), 'after Recommendation'

    # Pattern 2: Before FAQ section
    faq_pattern = r'(<!--[\s]*FAQ[\s]*(?:SECTION|PATTERN))'
    match = re.search(faq_pattern, content)
    if match:
        return match.start(), 'before FAQ'

    # Pattern 3: Before closing Layout tag
    layout_pattern = r'(</Layout>)'
    match = re.search(layout_pattern, content)
    if match:
        return match.start(), 'before Layout close'

    return None, None


def add_component_to_file(filepath):
    """Add ComparisonAffiliateCTAs to a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Skip if already has component
        if has_component_import(content) or has_component_usage(content):
            return 'skipped', 'Already has component'

        # Find tools array
        tools_array = find_tools_array(content)
        if not tools_array:
            return 'skipped', 'No tools array found'

        # Find insertion point
        insert_pos, context = find_insertion_point(content)
        if not insert_pos:
            return 'skipped', 'No insertion point found'

        # Add import if needed
        if not has_component_import(content):
            # Find last import statement
            import_match = re.search(r"^(import .+;)$", content, re.MULTILINE)
            if import_match:
                last_import_end = import_match.end()
                content = (
                    content[:last_import_end] +
                    "\nimport ComparisonAffiliateCTAs from '../../components/ComparisonAffiliateCTAs.astro';" +
                    content[last_import_end:]
                )
            else:
                # Add at top of frontmatter
                content = content.replace(
                    '---\n',
                    '---\nimport ComparisonAffiliateCTAs from \'../../components/ComparisonAffiliateCTAs.astro\';\n'
                )

        # Add component usage
        component_code = '\n    <!-- Affiliate CTAs for both tools -->\n    <ComparisonAffiliateCTAs tools={tools} />\n'
        content = content[:insert_pos] + component_code + content[insert_pos:]

        # Only write if changed
        if content != original_content:
            # Create backup
            BACKUP_DIR.mkdir(parents=True, exist_ok=True)
            backup_path = BACKUP_DIR / filepath.name
            shutil.copy2(filepath, backup_path)

            # Write updated content
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

            return 'updated', f'Added CTAs ({context})'

        return 'skipped', 'No changes needed'

    except Exception as e:
        return 'error', str(e)


def main():
    print('=' * 60)
    print('Batch Add Comparison Affiliate CTAs')
    print('=' * 60)
    print()

    # Get all comparison files
    files = sorted(COMPARISONS_DIR.glob('*.astro'))
    stats['total'] = len(files)

    print(f'Found {stats["total"]} comparison files')
    print()

    if stats['total'] == 0:
        print('No comparison files found. Exiting.')
        return

    # Process each file
    for filepath in files:
        status, message = add_component_to_file(filepath)

        if status == 'updated':
            print(f'✓ {filepath.name} - {message}')
            stats['updated'] += 1
        elif status == 'skipped':
            print(f'⏭ {filepath.name} - {message}')
            stats['skipped'] += 1
        else:
            print(f'✗ {filepath.name} - ERROR: {message}')
            stats['errors'] += 1

    # Print summary
    print()
    print('=' * 60)
    print('Summary:')
    print(f'  Total:    {stats["total"]}')
    print(f'  Updated:  {stats["updated"]} ✅')
    print(f'  Skipped:  {stats["skipped"]} ⏭️')
    print(f'  Errors:   {stats["errors"]} ❌')
    print('=' * 60)
    print()

    if stats['updated'] > 0:
        print(f'✨ Successfully updated {stats["updated"]} comparison pages!')
        print()
        print('Next steps:')
        print('  1. Review the changes')
        print('  2. Build the site: cd /root/business-projects/ai-website-builders && npm run build')
        print('  3. Check a few comparison pages to verify CTAs render correctly')
        print()
        print(f'Backups saved to: {BACKUP_DIR}')
    else:
        print('ℹ️  No files were updated.')


if __name__ == '__main__':
    main()
