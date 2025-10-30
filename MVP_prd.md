# AI Indexer — Get Found by AI
## MVP PRD (产品需求文档) v2.0

## 一、阶段目标

阶段代号： Phase 1 - Core Indexing MVP
周期： 3~4 周
目标：

实现 Shopify 商店内容自动生成 AI 可索引文件（llms.txt），并通过 IndexNow API 自动提交至搜索引擎；用户可在控制台中查看提交状态。

核心成果：

自动生成 llms.txt
自动调用 IndexNow 接口
展示提交结果与历史日志
不访问任何订单/客户数据

## 二、系统模块与任务清单

模块总览

| 模块 | 功能目标 | 类型 |
|------|---------|------|
| 1️⃣ 安装引导与授权 | 用户成功安装并完成授权 | 前端+后端 |
| 2️⃣ llms.txt 生成引擎 | 自动生成 AI 索引文件 | 后端 |
| 3️⃣ IndexNow 提交模块 | 调用 API 提交更新 | 后端 |
| 4️⃣ 日志与状态面板 | 显示提交状态与历史 | 前端+后端 |
| 5️⃣ 基础设置与多语言 | 支持语言切换与配置 | 前端 |
| 6️⃣ 安全与权限 | 限制访问范围，符合GDPR | 系统 |

## 三、详细任务说明与验收标准

### 模块 1：安装引导与授权

| 项目 | 内容 |
|------|------|
| **开发任务** | <ul><li>实现 Shopify OAuth 安装流程（读取 shop、access_token）</li><li>嵌入式前端（React + Polaris）实现欢迎页与配置引导</li><li>创建数据库表 shops 存储 shop 信息与 token</li></ul> |
| **接口定义** | POST /api/install/callback — 接收授权回调并验证 HMAC |
| **验收标准** | ✅ 用户能完成安装，无错误页面；<br>✅ 数据库成功记录 store 信息；<br>✅ 页面显示"连接成功"； |

---

### 模块 2：llms.txt 生成引擎

| 项目 | 内容 |
|------|------|
| **开发任务** | <ul><li>通过 Shopify Admin API 获取产品、集合、页面 URL</li><li>过滤 /cart、/checkout、/account 路径</li><li>合并 robots.txt 规则</li><li>生成文件内容并托管在 /llms.txt 路径（通过代理）</li><li>添加版本号和时间戳</li></ul> |
| **接口定义** | GET /api/llms/generate — 手动触发生成；<br>GET /llms.txt — 公共访问文件； |
| **数据结构** | ```json
{
  "sitemap": "https://store.com/sitemap.xml",
  "allow": ["/products/", "/collections/"],
  "disallow": ["/cart/", "/checkout/"],
  "last_generated": "2025-10-28T08:00:00Z"
}
``` |
| **验收标准** | ✅ llms.txt 文件能在浏览器访问；<br>✅ 包含正确 URL 列表；<br>✅ 不含禁用路径；<br>✅ 文件更新时间正确； |

---

### 模块 3：IndexNow 提交模块

| 项目 | 内容 |
|------|------|
| **开发任务** | <ul><li>支持单店铺注册 IndexNow API key（自动生成或用户上传）</li><li>在产品更新/新增时触发 API 调用</li><li>调用地址：`https://api.indexnow.org/indexnow`</li><li>支持批量提交（≤ 10,000 URLs/日）</li><li>实现失败重试机制（最多3次，间隔递增）</li><li>当URL数量超过10,000时，分批提交</li><li>记录每日提交计数，避免超出限制</li></ul> |
| **IndexNow API Key生成机制** | <ul><li>自动生成：使用UUID生成唯一key并存储在数据库中</li><li>用户上传：提供表单让用户输入已有key并验证有效性</li></ul> |
| **失败重试机制** | <ul><li>第1次重试：1分钟后</li><li>第2次重试：5分钟后</li><li>第3次重试：30分钟后</li></ul> |
| **接口定义** | `POST /api/indexnow/submit` — 手动触发提交；<br>请求体示例：
```json
{
  "host": "store.com",
  "key": "abc123",
  "urlList": ["https://store.com/products/item1", "https://store.com/collections/all"]
}
``` |
| **验收标准** | ✅ API 调用成功率 ≥ 95%；<br>✅ 每次提交后日志记录成功；<br>✅ 错误时自动重试；<br>✅ 用户可手动点击"立即提交"； |

---

### 模块 4：日志与状态面板

| 项目 | 内容 |
|------|------|
| **开发任务** | <ul><li>创建数据库表 `submission_logs`</li><li>字段：`id`, `shop_id`, `timestamp`, `status`, `url_count`, `response_code`</li><li>前端展示最近10条记录（表格）</li><li>状态颜色指示（绿=成功，黄=等待，红=失败）</li></ul> |
| **接口定义** | `GET /api/logs` — 获取提交日志 |
| **验收标准** | ✅ 提交成功后能在前端表格中显示；<br>✅ 状态颜色与响应匹配；<br>✅ 日志分页加载正确； |

---

### 模块 5：基础设置与多语言

| 项目 | 内容 |
|------|------|
| **开发任务** | <ul><li>添加"语言切换"组件（EN / 中文）</li><li>文本内容使用 i18n 文件管理</li><li>在设置页提供 `提交频率`、`包含路径` 配置项</li></ul> |
| **提交频率选项** | <ul><li>hourly（每小时）</li><li>daily（每天）</li><li>weekly（每周）</li></ul> |
| **数据结构** | ```json
{
  "language": "zh-CN",
  "submit_frequency": "daily",
  "include_paths": ["/products/", "/collections/"]
}
``` |
| **验收标准** | ✅ 页面语言切换即时生效；<br>✅ 设置项保存至数据库；<br>✅ 提交频率设为每日后，定时任务能按周期执行； |

---

### 模块 6：安全与权限控制

| 项目 | 内容 |
|------|------|
| **开发任务** | <ul><li>仅申请 `read_products`, `read_content` 权限</li><li>实现 GDPR webhook：`/shop/redact`、`/customers/redact`</li><li>敏感数据（token、API key）加密存储（AES）</li><li>实现密钥管理服务，使用环境变量存储加密密钥</li><li>添加输入验证机制</li></ul> |
| **输入验证** | ```javascript
// 验证API Key格式
const validateApiKey = (key) => {
  return /^[a-zA-Z0-9]{32,64}$/.test(key);
}
``` |
| **验收标准** | ✅ 应用审核通过权限项检查；<br>✅ 删除商店时，数据同步删除；<br>✅ API Key 不明文存储； |

---

## 四、任务依赖与优先级表

| 优先级 | 模块 | 依赖 | 完成标准 |
|---------|------|--------|-----------|
| ⭐⭐⭐⭐ | 安装授权 | 无 | 用户可成功安装 |
| ⭐⭐⭐⭐ | llms.txt 生成 | 安装授权 | 可访问文件 |
| ⭐⭐⭐ | IndexNow 提交 | llms.txt | 提交成功 |
| ⭐⭐ | 日志面板 | IndexNow | 显示记录 |
| ⭐ | 设置与多语言 | 安装授权 | 界面正常 |
| ⭐ | 安全机制 | 全局 | 审核通过 |

---

## 五、接口清单（供开发AI调用）

| 名称 | 方法 | 说明 |
|------|------|------|
| `/api/install/callback` | POST | Shopify 授权回调 |
| `/api/llms/generate` | GET | 生成 llms.txt 文件 |
| `/api/indexnow/submit` | POST | 提交 URL 列表至 IndexNow |
| `/api/logs` | GET | 获取提交日志 |
| `/llms.txt` | GET | 公共访问文件 |
| `/api/settings` | GET/POST | 读取/更新应用设置 |

---

## 六、数据结构说明

### 1️⃣ Shop 表
```sql
CREATE TABLE shops (
  id SERIAL PRIMARY KEY,
  shop_domain VARCHAR(255) UNIQUE NOT NULL,
  access_token TEXT NOT NULL,
  locale VARCHAR(10) DEFAULT 'en-US',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加索引
CREATE INDEX idx_shops_domain ON shops(shop_domain);
```

### 2️⃣ Submission Logs

```sql
CREATE TABLE submission_logs (
  id SERIAL PRIMARY KEY,
  shop_id INTEGER REFERENCES shops(id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20),
  url_count INTEGER,
  response_code INTEGER,
  message TEXT
);
```

### 3️⃣ Settings

```sql
CREATE TABLE settings (
  shop_id INTEGER PRIMARY KEY REFERENCES shops(id),
  language VARCHAR(10) DEFAULT 'en-US',
  submit_frequency VARCHAR(20) DEFAULT 'daily',
  include_paths JSONB DEFAULT '["/products/", "/collections/"]'
);
```

---

## 七、测试与验收 checklist ✅

| 项目 | 验收方式 | 验收人 |
|------|---------|--------|
| 安装流程正常完成 | 在 Shopify 测试商店中安装 | PM |
| llms.txt 生成正确 | 访问 /llms.txt 验证 | QA |
| IndexNow 提交成功 | 调用日志返回 200 状态 | Dev |
| 日志页面显示正常 | 前端状态颜色与API匹配 | QA |
| 权限限制合规 | 审核时权限通过 | PM |
| 多语言切换生效 | UI文字切换无误 | QA |
| 性能测试达标 | API响应时间 ≤ 2秒 | Dev |
| 边界条件测试 | 处理10,000+产品店铺 | QA |

---

## 八、交付标准

所有模块通过手动与自动化测试；

安装→配置→生成→提交→查看日志 全链路成功率 ≥ 95%；

部署于 Shopify Partner 测试环境并可正常运行；

满足 Shopify App 审核的基础要求；

文档完整（README + API Doc + 隐私策略）；

---

## 九、扩展预留（Phase 2 接口占位）

/api/visibility/check — 未来接入 AI 可见性检测；

/api/report/compare — 用于前后对比报告；

/api/analytics/roi — ROI 量化接口；

---

## 十、部署指南（Deployment Guide）

### 环境准备
- Node.js 版本：18.x 或更高
- 依赖库：通过 `npm install` 安装
- Shopify CLI：用于本地开发和部署
- Ngrok / Cloudflare Tunnel：用于本地调试时的公网访问

### 环境变量配置
创建 `.env` 文件，包含以下变量：
```
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
INDEXNOW_KEY=your_indexnow_key
APP_URL=https://your-app-url.com
DATABASE_URL=your_database_connection_string
ENCRYPTION_KEY=your_encryption_key_for_sensitive_data
```

### 本地调试
1. 运行 `npm run dev` 启动开发服务器
2. 使用 ngrok 映射本地端口：`ngrok http 3000`
3. 在 Shopify Partner Dashboard 中配置 App URL 和 OAuth 回调地址

### 部署到生产
支持部署到以下平台：
- Vercel：通过 GitHub 集成自动部署
- Render：配置环境变量和构建命令
- AWS：使用 Elastic Beanstalk 或 ECS
- Railway：通过 GitHub 集成部署

### Shopify Partner 控制台配置
在 Shopify Partner Dashboard 中配置：
- App URL：指向你的生产环境URL
- OAuth 回调地址：`{APP_URL}/api/install/callback`
- Billing 设置：配置订阅计划和价格

---

## 十一、故障排除手册（Troubleshooting Guide）

### 安装阶段
**问题**：Shopify 无法验证 App URL
**解决方案**：检查 redirect_uri 是否匹配 Partner Dashboard 配置

### 索引生成
**问题**：llms.txt 未生成或为空
**解决方案**：检查站点URL权限或模板渲染失败

### IndexNow 提交
**问题**：返回 429 或 403
**解决方案**：降低调用频率或检查 API Key

### 数据仪表盘
**问题**：数据不更新
**解决方案**：检查定时任务（CRON）或 Webhook 回调

### 可见性测试
**问题**：模拟AI搜索返回空
**解决方案**：检查关键词、域名匹配逻辑

### 统一错误代码机制
- AIINDEX_001：Shopify API 访问失败
- AIINDEX_002：IndexNow 提交失败
- AIINDEX_003：llms.txt 生成失败
- AIINDEX_004：数据库连接失败

在前端界面提供「查看错误详情」入口，自动展示对应解决步骤链接

---

## 十二、API使用示例（API Usage Examples）

### IndexNow 提交接口
```bash
POST https://api.indexnow.org/indexnow
Content-Type: application/json
{
  "host": "store.com",
  "key": "abc123",
  "urlList": [
    "https://store.com/products/item1",
    "https://store.com/collections/all"
  ]
}
```

### llms.txt 文件生成
```javascript
// Node.js 示例代码
const generateLlmsTxt = async (shopDomain, accessToken) => {
  // 获取商品信息
  const products = await shopifyApi.getProducts(accessToken);

  // 生成索引文件内容
  const llmsTxtContent = `Sitemap: https://${shopDomain}/sitemap.xml
Allow: /products/
Allow: /collections/
Disallow: /cart/
Disallow: /checkout/
Last-Generated: ${new Date().toISOString()}`;

  return llmsTxtContent;
};
```

### Shopify Admin API
```graphql
# 获取店铺信息
query {
  shop {
    url
    name
  }
}

# 获取产品列表
query {
  products(first: 100) {
    edges {
      node {
        handle
        onlineStoreUrl
      }
    }
  }
}
```

### AI 可见性检测接口
```bash
# 内部测试工具示例
GET /api/visibility/check?keyword=product_name&domain=store.com
```

### ROI 数据计算接口
```json
// 获取流量分析和ROI估算JSON响应示例
{
  "period": "2025-10-01 to 2025-10-31",
  "ai_referrer_visits": 240,
  "ai_conversion_rate": 0.035,
  "average_order_value": 89.50,
  "estimated_revenue": 751.80,
  "cost": 12.00,
  "roi_percentage": 185.3
}
```