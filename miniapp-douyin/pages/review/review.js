// pages/review/review.js - 每日复盘页
// TODO: 接入每日数据刷新

const app = getApp();

// ============ 硬编码复盘数据（2026-06-22） ============

// 15条纪律检查清单
const DISCIPLINES = [
  {
    id: 1,
    title: '纪律一：单板块仓位上限',
    desc: 'S/A级≤15%，B级≤10%，C级≤5%，D/F级0%',
    violated: true
  },
  {
    id: 2,
    title: '纪律二：总仓位上限',
    desc: '震荡市≤60%，下跌市≤40%，上涨市≤80%',
    violated: false
  },
  {
    id: 3,
    title: '纪律三：单日加仓上限',
    desc: '单日加仓不超过总仓位的10%',
    violated: false
  },
  {
    id: 4,
    title: '纪律四：D/F级不持有',
    desc: 'D级和F级板块不得持有任何仓位',
    violated: true
  },
  {
    id: 5,
    title: '纪律五：止盈纪律',
    desc: '获利超15%必须减仓至半仓',
    violated: false
  },
  {
    id: 6,
    title: '纪律六：止损纪律',
    desc: '单板块亏损超8%必须清仓',
    violated: false
  },
  {
    id: 7,
    title: '纪律七：科技板块合并上限',
    desc: '科技方向（半导体+通信+存储等）合并≤35%',
    violated: true
  },
  {
    id: 8,
    title: '纪律八：连续3日下跌减仓',
    desc: '任一持仓板块连续3日下跌，减仓50%',
    violated: false
  },
  {
    id: 9,
    title: '纪律九：破MA30清仓',
    desc: '板块指数跌破30日均线≥3日，必须清仓',
    violated: false
  },
  {
    id: 10,
    title: '纪律十：尾盘决策',
    desc: '所有加减仓操作在14:50后执行',
    violated: false
  },
  {
    id: 11,
    title: '纪律十一：不追涨',
    desc: '当日涨幅超5%的板块不追买',
    violated: false
  },
  {
    id: 12,
    title: '纪律十二：不杀跌',
    desc: '当日跌幅超3%不恐慌卖出，等反弹',
    violated: false
  },
  {
    id: 13,
    title: '纪律十三：现金储备',
    desc: '始终保留≥20%现金应对极端行情',
    violated: false
  },
  {
    id: 14,
    title: '纪律十四：集中度触发降仓',
    desc: '科技方向集中度超阈值当日必须启动降仓',
    violated: true
  },
  {
    id: 15,
    title: '纪律十五：周末复盘',
    desc: '每周日完成全板块重评+下周预判',
    violated: false
  }
];

// 今日违规详情
const VIOLATIONS = [
  '纪律七：科技合并58%>35%上限',
  '纪律一：半导体18.15%>B级10%上限',
  '纪律一：电池储能14.88%>C级5%上限',
  '纪律四：机器人D级持有',
  '纪律四：电网设备D级持有',
  '纪律四：消费电子D级持有',
  '纪律四：绿色电力F级持有',
  '纪律十四：科技方向集中度触发当日降仓'
];

// 资金流向
const FUND_FLOW = {
  topInflow: [
    { sector: '证券', amount: '+34.6亿' },
    { sector: '小金属', amount: '+16.7亿' },
    { sector: '化工', amount: '+13.4亿' },
    { sector: '电网', amount: '+11.4亿' },
    { sector: '保险', amount: '+4.3亿' }
  ],
  topOutflow: [
    { sector: '机器人', amount: '-315.5亿' },
    { sector: '光伏', amount: '-180亿' },
    { sector: '电力设备', amount: '-125亿' },
    { sector: '新能源车', amount: '-98亿' },
    { sector: '存储芯片', amount: '-94亿' }
  ]
};

// 持仓板块 vs 资金方向
const PORTFOLIO_FLOW = [
  { sector: '半导体设备', holding: true, inflow: false, amount: '-54亿' },
  { sector: '电池储能', holding: true, inflow: false, amount: '-32亿' },
  { sector: '通信设备', holding: true, inflow: false, amount: '-54亿' },
  { sector: '电网设备', holding: true, inflow: true, amount: '+11.4亿' },
  { sector: '存储芯片', holding: true, inflow: false, amount: '-94亿' },
  { sector: '机器人', holding: true, inflow: false, amount: '-315.5亿' },
  { sector: '消费电子', holding: true, inflow: false, amount: '-28亿' },
  { sector: '绿色电力', holding: true, inflow: false, amount: '-15亿' }
];

// 今日策略总结
const STRATEGY = {
  mustDo: [
    '清仓机器人（D级、无二次波段）',
    '清仓绿色电力（F级）'
  ],
  reduce: [
    '半导体设备降至10%',
    '电池储能降至5%'
  ],
  watch: [
    '通信设备（等主力回流）'
  ],
  avoid: [
    '工业有色、小金属（今日涨幅过大、不在评估表内）'
  ]
};

Page({
  data: {
    date: '2026年6月22日',
    disciplines: DISCIPLINES,
    violations: VIOLATIONS,
    violationCount: VIOLATIONS.length,
    fundFlow: FUND_FLOW,
    portfolioFlow: PORTFOLIO_FLOW,
    strategy: STRATEGY
  },

  onLoad() {
    // TODO: 接入每日数据刷新后，从云函数/API拉取最新复盘
  }
});
