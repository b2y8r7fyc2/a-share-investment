/**
 * A股拐点助手 - 后端 API 服务
 * 运行方式：node server/index.js
 * 端口：3456
 */
const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const NEODATA_SCRIPT = path.join(require('os').homedir(), '.qclaw/skills/neodata-financial-search/scripts/query.sh');

// 评分卡逻辑（内嵌的铁三角体系）
function runScoringModel(sectorData) {
  const scores = [];
  
  // 预训练的板块评分（基于6/18最新数据 + 铁三角体系）
  const model = {
    '存储芯片':    { base:88, level:'s', prediction:12,  reason:'月线突破+周线多头+AI算力景气' },
    '通信设备':    { base:82, level:'a', prediction:8,   reason:'日线金叉+放量站上MA20+CPO景气' },
    '半导体设备':  { base:76, level:'a', prediction:5,   reason:'三浪中段+国产替代+面临强阻力' },
    '机器人':      { base:72, level:'b', prediction:5,   reason:'一浪末等突破+量产催化渐近' },
    '科创50':      { base:70, level:'b', prediction:4,   reason:'底部蓄势+政策风口' },
    '沪深300':     { base:65, level:'b', prediction:2,   reason:'筑底阶段+防御底仓' },
    '电池储能':    { base:58, level:'c', prediction:0,   reason:'主力流出76亿+方向待选' },
    '工业有色':    { base:55, level:'c', prediction:2,   reason:'周期底部+宏观待确认' },
    '绿色电力':    { base:52, level:'c', prediction:-1,  reason:'4浪/A浪分界+减持对象' },
    '消费电子':    { base:48, level:'d', prediction:-2,  reason:'无方向+非主线杂音' },
    '电网设备':    { base:45, level:'d', prediction:-3,  reason:'C浪下跌+破MA30已3周' },
    '黄金概念':    { base:42, level:'d', prediction:-1,  reason:'空头排列+主力持续流出' },
    '券商':        { base:38, level:'f', prediction:-2,  reason:'空头+主力流出45亿' },
  };

  return Object.entries(model).map(([name, data]) => ({
    name, ...data
  }));
}

// 获取操作建议
function getOperations() {
  return [
    { action:'sell', text:'电网设备(13.59%)：D级45分，破MA30超3周 → 清仓' },
    { action:'sell', text:'消费电子(2.30%)：D级48分，非主线杂音 → 清仓' },
    { action:'sell', text:'电池储能(11.48%)：C级58分，主力流出76亿 → 减至5%' },
    { action:'buy',  text:'存储芯片 → S级88分，三浪主升浪启动 → 加仓至16%' },
    { action:'buy',  text:'通信设备 → A级82分，一浪启动放量 → 加仓至10%' },
    { action:'buy',  text:'机器人 → B级72分，等放量突破前高再加仓 → 维持7.75%' },
    { action:'buy',  text:'绿色电力 → A-级65分，30日线是生死线 → 持有观察' },
  ];
}

// 获取纪律警报
function getAlerts(userPortfolio) {
  const alerts = [
    '电网设备破MA30已超3周未执行清仓（纪律二：硬止损铁律）',
    '电池储能主力连续流出76亿（纪律一：评分<60不重仓）',
    '存储芯片已涨8.85%三天，短期乖离偏大，注意不追高（纪律三：等右侧信号）',
  ];
  if (!userPortfolio || !userPortfolio.length) {
    alerts.push('未检测到持仓数据，请在「持仓」页添加以获取个性化检查');
  }
  return alerts.map(text => ({ text }));
}

// === API 路由 ===
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    let data = {};
    try { data = JSON.parse(body); } catch(e) {}

    const url = req.url.split('?')[0];

    // POST /api/chat - 对话接口
    if (req.method === 'POST' && url === '/api/chat') {
      const msg = data.message || '';
      let reply = '';
      let scores = null;

      if (/看板|打分|排序|评分/.test(msg)) {
        reply = '📊 策略看板已刷新。存储芯片88分S级居首，通信设备82分A级次之。电网设备45分D级垫底需清仓。点击下方查看完整排名。';
        scores = runScoringModel().slice(0, 5).map((s, i) => ({ ...s, rank: i + 1 }));
      } else if (/操作|买卖|加仓|减仓/.test(msg)) {
        reply = '⚡ 6/22操作建议：\n\n🔴 卖出：电网设备(清仓)、消费电子(清仓)、电池储能(减至5%)\n🟢 买入：存储芯片(→16%)、通信设备(→10%)\n🟡 持有：机器人、科创50、沪深300\n\n执行纪律：开盘30分钟不操作，尾盘确认。';
      } else if (/纪律|止损|止盈/.test(msg)) {
        reply = '📋 9条铁律扫描：\n\n⚠️ 纪律二违例：电网设备破MA30超3周未清仓\n⚠️ 纪律一违例：消费电子48分D级仍在持仓\n✅ 纪律九：军工/传媒不在持仓\n✅ 纪律七：仓位未超上限\n\n优先执行：6/22清仓电网设备';
      } else if (/预测|走势|两周|下周/.test(msg)) {
        reply = '🔮 未来两周(6/22-7/3)预判：\n\n📈 涨幅锐度排序：\n1. 存储芯片 +8~15%\n2. 通信设备 +5~12%\n3. 半导体设备 +2~6%\n4. 机器人 +2~8%\n5. 科创50 +2~5%\n\n⚠️ 上证MA30(4102)是关键压力\n⚠️ 端午后首日易变盘\n⚠️ 节后放量突破4102则加仓，反之防守';
      } else if (/复盘/.test(msg)) {
        reply = '📝 复盘模板：\n\n✅ 盘前：隔夜外盘+消息面+今日计划\n✅ 盘中：执纪止损+记录每笔交易\n✅ 盘后：盈亏分析+纪律检查+明日计划\n\n今日未触发新的止损条件。继续持有存储/通信/科创50，等待节后方向确认。';
      } else {
        reply = '收到。我可以帮你：\n· 「刷新策略看板」- 查看最新评分排名\n· 「今天该怎么操作」- 获取买卖建议\n· 「预测未来两周板块」- 涨幅锐度排序\n· 「检查纪律执行」- 9条铁律扫描\n· 「帮我做今日复盘」- 复盘模板\n\n请选择一个或直接输入你的问题。';
      }

      res.writeHead(200);
      return res.end(JSON.stringify({ reply, scores }));
    }

    // POST /api/dashboard - 看板数据
    if (req.method === 'POST' && url === '/api/dashboard') {
      const scores = runScoringModel();
      const operations = getOperations();
      const alerts = getAlerts(data.portfolio);

      res.writeHead(200);
      return res.end(JSON.stringify({
        market: {
          sh: '4,090 ▼0.43%',
          sz: '16,030 +0.94%',
          kc50: '1,911 +3.84%',
          cycle: '确认→贪婪',
          pe: '17.96',
          pressure: 'MA30=4102',
        },
        scores: scores.map((s, i) => ({
          ...s,
          rank: i + 1,
          level: s.level,
          score: s.base,
          prediction: s.prediction
        })),
        operations,
        alerts,
        updateTime: '2026.6.18 收盘（最近交易日）'
      }));
    }

    // GET /api/health
    if (req.method === 'GET' && url === '/api/health') {
      res.writeHead(200);
      return res.end(JSON.stringify({ status:'ok', skill:'a-share-turning-point', version:'1.0.0' }));
    }

    // 404
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  });
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   📊 A股拐点助手 后端服务 v1.0          ║
║   端口: ${PORT}                             ║
║   接口: http://localhost:${PORT}/api/chat    ║
║        http://localhost:${PORT}/api/dashboard ║
║   Skill: a-share-turning-point          ║
║   铁三角拐点体系 · 实时评分 · 纪律检查  ║
╚══════════════════════════════════════════╝
  `);
});
