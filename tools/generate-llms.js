#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to read JSON safely
const readJson = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.warn(`Failed to read JSON at ${filePath}:`, e.message);
    return null;
  }
};

// Helper to walk directories
const getLanguageDirs = (dataRoot) => {
  if (!fs.existsSync(dataRoot)) return [];
  return fs.readdirSync(dataRoot, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
};

function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const dataRoot = path.join(projectRoot, 'public', 'data');
  const settingsPath = path.join(dataRoot, 'settings.json');

  // Read global settings for site URL
  const settings = readJson(settingsPath);
  const siteUrl = settings?.seo?.siteUrl || 'https://fleetgoo.com'; // Fallback
  const defaultLanguage = settings?.defaultLanguage || 'en';

  console.log(`🔍 Generating llms.txt from JSON data in: ${dataRoot}`);
  console.log(`🌐 Site URL: ${siteUrl}`);

  const pages = [];
  const languages = getLanguageDirs(dataRoot);

  for (const lang of languages) {
    const langDir = path.join(dataRoot, lang);

    // 1. Process Static Pages (Home, Contact, About)
    // Mapping: filename.json -> url_slug
    const staticMap = {
      'home.json': '', // root
      'contact.json': 'contact',
      'about.json': 'about-us',
      'software.json': 'software'
    };

    for (const [file, slug] of Object.entries(staticMap)) {
      const jsonPath = path.join(langDir, file);
      const data = readJson(jsonPath);

      if (data) {
        // Determine URL: hide /en prefix if it's the default language (optional convention),
        // but usually consistent URL structure is better. Let's stick to /lang/slug
        // Or if your site logic is / for default lang.
        // Assuming /lang/slug for now as per vite.config.js logic

        const urlPath = slug ? `/${lang}/${slug}` : `/${lang}`;

        pages.push({
          title: data.metaTitle || data.title || 'Untitled Page',
          description: data.metaDesc || data.subtitle || 'No description available',
          url: `${siteUrl}${urlPath}`,
          lang
        });
      }
    }

    // 2. Process Products (products.json)
    const productsPath = path.join(langDir, 'products.json');
    const productsData = readJson(productsPath);
    if (productsData?.items) {
      for (const item of productsData.items) {
        pages.push({
          title: item.metaTitle || item.name,
          description: item.metaDesc || item.shortDesc,
          url: `${siteUrl}/${lang}/products/${item.id}`,
          lang
        });
      }
    }

    // 3. Process Solutions (solutions.json)
    const solutionsPath = path.join(langDir, 'solutions.json');
    const solutionsData = readJson(solutionsPath);
    if (solutionsData?.items) {
      for (const item of solutionsData.items) {
        pages.push({
          title: item.metaTitle || item.title,
          description: item.metaDesc || item.subtitle,
          url: `${siteUrl}/${lang}/solutions/${item.id}`,
          lang
        });
      }
    }
  }

  if (pages.length === 0) {
    console.warn('⚠️ No pages found. Check your public/data directory structure.');
    return;
  }

  // Sort pages: Default language first, then by URL
  pages.sort((a, b) => {
    if (a.lang === defaultLanguage && b.lang !== defaultLanguage) return -1;
    if (a.lang !== defaultLanguage && b.lang === defaultLanguage) return 1;
    return a.url.localeCompare(b.url);
  });

  // Generate llms.txt content
  const header = `# FleetGoo Site Index
# Using this file, LLMs can discover the structure and content of the site.
# Generated at: ${new Date().toISOString()}

`;

  const content = pages.map(p => `- [${p.title}](${p.url}): ${p.description}`).join('\n');

  const outputPath = path.join(projectRoot, 'public', 'llms.txt');
  fs.writeFileSync(outputPath, header + content, 'utf8');

  console.log(`✅ Successfully generated llms.txt with ${pages.length} pages.`);
}

// Check if running directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  main();
}
