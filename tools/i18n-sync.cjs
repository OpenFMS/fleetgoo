
const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_LANG = 'en';
const TARGET_LANGS = ['zh', 'es', 'jp'];
const DATA_DIR = path.join(__dirname, '../public/data');

// Helper to log with colors
const log = {
    info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
    success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
    warn: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
    error: (msg) => console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
};

// Deep merge helper
// Returns: { updatedObj, changesCount }
function syncObjectStructure(source, target) {
    let inputs = 0;

    // 1. If target is undefined/null, copy source entirely (with TODO marker)
    if (target === undefined || target === null) {
        return { updatedObj: markAsTodo(source), changesCount: 1 };
    }

    // 2. If types strictly mismatch (e.g. array vs object), force overwrite with source structure
    if (typeof source !== typeof target || Array.isArray(source) !== Array.isArray(target)) {
        return { updatedObj: markAsTodo(source), changesCount: 1 };
    }

    // 3. Handle Arrays
    // Strategy: We can't easily merge arrays by index because order matters.
    // Simple strategy: If lengths differ significantly or we want to ensure structure,
    // we iterate. But for now, let's assume we sync by block type. 
    // *Optimization for blocks*: If source has more blocks, we append new ones. 
    // If source has fewer, we warn or trim? Let's keep it safe: Append missing, don't delete.
    if (Array.isArray(source)) {
        const newArray = [...target];
        let hasChanges = false;

        // Very basic array sync: Ensure target has at least as many items as source
        // This is tricky for content arrays. We'll stick to a simpler rule:
        // If it's a list of blocks, check if we can match by 'type' or 'id'?
        // For simplicity v1: Just deep map items.

        source.forEach((item, index) => {
            if (index >= target.length) {
                // Target has fewer items, push new one from source
                newArray.push(markAsTodo(item));
                inputs++;
                hasChanges = true;
            } else {
                // Exists, recurse
                const { updatedObj, changesCount } = syncObjectStructure(item, target[index]);
                if (changesCount > 0) {
                    newArray[index] = updatedObj;
                    inputs += changesCount;
                    hasChanges = true;
                }
            }
        });

        // Optional: If target has MORE items than source? (e.g. old blocks)
        // We leave them be for safety, or we could strict sync. Let's leave them.

        return { updatedObj: newArray, changesCount: inputs };
    }

    // 4. Handle Objects
    if (typeof source === 'object') {
        const newObj = { ...target };
        let hasChanges = false;

        // Iterate keys in source
        Object.keys(source).forEach(key => {
            if (!(key in target)) {
                // Key missing in target -> Add it
                newObj[key] = markAsTodo(source[key]);
                inputs++;
                hasChanges = true;
            } else {
                // Key exists -> Recurse
                // Skip syncing certain keys that shouldn't change language-to-language if they are structural?
                // No, we recursive sync everything.
                const { updatedObj, changesCount } = syncObjectStructure(source[key], target[key]);
                if (changesCount > 0) {
                    newObj[key] = updatedObj;
                    inputs += changesCount;
                    hasChanges = true;
                }
            }
        });

        return { updatedObj: newObj, changesCount: inputs };
    }

    // 5. Primitives (Strings, Numbers, Booleans)
    // If we are here, target exists and type matches.
    // We do NOT overwrite value, because target already has a value (translated).
    return { updatedObj: target, changesCount: 0 };
}

// Helper to recursively mark strings with [TODO]
function markAsTodo(obj) {
    if (typeof obj === 'string') {
        // Don't mark URLs or technical IDs
        if (obj.startsWith('http') || obj.startsWith('/') || obj.length < 2) return obj;
        return `[TODO] ${obj}`;
    }
    if (Array.isArray(obj)) {
        return obj.map(item => markAsTodo(item));
    }
    if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        for (const key in obj) {
            newObj[key] = markAsTodo(obj[key]);
        }
        return newObj;
    }
    return obj;
}

// Main logic
function syncLanguage(targetLang) {
    const sourceDir = path.join(DATA_DIR, SOURCE_LANG);
    const targetDir = path.join(DATA_DIR, targetLang);

    if (!fs.existsSync(targetDir)) {
        log.info(`Creating directory for ${targetLang}...`);
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // Recursive directory walk
    function walkAndSync(relativeDir = '') {
        const currentSourcePath = path.join(sourceDir, relativeDir);
        const files = fs.readdirSync(currentSourcePath);

        files.forEach(file => {
            const sourcePath = path.join(currentSourcePath, file);
            const targetPath = path.join(targetDir, relativeDir, file);
            const stat = fs.statSync(sourcePath);

            if (stat.isDirectory()) {
                // Ensure subdir exists
                if (!fs.existsSync(targetPath)) {
                    fs.mkdirSync(targetPath);
                }
                walkAndSync(path.join(relativeDir, file));
            } else if (file.endsWith('.json')) {
                // It's a JSON file, let's sync
                try {
                    const sourceContent = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
                    let targetContent = {};

                    if (fs.existsSync(targetPath)) {
                        try {
                            targetContent = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
                        } catch (e) {
                            log.warn(`Target file ${targetPath} was corrupted. Overwriting.`);
                        }
                    } else {
                        log.info(`New file detected: ${path.join(relativeDir, file)} -> Syncing to ${targetLang}`);
                    }

                    const { updatedObj, changesCount } = syncObjectStructure(sourceContent, targetContent);

                    if (changesCount > 0) {
                        fs.writeFileSync(targetPath, JSON.stringify(updatedObj, null, 2));
                        log.success(`Synced ${changesCount} field(s) to ${targetLang}/${path.join(relativeDir, file)}`);
                    }
                } catch (err) {
                    log.error(`Error processing ${sourcePath}: ${err.message}`);
                }
            }
        });
    }

    walkAndSync();
}

// Entry point
log.info(`Starting i18n Sync from [${SOURCE_LANG}] to [${TARGET_LANGS.join(', ')}]`);
TARGET_LANGS.forEach(lang => {
    if (lang === SOURCE_LANG) return;
    try {
        syncLanguage(lang);
    } catch (err) {
        log.error(`Failed to sync ${lang}: ${err.message}`);
    }
});
log.success("Update complete.");
