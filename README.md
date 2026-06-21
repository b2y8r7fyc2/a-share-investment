# A股ETF大波段拐点识别体系

> 由6个月实盘验证的交易方法论提炼而成的 AI Skill 包。
> **月线定方向，周线定节奏，日线定点位。**

## 🧩 安装

### 从 SkillHub（上架后）
```bash
skillhub install a-share-turning-point
```

### 从本地 .skill 文件
```bash
skillhub install a-share-turning-point.skill
```

## 📋 覆盖内容

| 模块 | 内容 |
|------|------|
| **铁三角拐点体系** | 月线底部结构 + 周线趋势确认 + 基本面/资金面共振 |
| **量化评分卡** | 底部评分卡（100分）+ 顶部风险评分卡（100分） |
| **铁血交易纪律** | 8条经6个月实盘验证的永久规则 |
| **支撑阻力体系** | 多空分界、延5切10规则、牛熊分界线 |
| **波浪理论ETF版** | 三个关键阶段 + 上升5浪 + 下跌3浪识别 |
| **板块轮动规律** | 宏观周期轮动 + 板块内部扩散 + 情绪周期定位 |
| **每日复盘模板** | 盘前/盘中/盘后检查清单 + 看板刷新流程 |

## 🔗 依赖

- **neodata-financial-search** — 实时行情/财务/资金流向数据
- **tongdaxin-mcp**（可选）— K线/选股/研报

```bash
skillhub install neodata-financial-search
skillhub install tongdaxin-mcp
```

## 📁 项目结构

```
a-share-investment/
├── dist/
│   └── a-share-turning-point.skill    # 可分发的安装包
├── skills-src/                         # Skill 源文件（1个SKILL.md + 7个参考文档）
├── docs/
│   └── 使用指南.md
└── README.md
```

## 🚀 使用示例

向 OpenClaw 说：
- "刷新策略看板，用评分卡给所有板块打分排序"
- "识别储能板块当前是否处于大波段拐点"
- "检查我的持仓是否触发任何纪律条件"
- "预测未来两周板块轮动节奏"
- "帮我做今日复盘"

---

> **不幻想、不讨好、不摇摆、可校验。** 所有结论基于评分卡输出，每条建议附带纪律依据。
