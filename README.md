# A股理财投资工具箱

一套完整的 A 股投资分析工具，集成量化选股、交易纪律、方法论和基金波段投资能力。

## 🧩 已集成的 Skills

| Skill | 用途 | 来源 |
|-------|------|------|
| **tongdaxin-mcp** | 通达信行情、选股、研报、公告 | SkillHub 安装 |
| **neodata-financial-search** | 自然语言金融数据搜索 | SkillHub 安装 |
| **quant-trading** | 量化交易策略（多因子、均线、回测） | SkillHub 安装 |
| **trading-discipline** | 交易纪律与心态管理 | 本项目自定义 |
| **trading-methodology** | 交易底层逻辑与方法论体系 | 本项目自定义 |
| **fund-swing** | 基金波段投资咨询 | 本项目自定义 |

## 📁 项目结构

```
a-share-investment/
├── skills/                  # 自定义 Skill 文件
│   ├── quant/               # 量化交易
│   ├── trading-discipline/  # 交易纪律
│   ├── trading-methodology/ # 交易方法论
│   └── fund-swing/          # 基金波段投资
├── src/                     # 投资分析脚本
├── data/                    # 数据缓存
└── docs/                    # 使用文档
```

## 🚀 快速开始

1. 安装依赖 skills：
```bash
skillhub install tongdaxin-mcp
skillhub install neodata-financial-search
skillhub install quant-trading
```

2. 将自定义 skills 链接到 OpenClaw：
```bash
# 已在 ~/.qclaw/skills/ 下的 skills 会自动加载
# 本项目 skills/ 下的自定义 skill 可复制或链接过去
```

3. 开始使用（对 OpenClaw 说）：
- "帮我分析一下宁德时代的走势"
- "用多因子模型筛选A股优质标的"
- "当前大盘环境下应该注意哪些交易纪律"
- "推荐几个适合波段操作的基金"
