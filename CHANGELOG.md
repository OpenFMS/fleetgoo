# Changelog

All notable changes to the FleetGoo Horizons project will be documented in this file.

## [Unreleased / Dev] - 2025-12-21

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
- **Admin**:
    - Refined `SchemaForm` smart detection logic to strictly identify image fields, fixing false positives for URL text fields.

## [Initial Version] - 2025-12-19
- Basic Flat-File CMS architecture using Vite Middleware.
- Core Admin Dashboard with basic text editing.
- Product and Solution page templates.
