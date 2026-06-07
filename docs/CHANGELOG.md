# Changelog

All notable changes to the FleetGoo project will be documented in this file.

## [Dev] - 2026-03-31 - 技术 SEO 基础设施全面修复与根路径重定向优化

### 技术 SEO 修复 (Technical SEO Fixes)
- **robots.txt 创建**：新增 `public/robots.txt` 文件，允许所有爬虫抓取，阻止 Admin 后台路径，声明 Sitemap 位置。
- **sitemap.xml 自动生成**：
    - 开发 Astro 原生生成脚本 `tools/generate-sitemap.cjs`，替代不兼容的 vite-plugin-sitemap。
    - 集成到 `postbuild` 流程，每次构建后自动生成包含 101 个 URL 的 sitemap.xml。
    - 覆盖 4 种语言的所有核心页面：首页、产品列表、产品详情、解决方案、博客文章、法律文件。
- **结构化数据 (Schema.org JSON-LD) 全面部署**：
    - **Organization Schema**：注入全站 Layout，包含公司名称、Logo、联系方式、社交媒体链接、成立日期。
    - **WebSite Schema**：支持站内搜索动作 (SearchAction)，帮助 Google 理解网站结构。
    - **Product Schema**：为所有产品详情页添加完整产品信息，包括名称、描述、图片、品牌、制造商、特性、技术参数。

### 根路径重定向优化 (Root Path Redirects)
- **问题修复**：解决爬虫/用户访问 `fleetgoo.com/products` 等无语言前缀路径时出现 404 的问题。
- **新增重定向页面**：
    - `src/pages/products.astro` → 重定向到 `/en/products`
    - `src/pages/about-us.astro` → 重定向到 `/en/about-us`
    - `src/pages/contact.astro` → 重定向到 `/en/contact`
    - `src/pages/software.astro` → 重定向到 `/en/software`
    - `src/pages/solutions.astro` → 重定向到 `/en/solutions`
    - `src/pages/blog.astro` → 重定向到 `/en/blog`
- **SEO 优化设计**：
    - 使用 Astro 服务端 `Astro.redirect()` 实现 302 临时重定向。
    - 添加 `<meta name="robots" content="noindex">` 防止重定向页面被索引。
    - 添加 `<link rel="canonical">` 指向目标语言页面，集中 SEO 权重。
    - 包含 HTTP meta refresh 和可点击链接，确保用户体验流畅。

### 构建配置优化 (Build Configuration)
- **清理废弃依赖**：移除 `vite-plugin-sitemap` 及其相关配置代码。
- **新增 npm 脚本**：`postbuild` 钩子自动运行 sitemap 生成脚本。
- **构建输出验证**：确认 `dist/` 目录包含 `robots.txt`、`sitemap.xml` (101 个 URL) 及所有重定向页面。

### SEO 健康度提升 (SEO Health Improvement)
| 指标 | 修复前 | 修复后 |
|------|--------|--------|
| robots.txt | ❌ 404 | ✅ 正常 |
| sitemap.xml | ❌ 404 | ✅ 101 个 URL |
| Organization Schema | ❌ 缺失 | ✅ 已部署 |
| Product Schema | ❌ 缺失 | ✅ 已部署 (8 产品 × 4 语言) |
| 根路径 404 | ❌ 6 个核心路径 | ✅ 全部重定向 |

---

## [Major] - 2026-03-31 - SEO 优化与高品质多语言博客内容矩阵发布

### SEO 与用户体验增强 (SEO & UX)
- **首页 TDK 优化**：将英文首页 `metaTitle` 升级为高意向关键词组合：`AI Fleet Dashcam & GPS Tracker Solutions | FleetGoo`。
- **语义化标题重构**：修复了产品详情页跳过 H2 的问题，建立了严格的 `H1 > H2 > H3` 层级结构。
- **图片 SEO 深度优化**：
    - 为产品详情页缩略图增加了基于产品名称的动态 `alt` 描述，告别无意义的 "Thumbnail 0"。
    - 为 Hero 和 Media 等全站 Block 增加了标题降级 (`fallback`) 的 `alt` 逻辑。

### 博客内容体系全面上线 (Blog Content Matrix)
- **全语种内容矩阵**：
    - 初始化了 5 篇深度长文（涵盖选购指南、事故预防、ADAS 技术、墨西哥安全及冷链监控）。
    - 同步发布了 **EN / ZH / ES / JA** 四个语言版本，共计 **20 篇** 生产级文章。
- **AI 定制视觉稿**：利用高保真 AI 生成技术为 5 篇核心内容定制了 16:9 的专业科技风封面图，并归档至 `public/images/blog/`。
- **博客架构国际化 (i18n)**：
    - 重构了 `src/pages/[lang]/blog/index.astro`，实现文案从 `common.json` 动态读取。
    - 自定义了多语言日期格式化逻辑（CN/ES/JP/US），提升了不同国别用户的交互体验。

## [Dev] - 2026-03-31 - Admin 后台架构安全加固与生产环境隔离

### 安全与架构优化 (Security & Architecture)
- **生产环境物理隔离 (Route Exclusion)**：
    - 修改了 `src/pages/admin/[...slug].astro` 的路由生成逻辑。
    - 通过环境感知（`import.meta.env.PROD`），在生产环境构建阶段禁用了所有 Admin 相关路径的生成。
    - **效果**：部署到 Vercel 后的生产包（`dist`）不再包含任何管理后台源码，物理层面杜绝了后台暴露风险。
- **服务端 API 双层保险 (Defense in Depth)**：
    - 在 `src/lib/admin-api-plugin.js` 中增加了生产环境校验（`isProd`）。
    - 针对所有试图在非本地开发环境下进行的写操作（`POST`/`DELETE`/`PUT`）进行强制拦截。
    - **效果**：即便路由入口被意外复原，底层的本地文件系统 API 依然处于锁死状态。
- **配置与表单模块优化**：
    - 规范化了客户端环境变量前缀（从 `VITE_` 变更为 `PUBLIC_`）。
    - 修复了 Astro 客户端 Island 无法正确读取 EmailJS 凭证的问题，验证通过了全静态化环境下的在线询盘功能。

## [Major] - 2026-03-30 - Admin CMS 后台管理与 Astro Content Collections 集成

### 重大架构更新 (Architecture)
- **Astro Content Collection 集成**：
    - 正式将博客内容从旧版 JSON 数据模式迁移至 **Astro Content Collections** 架构 (`src/content/blog`)。支持多语言子目录管理 (`en`, `zh`, `es`, `ja`)。
    - 实现了 Frontmatter 严格模式校验，确保全站文章元数据（`title`, `perex`, `publishedAt` 等）的一致性，极大提升内容扩展性。
- **全新 Admin 后台管理系统**：
    - 开发了基于 Vite Middleware 的服务端 API 插件 (`src/lib/admin-api-plugin.js`)，实现了对本地文件系统（JSON, Markdown）的无损读写、图片上传、多语言管理。
    - 新增 `src/pages/admin/[...slug].astro` 作为 Admin 入口，完美复用了 React 端的 `SchemaForm` 和 `Editor` UI，实现可视化后台。
    - **安全与稳定性设计**：
        - 实现了 Markdown 手动转义补丁，自动修复 `![]()` 或 `[]()` 等会导致 Astro 构建崩溃的空语法。
        - 修复了 Vite 路由中因 `?.md` URL 参数被误判为 ESM 模块加载而导致的 ENOENT 404 错误。

### 修复与优化 (Fixed & Improved)
- **多语言底层逻辑对齐**：
    - 同步了 `public/data` 下的所有语言包（ZH, EN, ES, JA），修复了部分产品 JSON 在迁移过程中出现的非转义双引号问题及字段缺失。
- **构建脚本增强**：
    - 更新了 `package.json` 中的 `scripts`，确保预览环境可以直接访问到 `/admin/` 路径，简化联调流程。

## [Major] - 2026-03-29 - React SPA 全面迁移至 Astro SSG 架构

### 重大架构更新 (Architecture)
- **底层框架替换**：将项目的构建与路由系统从 Vite + React SPA（单页应用）全面重构为 **Astro SSG（静态站点生成器）**。保留了绝大部分既有 React UI 代码，但将其转换为 Astro 的 "Islands" 进行挂载。
- **全站静态化 (SEO 极致优化)**：
    - 将以往在客户端渲染的所有核心页面抽离成了独立的物理多语言路由：
        - `/[lang]/index.astro` (首页)
        - `/[lang]/about-us.astro` (关于我们)
        - `/[lang]/contact.astro` (联系我们)
        - `/[lang]/software.astro` (软件支持)
        - `/[lang]/products/index.astro` (产品列表)
        - `/[lang]/products/[id].astro` (海量产品详情页自动批量生成)
        - `/[lang]/solutions/index.astro` (解决方案列表)
        - `/[lang]/solutions/[id].astro` (解决方案详情页)
        - `/[lang]/[docId].astro` (多语言法务文件，如 Privacy / Terms)
    - 页面现在直接在服务器端/打包时生成完整的 HTML，对搜索引擎爬虫完全透明友好，极大提升外贸业务转化率 ("能转化" 要求)。
- **路由无痛迁移垫片**：
    - 开发并注入了全局钩子 `react-router-shim.jsx`。在摒弃了旧版 `react-router-dom` 库后，通过此垫片成功拦截了原有 UI 组件中的所有的 `<Link>`, `useNavigate`, `useParams`, `useOutletContext` 等路由请求，将它们平滑降级为浏览器原生行为，从而实现了老代码的零侵入迁移。
- **根目录自动重定向**：新增了 `src/pages/index.astro`，用于捕获访问根目录 `/` 的流量，并根据 `settings.json` 中的 `defaultLanguage` 配置进行毫秒级的 SSR 重定向，修复了根目录的 404 缺陷。

### 修复与优化 (Fixed & Improved)
- **SEO `<head>` 管理重构**：
    - 彻底剥离了遗留的 `react-helmet-async` (CommonJS 规范)。将 `<title>` 和 `<meta>` 等标签管理权限彻底交还给 Astro 原生头部渲染机制。彻底解决了因缺少上下文 Provider 而导致的 SSR 时发生 `Cannot read properties of undefined (reading 'add')` 的页面崩溃致命错误。
- **暗黑主题切换完美兼容机制 (防 FOUC 闪烁)**：
    - 给独立的组件 `ThemeToggle.jsx` 单独封装了小范围的 `ThemeProvider` 上下文。
    - 在 Astro 的总布局 `Layout.astro` 的 `<head>` 里以 `is:inline` 方式注入了同步系统明暗偏好与 localStorage 的渲染前置嗅探脚本，终结了静态生成的网站页面在刷新时会「先出刺眼白底再转黑」的问题。
- **缺失数据自动化同步**：
    - 编写了跨语言数据对齐脚本 (`syncImages.cjs`)，一键将 EN 环境下的多张商品展示大图同步并补全覆盖到了 `zh`, `es`, `ja` 的同名产品库 JSON 结构中。修复了除英文外其他语言详情页下只显示首图残缺的问题。

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
