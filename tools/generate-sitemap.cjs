/**
 * Generate sitemap.xml for FleetGoo.com
 * Run after build: npm run build && node tools/generate-sitemap.cjs
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://www.fleetgoo.com';
const DIST_DIR = path.resolve(__dirname, '../dist');
const OUTPUT_FILE = path.join(DIST_DIR, 'sitemap.xml');

// Get all language directories
function getLanguages() {
  const dataDir = path.resolve(__dirname, '../public/data');
  if (!fs.existsSync(dataDir)) return ['en'];
  
  return fs.readdirSync(dataDir, { withFileTypes: true })
    .filter(ent => ent.isDirectory())
    .map(ent => ent.name);
}

// Get products for a language
function getProducts(lang) {
  const productsPath = path.join(__dirname, `../public/data/${lang}/products.json`);
  if (!fs.existsSync(productsPath)) return [];
  
  try {
    const data = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    return data.items?.map(item => item.id) || [];
  } catch (e) {
    console.warn(`Warning: Could not load products for ${lang}`);
    return [];
  }
}

// Get solutions for a language
function getSolutions(lang) {
  const solutionsPath = path.join(__dirname, `../public/data/${lang}/solutions.json`);
  if (!fs.existsSync(solutionsPath)) return [];
  
  try {
    const data = JSON.parse(fs.readFileSync(solutionsPath, 'utf-8'));
    return data.items?.map(item => item.id) || [];
  } catch (e) {
    console.warn(`Warning: Could not load solutions for ${lang}`);
    return [];
  }
}

// Get blog posts from content collections
function getBlogPosts() {
  const blogDir = path.join(__dirname, '../src/content/blog');
  if (!fs.existsSync(blogDir)) return {};
  
  const postsByLang = {};
  const langDirs = fs.readdirSync(blogDir, { withFileTypes: true })
    .filter(ent => ent.isDirectory());
  
  langDirs.forEach(langDir => {
    const lang = langDir.name;
    const langPath = path.join(blogDir, lang);
    const mdFiles = fs.readdirSync(langPath).filter(f => f.endsWith('.md'));
    
    postsByLang[lang] = mdFiles.map(file => file.replace('.md', ''));
  });
  
  return postsByLang;
}

// Get legal documents
function getLegalDocs() {
  const docs = ['privacy', 'terms'];
  return docs;
}

// Format date for lastmod
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Generate sitemap XML
function generateSitemap() {
  const languages = getLanguages();
  const blogPosts = getBlogPosts();
  const legalDocs = getLegalDocs();
  const today = formatDate(new Date());
  
  let urls = [];
  
  // Add root URL
  urls.push({
    loc: SITE_URL,
    changefreq: 'weekly',
    priority: '1.0',
    lastmod: today
  });
  
  // Add URLs for each language
  languages.forEach(lang => {
    // Base pages
    const basePages = ['', '/products', '/solutions', '/software', '/about-us', '/contact', '/blog'];
    basePages.forEach(page => {
      urls.push({
        loc: `${SITE_URL}/${lang}${page}`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: today
      });
    });
    
    // Product pages
    const products = getProducts(lang);
    products.forEach(productId => {
      urls.push({
        loc: `${SITE_URL}/${lang}/products/${productId}`,
        changefreq: 'weekly',
        priority: '0.7',
        lastmod: today
      });
    });
    
    // Solution pages
    const solutions = getSolutions(lang);
    solutions.forEach(solutionId => {
      urls.push({
        loc: `${SITE_URL}/${lang}/solutions/${solutionId}`,
        changefreq: 'weekly',
        priority: '0.7',
        lastmod: today
      });
    });
    
    // Blog posts
    if (blogPosts[lang]) {
      blogPosts[lang].forEach(postSlug => {
        urls.push({
          loc: `${SITE_URL}/${lang}/blog/${postSlug}`,
          changefreq: 'monthly',
          priority: '0.6',
          lastmod: today
        });
      });
    }
    
    // Legal documents
    legalDocs.forEach(doc => {
      urls.push({
        loc: `${SITE_URL}/${lang}/${doc}`,
        changefreq: 'monthly',
        priority: '0.4',
        lastmod: today
      });
    });
  });
  
  // Build XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  
  urls.forEach(url => {
    xml += `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <lastmod>${url.lastmod}</lastmod>
  </url>
`;
  });
  
  xml += `</urlset>\n`;
  
  return xml;
}

// Main execution
try {
  console.log('🔍 Generating sitemap.xml...');
  
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist/ directory not found. Run `npm run build` first.');
    process.exit(1);
  }
  
  const sitemapXml = generateSitemap();
  fs.writeFileSync(OUTPUT_FILE, sitemapXml, 'utf-8');
  
  const urlCount = (sitemapXml.match(/<url>/g) || []).length;
  console.log(`✅ Successfully generated sitemap.xml with ${urlCount} URLs.`);
  console.log(`📍 Output: ${OUTPUT_FILE}`);
} catch (error) {
  console.error('❌ Error generating sitemap:', error.message);
  process.exit(1);
}
