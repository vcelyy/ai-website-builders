#!/usr/bin/env node
/**
 * Batch Add Comparison Affiliate CTAs Script
 * 
 * Adds ComparisonAffiliateCTAs component to comparison pages.
 * Maps existing tools array to component format.
 */

import fs from 'fs';
import path from 'path';

const PAGES_DIR = '/root/business-projects/ai-website-builders/src/pages';
const BACKUP_DIR = '/root/business-projects/ai-website-builders/backups';

function findComparisonPages() {
  const files = fs.readdirSync(PAGES_DIR, { withFileTypes: true });
  return files
    .filter(dirent => 
      dirent.isFile() &&
      dirent.name.startsWith('best-ai-website-builder-for-') &&
      dirent.name.endsWith('.astro')
    )
    .map(dirent => dirent.name);
}

function hasComparisonCTAs(content) {
  return content.includes("from '../components/ComparisonAffiliateCTAs.astro'");
}

function addComparisonCTAs(pageFile) {
  const filePath = path.join(PAGES_DIR, pageFile);
  
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    return { success: false, error: `Failed to read: ${err.message}` };
  }
  
  if (hasComparisonCTAs(content)) {
    return { success: true, skipped: true, reason: 'Already has ComparisonAffiliateCTAs' };
  }
  
  const insertionPoint = content.lastIndexOf('</Layout>');
  if (insertionPoint === -1) {
    return { success: false, error: 'Could not find </Layout> tag' };
  }
  
  const backupPath = path.join(BACKUP_DIR, `${pageFile}.backup`);
  try {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    fs.writeFileSync(backupPath, content, 'utf-8');
  } catch (err) {
    return { success: false, error: `Failed to create backup: ${err.message}` };
  }
  
  // Add import after existing imports
  const newContent = content.replace(
    /(import\s+.*?from\s+['"].*?['"];?\s*)/,
    "$1import ComparisonAffiliateCTAs from '../components/ComparisonAffiliateCTAs.astro';\n"
  );
  
  // Insert component before </Layout>
  // Using the existing tools array from frontmatter
  const finalContent = newContent.replace(
    /(<\/Layout>)/,
    `<ComparisonAffiliateCTAs tools={tools.slice(0, 2).map(t => ({\n  name: t.name,\n  score: parseFloat(t.rating) || 0,\n  ease: 8,\n  design: 8,\n  features: 8,\n  price: '$15-50/month',\n  aiFeatures: t.aiFeatures || [],\n  bestFor: t.verdict || '',\n  strengths: t.pros || [],\n  weaknesses: t.cons || []\n})) as any} />\n\n$1`
  );
  
  try {
    fs.writeFileSync(filePath, finalContent, 'utf-8');
  } catch (err) {
    return { success: false, error: `Failed to write: ${err.message}` };
  }
  
  return { success: true, modified: true };
}

function main() {
  console.log('='.repeat(60));
  console.log('Batch Add Comparison Affiliate CTAs');
  console.log('='.repeat(60));
  console.log();
  
  const pages = findComparisonPages();
  console.log(`Found ${pages.length} comparison pages`);
  console.log();
  
  if (pages.length === 0) {
    console.log('No comparison pages found. Exiting.');
    return;
  }
  
  let modified = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const page of pages) {
    process.stdout.write(`Processing ${page}... `);
    
    const result = addComparisonCTAs(page);
    
    if (result.success) {
      if (result.skipped) {
        console.log('SKIPPED');
        skipped++;
      } else if (result.modified) {
        console.log('MODIFIED');
        modified++;
      }
    } else {
      console.log(`ERROR: ${result.error}`);
      errors++;
    }
  }
  
  console.log();
  console.log('='.repeat(60));
  console.log('Summary:');
  console.log(`  Modified: ${modified}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Errors:   ${errors}`);
  console.log('='.repeat(60));
  console.log();
  console.log(`Backups saved to: ${BACKUP_DIR}`);
}

main();
