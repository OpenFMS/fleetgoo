# Tools Directory

This directory contains utility scripts for maintaining and optimizing the FleetGoo project.

## Available Tools

### 🖼️ check-image-sizes.js

**Purpose**: Validates that all images in `public/images` are optimized for web delivery.

**Usage**:
```bash
npm run check:images
```

**What it does**:
- Recursively scans `public/images` directory
- Identifies images larger than 1MB
- Provides detailed statistics (total images, total size, average size)
- Lists oversized images with their sizes and relative paths
- Offers optimization recommendations

**Integration**:
- Automatically runs before `npm run build` via the `prebuild` script
- Fails the build if oversized images are detected (exit code 1)
- Can be run independently for manual checks

**Output Example**:
```
📊 Statistics:
   Total images: 59
   Total size: 16.92 MB
   Average size: 293.73 KB
   Oversized images (>1MB): 4

❌ Found 4 image(s) exceeding 1MB:
   1. public/images/MyGhibli.png - 1.75 MB (1.75x limit)
   ...
```

**Recommendations when images fail**:
- Use [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/) for compression
- Convert JPEG/PNG to WebP format
- Resize images to appropriate dimensions (e.g., 1920px max width for hero images)
- Use responsive images with `srcset` for different screen sizes

---

### 📝 generate-llms.js

**Purpose**: Generates `llms.txt` file for AI crawler discovery (ChatGPT, Perplexity, etc.).

**Usage**:
```bash
node tools/generate-llms.js
```

**What it does**:
- Scans all JSON files in `public/data/{lang}/`
- Extracts page metadata (title, description, URL)
- Generates a structured index file at `public/llms.txt`
- Supports multi-language content

**Integration**:
- Automatically runs during `npm run build` via the `prebuild` script
- Uses `|| true` fallback to prevent build failures

**Known Issues**:
- May generate `undefined` values for some fields due to JSON schema mismatches
- Needs field name mapping updates (e.g., `metaTitle` vs `title`)

---

### 🔄 update-index.cjs

**Purpose**: Synchronizes index files (`products.json`, `solutions.json`) with their detail pages.

**Usage**:
```bash
# Update products index
npm run content:index -- --type=products

# Update solutions index
npm run content:index -- --type=solutions

# Update all indexes
npm run content:index -- --type=all
```

**What it does**:
- Scans detail JSON files in `public/data/en/{products|solutions}/`
- Extracts metadata (id, title, description, image, icon)
- Updates the corresponding index file
- Preserves existing custom overrides (e.g., manually set icons)

**Use Cases**:
- After adding new product/solution detail pages
- After updating metadata in detail files
- To ensure index and detail data stay in sync

---

### 🌐 i18n-sync.cjs

**Purpose**: Synchronizes content structure across all language versions.

**Usage**:
```bash
npm run content:sync
```

**What it does**:
- Uses English (`en`) as the master source
- Copies content structure to other languages (ES, JP, ZH)
- Preserves existing translations where they exist
- Ensures all languages have the same content schema

**Use Cases**:
- After adding new content fields in English
- After restructuring JSON schemas
- Before manual translation work

**Combined Workflow**:
```bash
# Update indexes and sync languages in one command
npm run content:all
```

---

### 🧹 clean-meta-titles.js

**Purpose**: Cleans up and standardizes meta titles across content files.

**Usage**:
```bash
node tools/clean-meta-titles.js
```

**What it does**:
- Removes redundant keywords from meta titles
- Ensures consistent formatting
- Optimizes for SEO best practices

---

## Build Workflow

When you run `npm run build`, the following happens:

1. **`prebuild` script runs**:
   - ✅ `check-image-sizes.js` - Validates image sizes (fails build if oversized)
   - ✅ `generate-llms.js` - Generates AI crawler index

2. **`build` script runs**:
   - ✅ `vite build` - Builds the production bundle

## Development Best Practices

### Before Committing
```bash
# Check for oversized images
npm run check:images

# Update content indexes
npm run content:all
```

### Before Deploying
```bash
# Full build (includes all checks)
npm run build
```

### Adding New Content
```bash
# 1. Add/edit detail JSON files
# 2. Update indexes
npm run content:index -- --type=all

# 3. Sync to other languages
npm run content:sync

# 4. Verify images
npm run check:images
```

## Configuration

### Image Size Limit
To change the maximum allowed image size, edit `tools/check-image-sizes.js`:

```javascript
const MAX_SIZE_MB = 1; // Change this value
```

### Supported Image Formats
Currently supported: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`, `.bmp`, `.ico`

To add more formats, edit the `IMAGE_EXTENSIONS` array in `check-image-sizes.js`.

---

## Troubleshooting

**Q: Build fails with "Found X oversized images"**
- A: Compress the listed images using recommended tools, or increase `MAX_SIZE_MB` if necessary

**Q: `generate-llms.js` shows undefined values**
- A: Check that your JSON files have the expected field names (`metaTitle`, `metaDesc`, etc.)

**Q: Content not syncing across languages**
- A: Ensure English (`en`) files are properly structured first, then run `npm run content:sync`

---

## Contributing

When adding new tools:
1. Use ES modules (`.js`) or CommonJS (`.cjs`) as appropriate
2. Add executable permissions: `chmod +x tools/your-tool.js`
3. Add shebang: `#!/usr/bin/env node`
4. Document in this README
5. Add npm script in `package.json` if appropriate
