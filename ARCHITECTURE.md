# FleetGoo Horizons - Technical Architecture

## 1. Overview
FleetGoo Horizons is built on a **Flat-File CMS** architecture, powered by **Vite** and **React**.
It differs from traditional dynamic CMSs (like WordPress or Strapi) by removing the database and backend API requirements for the production environment. Instead, it relies on the filesystem and Git for data management, resulting in a high-performance, secure, and low-maintenance static website.

## 2. Core Philosophy
*   **Data as Code**: All site content (text, configuration, images) is stored as JSON files in the `public/data` directory.
*   **Local-First Admin**: The content management system (Admin Dashboard) runs **locally** on the developer's or content editor's machine. It utilizes the local file system (Node.js `fs`) to persist changes.
*   **Static Production**: The final build artifacts are purely static (HTML, CSS, JS, JSON). The "Admin" functionality is stripped out or disabled in production.
*   **Git-Based Versioning**: Every content change is a Git commit. This provides audit trails, rollbacks, and branch management out of the box.

## 3. System Architecture

### 3.1 Architecture Diagram
```mermaid
graph TD
    subgraph "Local Development Environment"
        DevUser[Editor / Developer]
        DevServer[Vite Dev Server (Node.js)]
        LocalFS[Local File System]
        
        DevUser -->|1. Browses /admin| DevServer
        DevServer -->|2. Serves React App| DevUser
        DevUser -->|3. Edits Content| DevServer
        DevServer -->|4. Writes API (Middleware)| LocalFS
        LocalFS -->|5. JSON Updates| Git[Git Repository]
    end

    subgraph "Build & Deploy Pipeline"
        Git -->|Push| CI[CI/CD Pipeline]
        CI -->|npm run build| Artifacts[Static Files (dist/)]
        Artifacts -->|Deploy| CDN[CDN / Web Server]
    end

    subgraph "Production Environment"
        EndUser[Visitor]
        CDN -->|Fetch JSON| EndUser
    end
```

### 3.2 Environments
| | Development | Production |
|---|---|---|
| **Server** | Vite Dev Server (Node.js) | Nginx / Vercel / Apache |
| **Data Source** | Local `public/data/*.json` | Static `public/data/*.json` |
| **Admin Access** | Available at `/admin` (Read/Write) | **Unavailable (Read-Only Static)** |
| **API** | Custom Vite Middleware (`/api/admin/*`) | None (Direct File Access) |

## 4. Key Technical Components

### 4.1 Data Layer (`public/data`)
*   **Structure**: Organized by language codes (e.g., `en/`, `zh/`).
*   **Page Models**:
    *   **Fixed Schema**: For structured entities like Products (e.g., `en/products/d510.json`). Contains specific fields (`specifications`, `gallery`).
    *   **Block-Based Schema**: For flexible marketing pages (Solutions, Landing Pages). Contains a `blocks` array, where each item defines a UI component (e.g., `hero`, `media`, `features`).
*   **Access**: Frontend components fetch data using the `useFetchData` hook.
*   **Hot Module Replacement (HMR)**: Instant feedback in dev mode when JSON files change.

### 4.2 Admin Middleware (`vite.config.js`)
*   **Role**: Acts as the "Backend" during development.
*   **Endpoints**:
    *   `GET /api/admin/files`: Lists available content files.
    *   `POST /api/admin/content`: Creates or updates files (Edit/Save).
    *   `POST /api/admin/upload-image`: Saves base64 images to `public/images`.
    *   `POST /api/admin/languages`: Clones the master language folder.
*   **Implementation**: Native Node.js `fs` operations via Vite middleware.

### 4.3 Frontend Application (`src/`)
*   **Routing**: Dynamic routes (`/:lang/*`) adapt to content availability.
*   **Block Engine**:
    *   **BlockRenderer**: The central component that iterates through the `blocks` JSON array and renders the corresponding React component.
    *   **Supported Blocks**: Hero, Media (Image/Video), Features, Stats, Pain Points, CTA, etc.
    *   **Video Support**: Native support for HTML5 video and privacy-enhanced YouTube embeds (`youtube-nocookie`) with "Lite Player" (click-to-load) optimization.

### 4.4 Admin Visual Editor (v2)
*   **Smart Schema Form**: `src/components/admin/visual/SchemaForm.jsx` automatically generates UI forms based on the data structure.
    *   **Contextual Help**: Field-level validation and help text to guide editors.
    *   **Smart Inputs**: Auto-detects image paths to show pickers, and YouTube URLs to show real-time video previews.
*   **Dual Mode Editing**:
    *   **Visual Mode**: Intuitive form-based editing.
    *   **Preview Mode**: Real-time rendering of the page within the Admin UI using the actual `BlockRenderer`.
    *   **Raw Mode**: Monaco-based code editor for power users.

## 5. Workflows

### 5.1 Content Editing
1.  Run `npm run dev`.
2.  Go to `http://localhost:3000/admin`.
3.  Select a page from the sidebar file tree.
4.  Edit text or upload images.
5.  Click "Save".
6.  Go to terminal and run `git add . && git commit -m "Update content"`.

### 5.2 Creating a New Page
1.  In Admin Sidebar, click **"New Page"**.
2.  Enter path (e.g., `en/new-page.json`).
3.  Fill in the JSON structure (matching the expected schema for the component you intend to use).
4.  If it's a "Solution" or "Product", ensure it is referenced in the list/index JSON file (e.g., `en/products.json`) so it appears in navigation lists.

### 5.3 Deployment
1.  Commit all changes to the `main` branch.
2.  CI/CD triggers `npm run build`.
3.  The `dist/` folder is uploaded to the hosting provider.

## 6. Performance Optimization

### 6.1 Current Architecture: Runtime Fetch
The application currently uses a **Client-Side Fetch** strategy:
*   **Flow**: User visits page -> Downloads HTML+JS -> JS executes -> JS fetches JSON -> Page renders.
*   **Trade-off**: High development efficiency and flexibility (Admin edits are instant) vs. slight runtime latency (milliseconds).
*   **Status**: This is performant enough for most B2B use cases due to specific caching strategies (Browser Cache + CDN).

### 6.2 Optimization Strategies (Future Proofing)

#### Strategy A: Preloading (Low Effort, High Impact)
If First Contentful Paint (FCP) needs improvement, use `<link rel="preload">` in `index.html`.
```html
<head>
    <!-- Preload critical configuration and translations -->
    <link rel="preload" href="/data/settings.json" as="fetch" crossorigin>
    <link rel="preload" href="/data/en/common.json" as="fetch" crossorigin>
</head>
```
This forces the browser to download JSON files in parallel with the JavaScript bundles, eliminating the "waterfall" delay.

#### Strategy B: Static Site Generation / SSG (Maximum Performance)
If SEO scores or absolute speed are critical, we can shift fetching to **Build Time**.
1.  **Method**: Write a Node.js script that runs before `vite build`.
2.  **Logic**: Read all JSON files in `public/data`, inject the content directly into the HTML or a global `window.__DATA__` object.
3.  **Result**: 0-latency content loading.
4.  **Trade-off**: Requires a rebuild for every text change. Admin "Save" button would strictly require a Git Commit + Deployment to be visible in production.
