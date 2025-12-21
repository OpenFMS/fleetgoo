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

## [Initial Version] - 2025-12-19
- Basic Flat-File CMS architecture using Vite Middleware.
- Core Admin Dashboard with basic text editing.
- Product and Solution page templates.
