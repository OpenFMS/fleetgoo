import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../public/data');

const SUFFIX_TO_REMOVE = ' | FleetGoo';

function scanAndClean(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanAndClean(fullPath);
        } else if (file.endsWith('.json') && file !== 'settings.json') {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                const json = JSON.parse(content);
                let modified = false;

                // Check root level metaTitle (common in products)
                if (json.metaTitle && json.metaTitle.endsWith(SUFFIX_TO_REMOVE)) {
                    json.metaTitle = json.metaTitle.replace(SUFFIX_TO_REMOVE, '');
                    json.metaTitle = json.metaTitle.trim();
                    modified = true;
                }

                // Check nested "page" object metaTitle (common in about, contact, home)
                if (json.page && json.page.metaTitle && json.page.metaTitle.endsWith(SUFFIX_TO_REMOVE)) {
                    json.page.metaTitle = json.page.metaTitle.replace(SUFFIX_TO_REMOVE, '');
                    json.page.metaTitle = json.page.metaTitle.trim();
                    modified = true;
                }

                if (modified) {
                    fs.writeFileSync(fullPath, JSON.stringify(json, null, 2), 'utf8');
                    console.log(`✅ Cleaned: ${path.relative(rootDir, fullPath)} -> "${json.metaTitle}"`);
                }
            } catch (err) {
                console.error(`❌ Error processing ${file}:`, err.message);
            }
        }
    });
}

console.log('Starting cleanup of metaTitle suffixes...');
scanAndClean(rootDir);
console.log('Done.');
