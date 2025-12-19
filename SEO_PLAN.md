# FleetGoo Horizons SEO 优化方案

为了确保 FleetGoo 独立站在发布到 Vercel 后能够获得最佳的搜索引擎排名（尤其是 Google），并有效引流，我们需要从 **技术架构**、**内容策略**、**结构化数据** 和 **性能优化** 四个维度进行全面升级。

以下是针对当前 React + Vite 架构的详细优化建议：

## 1. 🚨 核心架构升级：URL 驱动的多语言路由 (关键)

**当前问题**：
目前语言切换仅通过 React `useState` 管理，URL 不会发生变化（例如 `/products`在所有语言下 URL 都一样）。
**后果**：搜索引擎爬虫（Googlebot）通常只抓取默认语言（英文），无法索引西班牙语和中文页面，导致多语言 SEO 完全失效。

**改造方案**：
必须将语言状态提升到 URL 路径中。

*   **旧结构**: `domain.com/products` (内部 state 切换语言)
*   **新结构**:
    *   `domain.com/en/products` (英语)
    *   `domain.com/es/products` (西班牙语)
    *   `domain.com/zh/products` (中文)
    *   `domain.com/` -> 自动重定向到用户首选语言或默认为 `/en/`

**实施建议**:
使用 `react-router-dom` 的动态路由功能，将 `<Routes>` 包裹在 `/:lang` 参数下。

## 2. 元数据管理 (Meta Tags & Open Graph)

当前页面缺乏针对每页的独立 Title 和 Meta Description。这会导致搜索结果显示重复或不相关的信息。

**实施建议**:
1.  安装 `react-helmet-async` (比 `react-helmet` 对异步渲染支持更好)。
2.  在每个页面组件(`HomePage`, `ProductsPage` 等)顶部添加 SEO 头信息。
3.  **Open Graph (OG) 协议**: 为了在 LinkedIn, Twitter, Facebook 分享时显示漂亮的卡片，必须添加 `og:image`, `og:title`, `og:description`。

```jsx
<Helmet>
  <title>Fleet Management Solutions | FleetGoo Horizons</title>
  <meta name="description" content="AI-powered fleet management systems, dashcams, and software platforms for commercial fleets." />
  <link rel="canonical" href="https://fleetgoo.com/en/" />
  
  {/* Open Graph / Social Media */}
  <meta property="og:type" content="website" />
  <meta property="og:title" content="FleetGoo AI Fleet Solutions" />
  <meta property="og:image" content="https://fleetgoo.com/og-share-image.jpg" />
</Helmet>
```

## 3. `hreflang` 标签 (国际化 SEO 核心)

告诉 Google 不同 URL 对应的是同一个内容的哪种语言版本，防止被判定为重复内容。

**代码示例**:
```html
<link rel="alternate" hreflang="en" href="https://fleetgoo.com/en/" />
<link rel="alternate" hreflang="es" href="https://fleetgoo.com/es/" />
<link rel="alternate" hreflang="zh" href="https://fleetgoo.com/zh/" />
<link rel="alternate" hreflang="x-default" href="https://fleetgoo.com/en/" />
```

## 4. 结构化数据 (Schema.org JSON-LD)

帮助 Google 理解页面内容，从而在搜索结果中展示“富文本摘要”（如星级评价、产品价格、公司Logo）。

**建议添加的 Schema**:
1.  **Organization**: 在主页添加，声明 FleetGoo 品牌、Logo 和联系方式。
2.  **Product**: 在产品详情页添加，包含名称、描述、图片。
3.  **BreadcrumbList**: 面包屑导航，增强搜索结果层级显示。

## 5. 站点地图 (Sitemap) 与爬虫协议 (Robots.txt)

*   **Sitemap.xml**: 必须生成包含所有语言 URL 的站点地图，提交给 Google Search Console。可以使用 `vite-plugin-sitemap` 自动生成。
*   **Robots.txt**: 允许爬虫抓取 `/*`，但屏蔽 API 路由或后台管理路由。

## 6. Vercel 部署与性能优化

SEO 的核心指标之一是 Core Web Vitals (CWV)。

*   **图片优化**: 
    *   将所有 PNG/JPG 转换为 **WebP** 或 **AVIF**。
    *   使用 `<img>` 标签的 `width` 和 `height` 属性防止布局偏移 (CLS 复位)。
    *   对于非首屏图片使用 `loading="lazy"`。
*   **Vercel Analytics**: 开启 Vercel 的 Web Vitals 监控。
*   **CDN 缓存**: Vercel 自动处理边缘缓存，确保静态资源加载速度。

## 7. 预渲染 (Prerendering) vs 服务端渲染 (SSR)

由于当前是纯客户端渲染 (SPA)，如果能在构建时生成静态 HTML (SSG) 会对 SEO 更友好。
*   **方案 A (推荐现状)**: 继续使用 Vite SPA，但确保元数据正确，Google 现在解析 JS 能力很强。
*   **方案 B (进阶)**: 使用 `vite-plugin-ssg` 将关键页面预渲染为静态 HTML。

---

### 该 SEO 方案的执行路线图

1.  **第一周**: [Completed] 重构路由结构，支持 URL 语言路径 (`/en/`, `/es/`)。
2.  **第一周**: [Completed] 引入 `react-helmet-async` 并为所有页面配置动态 Title/Description。
3.  **第二周**: [Completed] 生成 Sitemap.xml 和 Robots.txt。
4.  **第二周**: 添加 JSON-LD 结构化数据。
5.  **上线前**: 使用 Lighthouse 进行性能跑分并优化图片。
