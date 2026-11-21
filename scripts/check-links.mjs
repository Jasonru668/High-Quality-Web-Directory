/**
 * 站点健康检查：从 index.html 里提取所有外链，逐个探测可用性与 HTTPS 证书。
 * 输出 link-report.md（Markdown 报告）与 link-summary.json（统计，供工作流判断是否开 Issue）
 * 仅依赖 Node 内置模块，无需安装任何包。
 *
 * 分类原则（重要）：
 *   - 确认失效：404 / 410 —— 站点确实下架或改版
 *   - 服务器错误：5xx —— 目标站自身故障，值得复查
 *   - 无法连接：DNS / 超时 / TLS 握手失败 —— 多为地域限制或反爬，不等于失效
 *   - 需人工确认：401 / 403 / 406 / 429 —— 需登录或拦截机器人
 * 只有「确认失效 + 服务器错误 + 证书告警」才会触发 Issue，避免噪声。
 */
import { readFile, writeFile } from "node:fs/promises";
import { connect } from "node:tls";

const CONCURRENCY = 10;
const CERT_CONCURRENCY = 8;
const TIMEOUT = 12000;
const UA = "Mozilla/5.0 (compatible; MyNavLinkCheck/1.0; +https://github.com)";
const UA_BROWSER = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const ROOT = new URL("../", import.meta.url);
const html = await readFile(new URL("index.html", ROOT), "utf8");

const urls = [...new Set([...html.matchAll(/u:"(https?:\/\/[^"]+)"/g)].map(m => m[1]))];
if (!urls.length) {
  console.error("未从 index.html 提取到任何链接，请检查数据格式");
  process.exit(1);
}

async function mapLimit(list, limit, fn) {
  const out = new Array(list.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, list.length) }, async () => {
    while (cursor < list.length) {
      const i = cursor++;
      out[i] = await fn(list[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}

const hostOf = url => {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
};

async function fetchOnce(url, method, ua = UA) {
  return fetch(url, {
    method,
    redirect: "follow",
    headers: {
      "user-agent": ua,
      "accept": "text/html,application/xhtml+xml,*/*;q=0.8",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8"
    },
    signal: AbortSignal.timeout(TIMEOUT)
  });
}

async function checkUrl(url) {
  const t0 = Date.now();
  try {
    let res = await fetchOnce(url, "HEAD");
    // 不少站点拒绝 HEAD，降级为 GET 再判一次
    if ([403, 405, 406, 429, 501].includes(res.status)) {
      await res.body?.cancel().catch(() => {});
      res = await fetchOnce(url, "GET");
      await res.body?.cancel().catch(() => {});
    } else if ([404, 410].includes(res.status)) {
      // 404 可能是按 UA 拦截机器人，用真实浏览器 UA 复核一次，两次都 404 才算真失效
      await res.body?.cancel().catch(() => {});
      res = await fetchOnce(url, "GET", UA_BROWSER);
      await res.body?.cancel().catch(() => {});
    }
    return { url, status: res.status, ms: Date.now() - t0, error: "" };
  } catch (err) {
    const code = err?.cause?.code || err?.code || err?.name || "ERROR";
    return { url, status: 0, ms: Date.now() - t0, error: `${code}: ${err?.message || ""}`.slice(0, 120) };
  }
}

function checkCert(host) {
  return new Promise(resolve => {
    let done = false;
    const finish = value => { if (!done) { done = true; resolve(value); } };
    const socket = connect(
      { host, port: 443, servername: host, timeout: TIMEOUT, rejectUnauthorized: false },
      () => {
        try {
          const cert = socket.getPeerCertificate();
          socket.end();
          if (!cert || !cert.valid_to) return finish({ host, days: null, error: "无证书信息" });
          const days = Math.floor((new Date(cert.valid_to).getTime() - Date.now()) / 86400000);
          finish({ host, days, valid_to: cert.valid_to });
        } catch (e) {
          finish({ host, days: null, error: e.message });
        }
      }
    );
    socket.on("error", e => finish({ host, days: null, error: e.code || e.message }));
    socket.on("timeout", () => { socket.destroy(); finish({ host, days: null, error: "连接超时" }); });
  });
}

console.log(`共 ${urls.length} 个链接，开始探测…`);
const results = await mapLimit(urls, CONCURRENCY, checkUrl);

const isNotFound = r => r.status === 404 || r.status === 410;
const isServerError = r => r.status >= 500 && r.status !== 0;
const isBlocked = r => [401, 403, 406, 429, 999].includes(r.status);
const isUnreachable = r => r.status === 0;

const notFound = results.filter(isNotFound);
const serverError = results.filter(isServerError);
const blocked = results.filter(isBlocked);
const unreachable = results.filter(isUnreachable);
const other = results.filter(r =>
  !isNotFound(r) && !isServerError(r) && !isBlocked(r) && !isUnreachable(r));

// HTTPS 证书：按 host 去重检查
const hosts = [...new Set(urls
  .filter(u => u.startsWith("https://"))
  .map(u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return null; } })
  .filter(Boolean))];

console.log(`证书检查：${hosts.length} 个域名…`);
const certs = await mapLimit(hosts, CERT_CONCURRENCY, checkCert);
const CERT_WARN_DAYS = 7;
const certIssues = certs.filter(c => c.days !== null && c.days < CERT_WARN_DAYS);

const now = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";
const table = (list, note) => {
  if (!list.length) return "";
  return `| 域名 | URL | 状态 | ${note} |\n|---|---|---|---|\n` +
    list.map(r => `| ${hostOf(r.url)} | ${r.url} | ${r.status || "—"} | ${r.error || r.ms + "ms"} |`).join("\n") + "\n\n";
};

let report = `## 站点健康检查报告

- 检查时间：${now}
- 运行环境：${process.env.GITHUB_ACTIONS ? "GitHub Actions" : "本地"}
- 链接总数：**${results.length}**
- 正常：**${other.length}**
- 确认失效（404/410）：**${notFound.length}**
- 服务器错误（5xx）：**${serverError.length}**
- 无法连接（网络 / 地域限制，不一定失效）：**${unreachable.length}**
- 疑似反爬（需人工确认）：**${blocked.length}**
- 证书 7 天内到期或已过期：**${certIssues.length}**

`;

report += `### ❌ 确认失效\n\n`;
report += table(notFound, "说明") || "无\n\n";
report += `### 🔥 服务器错误（目标站自身故障，值得复查）\n\n`;
report += table(serverError, "说明") || "无\n\n";
report += `### 🌐 无法连接（不代表失效，多为地域限制 / 反爬 / DNS）\n\n`;
report += table(unreachable, "错误") || "无\n\n";
report += `### ⚠️ 需人工确认（{{N}} 个，需登录或拦截机器人）\n\n`.replace("{{N}}", blocked.length);
report += table(blocked, "状态") || "无\n\n";

if (certIssues.length) {
  report += `### 🔒 证书告警（${certIssues.length}）\n\n| 域名 | 剩余有效期 | 截止日期 / 错误 |\n|---|---|---|\n`;
  report += certIssues.map(c =>
    `| ${c.host} | ${c.days === null ? "无法获取" : c.days + " 天"} | ${c.valid_to || c.error || ""} |`
  ).join("\n") + "\n\n";
}

if (!notFound.length && !serverError.length && !certIssues.length) {
  report += `### ✅ 本次未发现「确认失效」链接，也没有证书告警\n\n`;
}

report += `> 处理方式：打开 \`index.html\` 搜索该 URL，替换为官网新地址或删除；改完 push 到 \`main\` 会自动重新发布。\n` +
  `> 「无法连接」一栏请先手动在浏览器打开确认，再决定是否删除——部分站点会拦截海外机房的请求。\n`;

if (report.length > 60000) report = report.slice(0, 60000) + "\n\n（报告过长已截断）\n";

await writeFile(new URL("link-report.md", ROOT), report, "utf8");
await writeFile(new URL("link-summary.json", ROOT), JSON.stringify({
  checkedAt: now,
  total: results.length,
  healthy: other.length,
  notFound: notFound.length,
  serverError: serverError.length,
  unreachable: unreachable.length,
  blocked: blocked.length,
  certIssues: certIssues.length,
  // 供工作流判断：只有确认失效、服务器错误、证书问题才算“需要开 Issue”
  actionable: notFound.length + serverError.length + certIssues.length
}, null, 2), "utf8");

console.log(`完成：正常 ${other.length} / 404·410 ${notFound.length} / 5xx ${serverError.length} / 无法连接 ${unreachable.length} / 反爬 ${blocked.length} / 证书告警 ${certIssues.length}`);
