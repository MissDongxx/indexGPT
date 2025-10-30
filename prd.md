# AI Indexer — Get Found by AI
## PRD (产品需求文档) v2.0

🧩 一、产品定位

产品名称（暂定）：AI Indexer — Get Found by AI
一句话描述：帮助 Shopify 商店在 ChatGPT、Perplexity、Gemini 等 AI 搜索工具中被索引与推荐，并量化展示效果。
核心价值主张：

"让你的 Shopify 店铺被 AI 世界看见，并可视化这份影响。"

目标：

自动生成 AI 可索引文件（如 llms.txt）
自动提交内容更新至 AI 平台（IndexNow / Bing）
实时监控 AI 可见性与流量
可视化成果与 ROI 估算

👤 二、目标用户画像

| 用户类型 | 特征 | 主要痛点 | 我们提供的解决方案 |
|---------|------|----------|-------------------|
| Shopify 店主（中小商家） | 技术能力有限，关注流量 | 无法判断是否被 AI 推荐、无力手动优化 | 自动生成文件 + 成果仪表盘 |
| 营销经理 | 负责流量增长与 SEO | 缺乏量化指标评估 AI 流量 | 提供 AI 流量 & ROI 报告 |
| 跨境卖家 | 希望触达 ChatGPT 用户 | 不清楚国际 AI 搜索机制 | 自动多语言索引 & AI 提交 |

🧭 三、功能架构总览

```
AI Indexer
├── 1️⃣ 索引优化模块
│    ├─ llms.txt 自动生成
│    ├─ robots.txt 管理
│    ├─ 自动提交至 IndexNow/Bing
│    └─ 多语言支持
│
├── 2️⃣ 成果可见性模块
│    ├─ AI Visibility 检测（模拟 AI 搜索）
│    ├─ AI Index 健康度仪表盘
│    ├─ 提交与索引状态日志
│    └─ 前后对比报告（Before/After）
│
├── 3️⃣ ROI 量化模块
│    ├─ AI 来源流量追踪 (UTM/Referrer)
│    ├─ AI 影响评分 (AI Impact Score)
│    ├─ ROI 计算器（转化/收益估算）
│    └─ 每周/每月邮件报告
│
└── 4️⃣ 后台与集成模块
     ├─ Shopify App 管理界面（嵌入式）
     ├─ 用户注册与订阅（Stripe / Shopify Billing）
     ├─ API 接口（IndexNow、Bing、Perplexity）
     └─ 数据存储与加密
```

🚀 四、开发阶段划分

| 阶段 | 名称 | 目标 | 时间周期 |
|-----|------|------|---------|
| Phase 1 | 核心索引功能 MVP | 实现 AI 索引文件生成与提交 | 3–4 周 |
| Phase 2 | 成果可见性系统 | 可视化 AI 抓取 & 提交状态 | 4–6 周 |
| Phase 3 | ROI 与增长模块 | 追踪流量、转化、ROI | 6–8 周 |

🧱 五、详细功能清单

### 🩵 Phase 1 — MVP：AI 索引核心功能

目标： 让商家一键生成并提交 AI 索引文件。

| 模块 | 功能项 | 说明 |
|-----|-------|------|
| 安装引导 | 一键安装 / 自动权限校验 | 获取商店产品、集合、页面 |
| 索引生成 | 自动生成 llms.txt | 包含产品、页面 URL |
| robots 管理 | 允许用户设置允许/拒绝路径 | 与现有 robots.txt 合并 |
| 自动提交 | 接入 IndexNow / Bing API | 每当有产品更新时提交 |
| 状态反馈 | 显示"上次提交时间"与成功标志 | 简单状态提示 |
| 基础日志 | 记录提交历史 | 数据保存于后台数据库 |
| 订阅系统 | Shopify Billing API | 月付 / 年付 / 免费试用 |
| 多语言 | 英文 + 简体中文 | UI 与文件标签支持 |

### 🧡 Phase 2 — 成果可见性模块

目标： 让用户"看见自己被 AI 看见了"。

| 模块 | 功能项 | 说明 |
|-----|-------|------|
| AI Visibility 检测 | 模拟提问 "Where can I buy X?" | 检查商家域名是否出现 |
| Index 健康仪表盘 | 展示 AI 抓取覆盖率 / 索引成功率 | 以图表形式呈现 |
| 日志系统 V2 | 支持状态筛选、导出 CSV | 便于复盘 |
| 前后对比报告 | 比较安装前/后可见度变化 | 以周为单位 |
| 通知中心 | 提示 AI 已重新抓取 / 抓取失败 | 邮件或 App 通知 |
| 自定义关键词测试 | 用户输入品牌或关键词，自测 AI 可见性 | 即时结果展示 |

### 💚 Phase 3 — ROI 与增长模块

目标： 量化 AI 来源流量与商业回报。

| 模块 | 功能项 | 说明 |
|-----|-------|------|
| AI UTM Tagging | 在链接中自动添加 ?utm_source=ai-index | 区分 AI 来源流量 |
| AI 流量追踪 | 统计来自 AI 的访问与转化（对接 GA4 / Shopify Analytics） | 仪表盘展示趋势图 |
| ROI 计算器 | 根据流量×转化率×客单价计算收益 | 展示估算 ROI 百分比 |
| AI 影响评分 | 基于提交次数、被检出率、流量综合评分 | 0–100 动态分数 |
| 周报 / 月报 | 自动生成 PDF 或邮件报告 | 包含趋势、ROI、改进建议 |
| 建议引擎 | 根据检测结果给出优化提示 | 例如"补充产品描述"、"添加结构化数据" |

📊 六、数据与指标（成果可见性 + ROI）

| 指标类别 | 指标 | 含义 |
|---------|------|------|
| 可见性指标 | AI Index Coverage (%) | 被索引页面比例 |
| 提交指标 | Submission Success Rate | 向 AI 平台提交成功率 |
| 曝光指标 | AI Mentions Count | 模拟测试中出现的次数 |
| 流量指标 | AI Referrer Visits | 从 AI 来源来的访问次数 |
| 转化指标 | AI Conversion Rate | 来自 AI 的购买转化率 |
| 价值指标 | AI-driven Revenue | 来自 AI 流量的销售额估算 |
| ROI | (收益 - 成本)/成本 | 投资回报率 |

⚙️ 七、技术架构要点

前端：Shopify Embedded App（React + Polaris）

后端：Node.js / Express 或 Python FastAPI

数据库：PostgreSQL（存储提交记录、可见性检测结果）

集成接口：

Shopify Storefront & Admin API

IndexNow / Bing / Perplexity API（如可用）

GA4 / Shopify Analytics API

任务调度：

定时提交（CRON）

周期性可见性检测任务（Serverless Job）

安全性：

OAuth 2.0 登录

不访问用户订单数据

数据加密存储（AES）

🔧 八、技术实现细节优化

### 1. llms.txt 生成规则

参考 llms.txt 标准草案：

```
# Example llms.txt
Sitemap: https://yourstore.com/sitemap.xml
Allow: /products/
Allow: /collections/
Disallow: /cart/
Disallow: /checkout/
```

生成逻辑：

- 从 Shopify API 获取公开页面与产品 URL
- 过滤掉带 /cart、/checkout 等路径
- 合并 robots.txt 配置
- 每次店铺更新后自动更新

### 2. IndexNow API 限制与应对方案

官方限制约为：每个域名每日最多 10,000 次请求

应对方案：

- 使用本地队列（Redis）或 Cron 批量提交
- 若达到上限 → 延迟至次日
- 失败重试间隔指数递增（1m → 5m → 30m）

### 3. 错误处理机制

定义三级错误类型：

- 轻微：API 延迟 → 自动重试
- 中级：API 限额 → 延期
- 严重：验证失败 → 用户提示

所有错误写入"提交日志"并展示给用户。

### 4. 多语言支持实现

Shopify Storefront API 提供多语言字段（presentmentLanguageCode）；根据店铺 locale 自动生成多语言版 llms.txt。

💰 九、商业与运营设计

| 模型 | 内容 |
|-----|------|
| 定价 | 基础版 $0（功能受限），标准版 $12/月 或 $76/年，专业版 $29/月，3 天免费试用 |
| 增值功能 | 专业版支持更多关键词检测、报告导出、优先支持 |
| 推广渠道 | Shopify App Store、AI SEO 博客、YouTube 教程 |
| 客户支持 | 邮件 + 应用内帮助中心 |
| KPI | 激活率 >60%，月留存 >80%，ROI 报告生成率 >70% |

📈 十、示例仪表盘（概念）

Dashboard 页面结构

AI Visibility: 78/100  ↑ +12%
AI Traffic: 240 visits this month
ROI Estimate: 185%

[可见性趋势图] [AI Mention 热力图]
[推荐优化项]：补充 10 个产品元描述

🏁 十一、用户体验优化

### 1. 安装引导流程增强
- Shopify 的 OAuth 流程应嵌入引导视频或分步提示（React 分页式 Wizard）
- 增加进度指示器，让用户清楚知道安装步骤
- 添加预设模板选择功能，让用户根据店铺类型选择不同的索引策略

### 2. 状态反馈系统升级
- 使用"交通灯式"UI（🟢 提交成功 / 🟡 等待 / 🔴 失败）
- 增加历史趋势图，展示提交成功率的变化
- 添加预测功能，基于历史数据预测索引效果

### 3. 帮助文档完善
- 直接嵌入 Shopify Polaris 的 HelpTooltip + FAQ 面板
- 支持一键链接到支持邮箱
- 提供详细的操作指南和最佳实践

🛡️ 十二、数据安全与隐私强化

### 1. GDPR合规增强
- 增加数据处理记录功能，满足GDPR的要求
- 提供数据导出功能，让用户能够获取自己的使用数据

### 2. 数据安全措施
- 仅使用 "read_products"、"read_content" 权限，不申请 "read_orders"
- 默认保留日志 90 天，用户可一键删除数据
- 实现 /gdpr/webhooks/customers/redact 与 /shop/redact，符合 Shopify 要求
- 在应用页和隐私策略中明确说明不访问订单与客户信息

🧭 十三、综合建议总结

| 模块 | 优化方向 | 目标 |
|-----|---------|------|
| 产品路线 | 精简 MVP → 先解决"被 AI 看见" | 降低开发风险 |
| 技术架构 | 明确 API 调用策略与容错机制 | 提高稳定性 |
| UX 体验 | 更直观反馈 + 引导流程简化 | 提升激活率 |
| 隐私与安全 | 严格遵守 Shopify 权限模型 | 减少审核风险 |
| 商业模式 | "基础免费 + 专业升级" 结构 | 提升留存与付费转化 |
| 差异化策略 | 强调可见性+ROI 透明化 | 形成壁垒 |

🔚 十四、总结

这个 PRD 的核心理念是：

"把无形的 AI 曝光变成可量化的增长资产。"

它解决了 IndexGPT 目前最大的问题：

成果不可见 → 可视化 AI 可见性

ROI 无法量化 → 建立 AI 流量与收益映射

缺乏持续留存 → 每周可追踪进展 + 分数机制