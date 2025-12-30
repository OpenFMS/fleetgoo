# Future Optimization & Architecture Plan

## 1. SPA to SSG Transition (Static Rendering)

**Context:**
Currently, the application is built as a Single Page Application (SPA) using Vite.
- **Behavior**: The browser loads a shell `index.html`, executes React, and then Client-Side Rendering (CSR) triggers `fetch()` requests to retrieve content from `public/data/*.json`.
- **Observation**: Even on production deployments (Vercel), network tabs show separate requests for JSON data after the initial page load.

**Optimization Goal:**
Eliminate the client-side fetch for static content to improve First Contentful Paint (FCP) and SEO, delivering fully hydrated HTML to the client.

**Strategy:**
*   **Level 1 (Immediate/Low Effort)**:
    *   **Browser Caching**: Remove the cache-busting timestamp (`?t=${Date.now()}`) from `useFetchData.js` in production builds. Allow browsers to cache the JSON files.
*   **Level 2 (Medium Effort)**:
    *   **Vite SSG**: Integrate `vite-plugin-ssr` (Vike) or `vite-ssg` to pre-render the React app into static HTML files during `npm run build`.
*   **Level 3 (High Effort/Migration)**:
    *   **Next.js / Astro**: Migrate the codebase to a framework with native Static Site Generation (SSG). Use `getStaticProps` (Next.js) or Collections (Astro) to read JSON files at build time and inline the content.

## 2. Image Optimization
- Continue enforcing WebP format for all assets.
- Ensure `width` and `height` attributes are present on all `<img>` tags to reduce Layout Shift (CLS).

## 3. Accessibility (A11y)
- Regularly audit with Google Lighthouse.
- Ensure all interactive elements (Buttons, Links) have `aria-label` or discernable text.
- Maintain WCAG AA compliance for color contrast (e.g., darker shades for text on light backgrounds).
