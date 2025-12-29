#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const MAX_SIZE_MB = 1;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];

// Helper to format bytes to human-readable size
const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper to recursively scan directory for images
const scanDirectory = (dir, results = []) => {
    if (!fs.existsSync(dir)) {
        console.warn(`⚠️  Directory not found: ${dir}`);
        return results;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Recursively scan subdirectories
            scanDirectory(fullPath, results);
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();

            if (IMAGE_EXTENSIONS.includes(ext)) {
                const stats = fs.statSync(fullPath);
                results.push({
                    path: fullPath,
                    size: stats.size,
                    name: entry.name,
                    ext: ext
                });
            }
        }
    }

    return results;
};

function main() {
    const projectRoot = path.resolve(__dirname, '..');
    const imagesDir = path.join(projectRoot, 'public', 'images');

    console.log('🔍 Checking image sizes in public/images...\n');
    console.log(`📁 Scanning directory: ${imagesDir}`);
    console.log(`📏 Maximum allowed size: ${formatBytes(MAX_SIZE_BYTES)}\n`);

    // Scan all images
    const allImages = scanDirectory(imagesDir);

    if (allImages.length === 0) {
        console.log('ℹ️  No images found in public/images directory.');
        return;
    }

    // Filter images that exceed the size limit
    const oversizedImages = allImages.filter(img => img.size > MAX_SIZE_BYTES);

    // Calculate statistics
    const totalSize = allImages.reduce((sum, img) => sum + img.size, 0);
    const avgSize = totalSize / allImages.length;

    // Display results
    console.log(`📊 Statistics:`);
    console.log(`   Total images: ${allImages.length}`);
    console.log(`   Total size: ${formatBytes(totalSize)}`);
    console.log(`   Average size: ${formatBytes(avgSize)}`);
    console.log(`   Oversized images (>${MAX_SIZE_MB}MB): ${oversizedImages.length}\n`);

    if (oversizedImages.length > 0) {
        console.log(`❌ Found ${oversizedImages.length} image(s) exceeding ${MAX_SIZE_MB}MB:\n`);

        // Sort by size (largest first)
        oversizedImages.sort((a, b) => b.size - a.size);

        oversizedImages.forEach((img, index) => {
            const relativePath = path.relative(projectRoot, img.path);
            console.log(`   ${index + 1}. ${relativePath}`);
            console.log(`      Size: ${formatBytes(img.size)} (${(img.size / MAX_SIZE_BYTES).toFixed(2)}x limit)`);
            console.log('');
        });

        console.log('💡 Recommendations:');
        console.log('   • Compress images using tools like TinyPNG, ImageOptim, or squoosh.app');
        console.log('   • Convert to WebP format for better compression');
        console.log('   • Resize images to appropriate dimensions for web use');
        console.log('   • Consider using responsive images with srcset\n');

        // Exit with error code to fail build process
        process.exit(1);
    } else {
        console.log('✅ All images are within the size limit!');

        // Show largest images as a warning
        const largestImages = [...allImages]
            .sort((a, b) => b.size - a.size)
            .slice(0, 5);

        if (largestImages.length > 0 && largestImages[0].size > MAX_SIZE_BYTES * 0.7) {
            console.log('\n⚠️  Largest images (approaching limit):');
            largestImages.forEach((img, index) => {
                if (img.size > MAX_SIZE_BYTES * 0.5) {
                    const relativePath = path.relative(projectRoot, img.path);
                    console.log(`   ${index + 1}. ${relativePath} - ${formatBytes(img.size)}`);
                }
            });
        }

        process.exit(0);
    }
}

// Check if running directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
    main();
}

export { scanDirectory, formatBytes };
