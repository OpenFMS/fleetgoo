const fs = require('fs');
const path = require('path');

// Configuration
const BASE_DIR = path.join(__dirname, '../public/data/en');
const VALID_TYPES = ['products', 'solutions'];

// Parse arguments
const args = process.argv.slice(2);
const typeArg = args.find(arg => arg.startsWith('--type='));

if (!typeArg) {
    console.error('Error: Please specify target type using --type=products, --type=solutions, or --type=all');
    process.exit(1);
}

const targetType = typeArg.split('=')[1];
const targets = targetType === 'all' ? VALID_TYPES : [targetType];

// Validate targets
targets.forEach(t => {
    if (!VALID_TYPES.includes(t)) {
        console.error(`Error: Invalid type '${t}'. Supported types: ${VALID_TYPES.join(', ')}`);
        process.exit(1);
    }
});

// Helper to check if file exists
function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    } catch (e) {
        return false;
    }
}

// Helper to read JSON
function readJson(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch (e) {
        console.error(`Error reading ${filePath}: ${e.message}`);
        return null;
    }
}

// Process function
function updateIndex(type) {
    console.log(`\n📦 Processing ${type}...`);

    const indexFilePath = path.join(BASE_DIR, `${type}.json`);
    const detailsDir = path.join(BASE_DIR, type);

    if (!fileExists(indexFilePath)) {
        console.error(`Index file not found: ${indexFilePath}`);
        return;
    }

    // 1. Read current index to preserve static config and existing icons
    const indexData = readJson(indexFilePath);
    if (!indexData) return;

    // Create a map of existing items for preserving custom overrides (like icons if missing in detail)
    const existingItemsMap = new Map();
    if (Array.isArray(indexData.items)) {
        indexData.items.forEach(item => {
            if (item.id) existingItemsMap.set(item.id, item);
        });
    }

    // 2. Scan details directory
    let files = [];
    try {
        files = fs.readdirSync(detailsDir).filter(f => f.endsWith('.json'));
    } catch (e) {
        console.error(`Error reading directory ${detailsDir}: ${e.message}`);
        return;
    }

    console.log(`Found ${files.length} detail files.`);

    // 3. Rebuild items array
    const newItems = [];

    files.forEach(file => {
        const filePath = path.join(detailsDir, file);
        const detail = readJson(filePath);

        if (!detail) return;

        // Determine ID: prefer internal id, fallback to filename
        const id = detail.id || path.basename(file, '.json');

        // Check existing item for fallback values
        const existingItem = existingItemsMap.get(id) || {};

        let newItem = {};

        if (type === 'products') {
            // Product Mapping
            newItem = {
                id: id,
                categoryId: detail.categoryId || existingItem.categoryId || 'uncategorized',
                title: detail.title || existingItem.title || id,
                // Use metaDesc as summary/description for list view
                description: detail.metaDesc || detail.fullDescription?.substring(0, 100) || existingItem.description || '',
                // Parse image: first from images array
                image: (detail.images && detail.images.length > 0) ? detail.images[0] : (existingItem.image || ''),
                // Icon: prefer detail, fallback to existing
                icon: detail.icon || existingItem.icon || 'Box'
            };
        } else if (type === 'solutions') {
            // Solution Mapping

            // Extract hero image
            const heroBlock = detail.blocks ? detail.blocks.find(b => b.type === 'hero') : null;
            const heroImage = heroBlock ? heroBlock.backgroundImage : '';

            newItem = {
                id: id,
                categoryId: detail.categoryId || existingItem.categoryId || 'uncategorized',
                title: detail.title || existingItem.title || id,
                summary: detail.metaDesc || existingItem.summary || '',
                // Image: hero background
                image: heroImage || existingItem.image || '',
                // Icon: prefer detail top-level icon, fallback to existing, fallback to generic
                icon: detail.icon || existingItem.icon || 'Layers',
                // Preserve color if it exists in old index, solutions often use color coding
                color: detail.color || existingItem.color || 'blue'
            };
        }

        newItems.push(newItem);
    });

    // 4. Update and Write
    indexData.items = newItems;

    try {
        fs.writeFileSync(indexFilePath, JSON.stringify(indexData, null, 2));
        console.log(`✅ Updated ${type}.json with ${newItems.length} items.`);
    } catch (e) {
        console.error(`Error writing ${indexFilePath}: ${e.message}`);
    }
}

// Execute
targets.forEach(updateIndex);
