<div align="center">

# 📌 My Nav · 个人导航主页

> 纯静态、单文件、零依赖的个人导航页 — 实时搜索、关键词高亮、最近访问、常用置顶、玻璃拟态深色主题

![License](https://img.shields.io/badge/license-MIT-green)
![HTML](https://img.shields.io/badge/HTML-单文件-orange)
![Dependencies](https://img.shields.io/badge/依赖-零-blue)
![Sites](https://img.shields.io/badge/站点-223-blueviolet)
![Deploy](https://img.shields.io/badge/部署-GitHub%20Pages-2ea44f?logo=github)

**[🌐 在线演示](https://jasonru668.github.io/High-Quality-Web-Directory/)** · [快速开始](#-快速开始) · [功能说明](#-功能说明) · [部署](#-部署)

</div>

---

## 📖 项目简介

整个项目只有一个 `index.html`：不需要 Node.js、不需要 npm install、不需要构建，浏览器双击即用，也可以直接丢到任意静态托管。

- 🎯 **为货代 / 留学生 / 重度网络用户设计**：11 大分区、**223 个**精选站点，覆盖海外 AI、国产 AI、货代物流、全球顶尖公司、支付交易、加密投资、网络工具、流媒体、新闻资讯等
- ⚡ **零依赖零构建**：单文件交付，首屏无框架加载开销
- 🎨 **Liquid Glass 深色玻璃拟态**：渐变光晕、卡片悬浮流光、真实站点 favicon

## ✨ 功能说明

| 功能 | 说明 |
|---|---|
| 🔍 **实时搜索** | 按名称或域名即时过滤，命中关键词**高亮标记**，空分区自动隐藏 |
| ⌨️ **键盘快捷键** | `/` 聚焦搜索框，`Esc` 清空并退出输入 |
| 🕘 **最近访问** | 记录最近 8 个点击过的站点，独立分区置顶展示 |
| ⭐ **常用置顶** | 打开开关后按点击次数自动排序，高频站点带 ⭐ 角标 |
| 💾 **本地持久化** | 点击频率与最近访问存于 `localStorage`，关浏览器不丢 |
| 🖼️ **图标三级降级** | Google favicon → DuckDuckGo → emoji，弱网也不会出现空白格 |
| 🚀 **渲染优化** | `DocumentFragment` 一次性插入、事件委托、`loading="lazy"`、`contain` 限制重排 |
| 📱 **响应式** | CSS Grid 自适应，手机 / 平板 / 桌面一致体验 |
| ♿ **可访问性** | 键盘焦点可见、尊重 `prefers-reduced-motion`、图片 `alt` 与 `rel="noopener noreferrer"` |

### 📂 收录分区

| 分区 | 站点数概览 |
|---|---|
| 🤖 海外 AI | 大模型、AI 搜索、图像视频音频、AI 编程 |
| 🇨🇳 国产 AI | DeepSeek、Kimi、豆包、通义、智谱等 16 个 |
| 🚢 货代 / 物流 | 14 家船公司跟踪、船舶定位、船期运价、报关关税、货代平台 |
| 🌍 全球顶尖公司 | 科技、金融零售能源、汽车制造、医药 |
| 🌀 Google 产品 | 全家桶 + Colab / Scholar / Trends 等 |
| 💳 支付 / 交易 | 聚合支付、加密支付、外汇平台 |
| 📈 加密货币 / 投资 | 交易所、行情社区、量化工具 |
| 🛠️ 网络工具 | 测速、IP / DNS 检测、云服务 |
| 🎬 国际 / 流媒体 | Netflix、Disney+、Spotify、TikTok 等 |
| 📰 新闻 / 中文内容 | 国内外新闻与中文社区 |
| 🌏 海外华人 / 台湾 OTT | 面向海外华人的影视与直播 |

## 🚀 快速开始

```bash
# 方式一：直接打开
双击 index.html

# 方式二：本地起个静态服务（推荐，localStorage 行为与线上一致）
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 🧩 自定义

编辑 `index.html` 里的 `const data = [...]`，按现有结构增删即可，其余全部自动生成：

```js
{
  section: "分区名",
  emoji: "🚢",
  desc: "一句话描述",
  subs: [
    { sub: "子分类（留空字符串则不显示小标题）", items: [
      { n: "站点名", u: "https://example.com", e: "🔗" }
    ]}
  ]
}
```

> 统计数字、分区数量、搜索索引、图标加载全部由数据驱动，改数据无需动其它代码。

## 🌐 部署

**推荐：GitHub Pages（已配置自动化）**

1. 仓库 → `Settings` → `Pages` → `Source` 选择 **GitHub Actions**
2. 之后每次 push 到 `main`，`.github/workflows/pages.yml` 会自动发布
3. 线上地址：`https://<你的用户名>.github.io/High-Quality-Web-Directory/`

**备选：Cloudflare Pages / Vercel / Netlify**
构建命令留空，输出目录填 `/`（或 `.`）即可。

## 📁 目录结构

```
.
├── index.html                 # 全部内容：样式 + 数据 + 逻辑
├── README.md
├── LICENSE
└── .github/workflows/pages.yml # GitHub Pages 自动部署
```

## 🗺️ Roadmap

- [ ] 明暗主题切换（当前仅深色）
- [ ] 站点健康检查脚本（定期探测 404 / 证书过期）
- [ ] 导入 / 导出书签 JSON，便于多设备同步
- [ ] PWA（离线可用 + 添加到桌面）

## 📄 License

[MIT](./LICENSE) © 2026 Jason
