<div align="center">

# 📌 My Nav · 个人导航主页

> 纯静态、单文件、零依赖的个人导航页 — 实时搜索、关键词高亮、最近访问、常用置顶、明暗双主题、书签导入导出、PWA 离线

![License](https://img.shields.io/badge/license-MIT-green)
![HTML](https://img.shields.io/badge/HTML-单文件-orange)
![Dependencies](https://img.shields.io/badge/依赖-零-blue)
![Sites](https://img.shields.io/badge/站点-223-blueviolet)
![Deploy](https://img.shields.io/badge/部署-GitHub%20Pages-2ea44f?logo=github)
![PWA](https://img.shields.io/badge/PWA-离线可用-5a0fc8)

**[🌐 在线演示](https://jasonru668.github.io/High-Quality-Web-Directory/)** · [快速开始](#-快速开始) · [功能说明](#-功能说明) · [部署](#-部署) · [巡检](#-每周自动巡检)

</div>

---

## 📖 项目简介

核心只有一个 `index.html`：不需要 Node.js 就能用，浏览器双击即开，也可以丢到任意静态托管。

- 🎯 **为货代 / 留学生 / 重度网络用户设计**：11 大分区、**223 个**精选站点，覆盖海外 AI、国产 AI、货代物流、全球顶尖公司、支付交易、加密投资、网络工具、流媒体、新闻资讯等
- ⚡ **零构建**：单文件交付，无框架、无打包、首屏很快
- 🎨 **Liquid Glass 双主题**：深色玻璃拟态 + 浅色磨砂，一键切换并记住选择

## ✨ 功能说明

| 功能 | 说明 |
|---|---|
| 🔍 **实时搜索** | 按名称或域名即时过滤，命中关键词**高亮**，空分区自动隐藏 |
| ⌨️ **键盘快捷键** | `/` 聚焦搜索框，`Esc` 清空并退出输入 |
| 🕘 **最近访问** | 记录最近 8 个点击过的站点，独立分区置顶展示 |
| ⭐ **常用置顶** | 打开开关后按点击次数自动排序，高频站点带 ⭐ 角标 |
| 🌗 **明暗主题** | 右上角一键切换，写入 `localStorage`；首次跟随系统 `prefers-color-scheme` |
| 📥 **书签导入** | 支持浏览器导出的 `bookmarks.html`（按文件夹分组）与本站的 JSON 备份，自动去重 |
| 📤 **书签导出** | JSON（可回导）/ 浏览器标准书签 HTML，两种格式 |
| ⬆️⬇️ **快捷导航** | 顶部「直达底部」、底部「回到顶部」，右下角常驻悬浮双按钮 |
| 📱 **PWA 离线** | `manifest.json` + Service Worker，可“添加到桌面”，断网也能打开已缓存页面 |
| 💾 **本地持久化** | 点击频率、最近访问、书签、主题全部存于 `localStorage` |
| 🖼️ **图标三级降级** | Google favicon → DuckDuckGo → emoji，弱网也不出空白格 |
| 🚀 **渲染优化** | `DocumentFragment` 一次性插入、事件委托、`loading="lazy"`、`contain` 限制重排 |
| ♿ **可访问性** | 键盘焦点可见、尊重 `prefers-reduced-motion`、`rel="noopener noreferrer"` |

### 📂 收录分区

| 分区 | 内容概览 |
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

# 方式二：本地静态服务（推荐，Service Worker 与 localStorage 行为与线上一致）
python -m http.server 8000
# 访问 http://localhost:8000
```

> 说明：`file://` 下 Service Worker 不会注册，其它功能正常。

## 🧩 自定义

编辑 `index.html` 里的 `const data = [...]`，按现有结构增删即可，统计数、搜索索引、图标全部自动生成：

```js
{
  section: "分区名",
  emoji: "🚢",
  desc: "一句话描述",
  subs: [
    { sub: "子分类（留空则不显示小标题）", items: [
      { n: "站点名", u: "https://example.com", e: "🔗" }
    ]}
  ]
}
```

### 导入自己的书签

浏览器 → 书签管理器 → 导出为 HTML → 页面点「⬆ 导入书签」，会自动按文件夹归入「我的书签」分区，只存在本机。

## 🌐 部署

**GitHub Pages（已配置自动化）**

1. `Settings` → `Pages` → `Source` 选择 **GitHub Actions**
2. push 到 `main` 后由 `.github/workflows/pages.yml` 自动发布
3. 线上地址：`https://<用户名>.github.io/High-Quality-Web-Directory/`

**备选**：Cloudflare Pages / Vercel / Netlify —— 构建命令留空，输出目录填 `.`。

## 🩺 每周自动巡检

`.github/workflows/link-check.yml` 每周一 02:00 UTC（北京时间周一 10:00）自动跑 `scripts/check-links.mjs`：

- 提取 `index.html` 里的全部外链，并发探测状态码
- 检查每个 HTTPS 域名的证书剩余有效期（<7 天或已过期才告警，避免 CDN 短周期证书误报）
- 结果分四档：**确认失效（404/410）**、**服务器错误（5xx）**、**无法连接（地域限制，不等于失效）**、**疑似反爬**
- 存在「确认失效 / 5xx / 证书告警」时，自动创建带 `link-check` 标签的 Issue；已有则追加评论，不会重复开单
- 本地手动跑：`node scripts/check-links.mjs`，生成 `link-report.md`

## 📁 目录结构

```
.
├── index.html                  # 页面：样式 + 数据 + 逻辑
├── manifest.json               # PWA 清单
├── sw.js                       # Service Worker（离线缓存）
├── icon-192.png / icon-512.png # PWA 图标
├── scripts/check-links.mjs     # 链接与证书巡检脚本
├── README.md
├── LICENSE
└── .github/workflows/
    ├── pages.yml               # 自动部署
    └── link-check.yml          # 每周巡检 + 自动开 Issue
```

## 🗺️ Roadmap

- [x] 明暗主题切换
- [x] 站点健康检查脚本（每周 + 自动 Issue）
- [x] 书签导入 / 导出
- [x] PWA 离线
- [ ] 多设备同步（可选，需后端或云盘方案）
- [ ] 站点分类标签与自定义排序

## 📄 License

[MIT](./LICENSE) © 2026 Jason
