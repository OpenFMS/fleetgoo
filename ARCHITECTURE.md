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
    *   `en/home.json`: Data for the homepage.
    *   `en/products/gps-tracker.json`: Data for specific dynamic pages.
*   **Access**: Frontend components fetch data using the `useFetchData` hook, which performs a simple `GET` request to the JSON file URL.
*   **Hot Module Replacement (HMR)**: In dev mode, Vite watchers trigger a full page reload when any JSON file in `public/data` changes, offering instant feedback.

### 4.2 Admin Middleware (`vite.config.js`)
*   **Role**: Acts as the "Backend" during development.
*   **Endpoints**:
    *   `GET /api/admin/files`: Lists available content files.
    *   `GET /api/admin/content`: Reads content of a file.
    *   `POST /api/admin/content`: Overwrites a file (Edit).
    *   `POST /api/admin/upload-image`: Saves base64 images to `public/images`.
    *   `POST /api/admin/languages`: Clones the master language folder to create a new language.
*   **Implementation**: Native Node.js `fs` module operations injected via Vite's `configureServer` hook.

### 4.3 Frontend Application (`src/`)
*   **Routing**: React Router v6 using dynamic routes (`/:lang/*`).
*   **Schema-Driven UI**: Components (like `ProductDetailPage`) are generic templates. They do not contain hardcoded content. Instead, they render whatever is provided by the JSON data model.
*   **Visual Editor Components**: Specialized components in `src/components/admin/visual/` (like `SchemaForm`, `ImagePicker`) allow non-technical users to edit JSON structures safely without touching code.

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
