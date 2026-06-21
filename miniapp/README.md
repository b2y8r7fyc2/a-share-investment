# A股拐点助手 · 微信小程序

> 基于 `a-share-turning-point` Skill 的微信小程序版本。
> 铁三角拐点体系 · 实时评分 · 每日对话 · 纪律检查

## 📁 项目结构

```
a-share-miniapp/
├── app.js / app.json / app.wxss    # 小程序主文件
├── pages/
│   ├── chat/       # 对话页（核心交互）
│   ├── dashboard/  # 策略看板
│   ├── portfolio/  # 持仓管理
│   └── settings/   # 设置
├── server/
│   └── index.js    # 后端 API 服务
└── utils/
    └── api.js      # API 工具
```

## 🚀 部署步骤

### 第1步：启动后端

```bash
cd server
node index.js
```

后端运行在 `http://localhost:3456`

### 第2步：配置小程序

1. 打开 [微信公众平台](https://mp.weixin.qq.com/) → 注册小程序
2. 获取 AppID
3. 修改 `project.config.json` 中的 `appid` 字段
4. 在微信开发者工具中 → 设置 → 勾选「不校验合法域名」

### 第3步：导入项目

1. 下载 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开 → 导入项目 → 选择 `a-share-miniapp` 目录
3. 填入 AppID → 确定

### 第4步：预览测试

- 开发者工具中点击「预览」→ 手机扫码体验
- 真机调试：点击「真机调试」

### 第5步：上线

1. 开发者工具 → 上传代码
2. 微信公众平台 → 版本管理 → 提交审核
3. 审核通过 → 发布

## 🔧 数据源配置

当前后端内置了6/18的预置数据。接入实时数据：

```javascript
// 在 server/index.js 中取消注释
const neoDataResult = execSync(
  `bash ${NEODATA_SCRIPT} "板块行情 资金流向"`,
  { encoding:'utf-8' }
);
// 解析后传入 runScoringModel()
```

## 🎨 功能列表

| 功能 | 状态 |
|------|:---:|
| AI 每日对话 | ✅ |
| 策略看板 | ✅ |
| 板块评分排名 | ✅ |
| 买卖操作建议 | ✅ |
| 纪律检查 | ✅ |
| 离线预置数据 | ✅ |
| 持仓管理 | ✅ |
| 实时行情接入 | ⏳ 需配置API |
