const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, 'public/data');
const enProductsDir = path.join(dataDir, 'en', 'products');
if (!fs.existsSync(enProductsDir)) {
    console.error("No EN products to sync from");
    process.exit(1);
}

const langs = fs.readdirSync(dataDir).filter(f => fs.statSync(path.join(dataDir, f)).isDirectory() && f !== 'en' && f !== 'admin');

fs.readdirSync(enProductsDir).forEach(file => {
    if (!file.endsWith('.json')) return;
    
    // Read English base file
    const enFilePath = path.join(enProductsDir, file);
    let enData;
    try {
        enData = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
    } catch(e) { return; }

    if (!enData.images || !Array.isArray(enData.images)) return;

    // Sync images to child languages
    langs.forEach(lang => {
        const tgtFilePath = path.join(dataDir, lang, 'products', file);
        if (fs.existsSync(tgtFilePath)) {
            try {
                const tgtData = JSON.parse(fs.readFileSync(tgtFilePath, 'utf8'));
                // Copy images exactly from english version
                tgtData.images = enData.images;
                // Add icon if missing
                if (!tgtData.icon && enData.icon) tgtData.icon = enData.icon;
                
                fs.writeFileSync(tgtFilePath, JSON.stringify(tgtData, null, 2), 'utf8');
                console.log(`Synced images for ${file} to ${lang}`);
            } catch(e) {
                console.error(`Error updating ${tgtFilePath}:`, e);
            }
        }
    });
});
