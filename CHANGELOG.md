# Changelog

All notable changes to the FleetGoo project will be documented in this file.

## [Dev] - 2025-12-23

### Added
- **Contact Form Backend**:
    - Integrated **EmailJS** for serverless email notifications (replaced mock localStorage logic).
    - Added configurable Success/Error messages in global `settings.json`.
    - implemented secure credential management using `.env`.
- **SEO / Tooling**:
    - Added `tools/generate-llms.js` to automatically generate `llms.txt` for AI crawlers (ChatGPT/Perplexity).
    - **Image Optimization Check**: Added `tools/check-image-sizes.js` to validate image file sizes before build.
        - Scans `public/images` recursively for images larger than 1MB.
        - Provides detailed statistics and optimization recommendations.
        - Integrated into `prebuild` workflow to prevent oversized images from being deployed.
        - Can be run independently with `npm run check:images`.
    - Created comprehensive `tools/README.md` documentation for all utility scripts.


### Known Issues (TODO)
- **Admin Interface**:
    - **Stats Block Background Selector**: The background field in Stats blocks may not correctly save selected values (Blue/White/Gray) to the JSON file. The `getFieldType()` function in `SchemaForm.jsx` has a potential conflict where fields containing "background" in the name are auto-detected as `color` type (line 26), which may override the explicit `select` type configuration defined in `BLOCK_TYPES` (line 84). Needs investigation to confirm if `fieldConfig` is properly passed and prioritized.
- **Tooling**:
    - `tools/generate-llms.js`: currently generates `undefined` values for some product titles/descriptions because of JSON field name mismatches. Needs to be updated to strictly map field names (e.g., `metaTitle` vs `title`) from the `public/data` schema.
    - **Localization**: Create a reusable, automated translation script (CLI tool) that connects to an LLM API to translate product JSONs from EN to other languages, replacing the manual one-off script.

## [Dev] - 2025-12-21

### Added
- **Admin Visual Editor 2.0**:
    - Introduced `SchemaForm` with intelligent field type detection.
    - Added **Contextual Help** system to guide editors on complex fields (e.g., Media Type, Layouts).
    - Added **Smart Video Preview** in the editor form: automatically renders YouTube thumbnails or HTML5 video players when a video URL is entered.
- **Live Preview Mode**: Added a "Preview" tab in the Admin Content Editor to render the actual page blocks in real-time without saving.
- **Enhanced Media Block**:
    - Native support for both local/hosted video files (`.mp4`) and YouTube embeds.
    - **Lite YouTube Player**: Implemented "Click-to-Load" strategy for YouTube embeds to improve performance and bypass browser iframe restrictions/privacy blockers.
    - Support for `youtube-nocookie.com` domain for better privacy compliance.

### Changed
- **Admin Layout**: Updated Sidebar with collapsible functionality and better file tree visualization.
- **JSON Structure**: Streamlined Solution page data model by removing legacy fields (`summary`, `overview`, `challenge`) in favor of a pure Block-based architecture.

### Fixed
- Resolved YouTube iframe connection issues in local development environments.
- Fixed `blockType` propagation bug in nested schema forms.

### Refined (2025-12-23)
- **Product Display**:
    - Updated `ProductCard` to use `aspect-square` layout and `object-contain` sizing, optimizing display for standard manufacturer images (transparent background).
    - Added image error handling with fallback placeholders.
    - Removed legacy gradient data from product JSONs to enforce design system consistency.
- **Product Details Page**:
    - Redesigned layout to a standard 2-column Ecommerce structure (Left: Images, Right: Info).
    - Optimized main image to 4:3 aspect ratio to reduce vertical scrolling.
    - Improved information hierarchy by moving "Product Overview" to the top of the details column.
- **Content & Data**:
    - **Real Product Data**: Populated product catalog with 7 real hardware products (GPS Trackers, Dashcams, AI Cameras, MDVR) replacing placeholders.
    - **SEO Optimization**: Refactored product IDs and JSON filenames to use long-tail keyword slugs (e.g., `d501-4g-dashcam-dual-lens-cloud`) for better search engine ranking.
    - **Multi-language Synchronization**: Automatically generated and translated product JSONs for Spanish (ES), Chinese (ZH), and Japanese (JP) locales.
- **Legal Pages**:
    - Implemented a unified Markdown-based legal document system (`react-markdown` + `@tailwindcss/typography`).
    - Added standard English-only Privacy Policy and Terms of Service.
    - Configured automatic multi-language fallback logic: all locales redirect legal links to the English version with a disclaimer.
- **Admin CMS**:
    - **Markdown Support**: Upgraded Content Editor to support `.md` files with a specialized Markdown Editor.
    - **Visual Editor Features**: Added Split/Preview modes, resizable panes, and bi-directional scroll synchronization for Markdown editing.
    - **Architecture**: Refactored admin logic into `useResizablePane` and `useScrollSync` custom hooks for better code reuse and maintainability.
    - **Backend API**: Updated file listing API to serve both JSON and Markdown files.
    - Refined `SchemaForm` smart detection logic to strictly identify image fields.
- **Refactoring & Localization**:
    - **Contact Form**: Abstracted form logic into a reusable `ContactForm` component, shared between Home and Contact pages.
    - **Localization**: Synchronized content structure for `about.json`, `contact.json`, `home.json`, `software.json`, and `solutions.json` across all supported languages (ES, JP, ZH), using EN as the master.
    - **Asset Organization**: Created `public/images/heros` directory for better image management and updated all references.

## [Initial Version] - 2025-12-19
- Basic Flat-File CMS architecture using Vite Middleware.
- Core Admin Dashboard with basic text editing.
- Product and Solution page templates.
