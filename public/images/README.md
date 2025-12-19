
# Image Asset Directory Structure

This directory (`public/images`) is used to store all static image assets for the FleetGoo website.

## Directory Guide

- **`brand/`**: Store official brand assets here.
  - Examples: `logo-light.png`, `logo-dark.png`, `logo-icon.svg`.

- **`favicons/`**: Store website favicons.
  - Examples: `favicon.ico`, `apple-touch-icon.png`, `favicon-32x32.png`.

- **`products/`**: Store high-quality product images.
  - Organization recommendation: You can put images directly here or create subfolders for specific product lines if there are many.
  - Examples: `gps-tracker-v1.jpg`, `dashcam-front.png`.

- **`solutions/`**: Store images related to solutions and industries.
  - Examples: `logistics-fleet.jpg`, `cold-chain-truck.jpg`.

- **`company/`**: Store images related to the company, team, and office.
  - Examples: `office-building.jpg`, `team-meeting.jpg`, `ceo-portrait.jpg`.

## Usage in Code

Since these files are in the `public` directory, you can reference them directly with an absolute path starting with `/`.

**Example:**
If you have a file at `public/images/brand/logo.png`, you can use it in React like this:

```jsx
<img src="/images/brand/logo.png" alt="FleetGoo Logo" />
```

## Image Optimization Tips

- Use **WebP** format for the best balance of quality and file size.
- Compress images before uploading (e.g., using TinyPNG or Squoosh).
- Ensure images have descriptive filenames for SEO (e.g., `fleet-management-dashboard.jpg` instead of `IMG_1234.jpg`).
