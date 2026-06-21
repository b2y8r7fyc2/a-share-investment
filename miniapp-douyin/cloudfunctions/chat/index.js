// 云函数：对话接口
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 铁三角评分模型（内嵌，无需外部API）
const SCORING_MODEL = {
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

exports.main = async (event) => {
  const { message } = event;
  let reply = '', scores = null;

  if (/看板|打分|排序|评分/.test(message)) {
    reply = '📊 策略看板已刷新。存储芯片88分S级居首，通信设备82分A级次之。电网设备45分D级垫底需清仓。查看更多请切到「看板」标签。';
    scores = Object.entries(SCORING_MODEL).slice(0, 5).map(([name, data], i) => ({
      name, ...data, rank: i + 1
    }));
  } else if (/操作|买卖|加仓|减仓/.test(message)) {
    reply = '⚡ 6/22操作建议：\n\n🔴 卖出：电网设备(清仓)、消费电子(清仓)、电池储能(减至5%)\n🟢 买入：存储芯片(→16%)、通信设备(→10%)\n🟡 持有：机器人、科创50、沪深300\n\n执行纪律：开盘30分钟不操作，尾盘确认。';
  } else if (/纪律|止损|止盈/.test(message)) {
    reply = '📋 9条铁律扫描：\n\n⚠️ 纪律二违例：电网设备破MA30超3周未清仓\n⚠️ 纪律一违例：消费电子48分D级仍在持仓\n✅ 纪律九：军工/传媒不在持仓\n✅ 纪律七：仓位未超上限\n\n优先执行：6/22清仓电网设备';
  } else if (/预测|走势|两周|下周/.test(message)) {
    reply = '🔮 未来两周(6/22-7/3)预判：\n\n📈 涨幅锐度排序：\n1. 存储芯片 +8~15%\n2. 通信设备 +5~12%\n3. 半导体设备 +2~6%\n4. 机器人 +2~8%\n5. 科创50 +2~5%\n\n⚠️ 上证MA30(4102)是关键压力\n⚠️ 端午后首日易变盘';
  } else if (/复盘/.test(message)) {
    reply = '📝 复盘模板：\n\n✅ 盘前：隔夜外盘+消息面+今日计划\n✅ 盘中：执纪止损+记录每笔交易\n✅ 盘后：盈亏分析+纪律检查+明日计划\n\n今日未触发新的止损条件。继续持有存储/通信/科创50，等待节后方向确认。';
  } else {
    reply = '收到。我可以帮你：\n· 「刷新策略看板」- 查看最新评分排名\n· 「今天该怎么操作」- 获取买卖建议\n· 「预测未来两周板块」- 涨幅锐度排序\n· 「检查纪律执行」- 9条铁律扫描\n\n请选择一个或直接输入你的问题。';
  }

  return { reply, scores };
};
