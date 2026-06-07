# FleetGoo

FleetGoo 是一个面向全球商用车队管理者、TSPs（车联网服务提供商）的 AI 车队管理解决方案展示网站。采用 Astro + React 构建，支持多语言静态生成，集成了 SEO 优化、动态内容管理和响应式设计。

## 🛠 技术栈

- **核心框架**: [Astro](https://astro.build/) (v4) - 静态站点生成器
- **UI 框架**: [React](https://react.dev/) (v18) - 交互组件
- **样式方案**:
  - [Tailwind CSS](https://tailwindcss.com/) (v3) - 实用优先 CSS
  - [Radix UI](https://www.radix-ui.com/) - 无样式组件原语
  - `class-variance-authority` & `clsx` - 类名管理
- **动画效果**: [Framer Motion](https://www.framer.com/motion/)
- **图标库**: [Lucide React](https://lucide.dev/)
- **SEO**: React Helmet Async + 自动生成 Sitemap

## ✨ 主要功能

- **多语言支持**: 英语 (en)、西班牙语 (es)、中文 (zh)、日语 (ja)、泰语 (th)
- **静态生成**: Astro 预渲染，极速加载
- **响应式设计**: 完美适配桌面端和移动端
- **暗色模式**: 支持明亮/暗色主题切换
- **数据驱动**: 内容通过 JSON 文件动态加载 (`/public/data/{lang}/`)
- **SEO 优化**: 自动生成 sitemap.xml、llms.txt，支持结构化数据
- **联系表单**: 集成 EmailJS 实现无后端邮件通知
- **博客系统**: Markdown 内容管理，多语言博客文章

## 📂 项目结构

```
├── src/
│   ├── components/     # React UI 组件
│   │   ├── ui/         # 基础组件 (Button, Dialog, Toast 等)
│   │   └── ...         # 业务组件 (Header, Footer, Hero 等)
│   ├── content/        # 内容集合 (博客文章)
│   │   └── blog/       # 多语言博客 (en, es, ja, th, zh)
│   ├── hooks/          # 自定义 React Hooks
│   ├── layouts/        # Astro 布局组件
│   ├── lib/            # 工具函数和配置
│   ├── pages/          # Astro 页面路由
│   │   ├── [lang]/     # 多语言页面 (动态路由)
│   │   ├── admin/      # 管理后台
│   │   └── *.astro     # 页面组件
│   └── views/          # 页面视图组件
├── public/
│   ├── data/           # 多语言 JSON 数据
│   │   ├── en/         # 英语内容
│   │   ├── es/         # 西班牙语内容
│   │   ├── ja/         # 日语内容
│   │   ├── th/         # 泰语内容
│   │   └── zh/         # 中文内容
│   └── images/         # 静态图片资源
├── tools/              # 构建工具脚本
├── docs/               # 项目文档
└── astro.config.mjs    # Astro 配置
```

## 🚀 快速开始

### 1. 安装依赖

确保本地环境已安装 Node.js (推荐 v18+)。

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```
启动后访问 `http://localhost:3000`

### 3. 构建生产版本

```bash
npm run build
```
构建产物将生成在 `dist` 目录下。

### 4. 预览生产构建

```bash
npm run preview
```

## 📝 配置说明

- **Astro 配置**: `astro.config.mjs`
- **Tailwind 配置**: `tailwind.config.js`
- **多语言数据**: `public/data/{lang}/` 下的 JSON 文件
- **站点配置**: `public/data/settings.json`

## 📂 资源管理

静态资源存放目录：

- `public/images/brand/` - Logo、品牌标识
- `public/images/favicons/` - 网站图标
- `public/images/products/` - 产品图片
- `public/images/solutions/` - 解决方案图片
- `public/images/company/` - 公司环境、团队照片

引用时使用绝对路径，如 `/images/products/my-product.jpg`。

## 🌍 部署

### Vercel 部署

本项目配置为直接部署到 Vercel。

**环境变量配置**:

| 变量名 | 描述 | 示例 |
| :--- | :--- | :--- |
| `SITE_URL` | 后端/构建时使用，生成 sitemap | `https://www.fleetgoo.com` |
| `VITE_SITE_URL` | 前端/运行时使用，Canonical URL | `https://www.fleetgoo.com` |

### 构建脚本

```bash
# 完整构建流程（含预构建检查和 SEO 生成）
npm run build

# 检查图片尺寸
npm run check:images

# 更新内容索引
npm run content:index

# 同步多语言内容
npm run content:sync
```

## 🤝 贡献

欢迎提交 Issue 或 Pull Request 来改进本项目。

---

**FleetGoo Technology** | [www.fleetgoo.com](https://www.fleetgoo.com)
