// pages/review/review.js - 每日复盘页
// TODO: 接入每日数据刷新

const app = getApp();

// ============ 15条纪律（实际纪律体系） ============
const DISCIPLINES = [
  { id: 1,  title: '大波段评分卡是唯一决策依据', desc: '所有操作必须基于评分卡评级', violated: false },
  { id: 2,  title: '延5切10止损+阶梯止盈', desc: '跌破5日线减仓/跌破10日线清仓', violated: false },
  { id: 3,  title: '进场条件≥2/4', desc: '资金+技术+趋势+估值，至少2项通过', violated: false },
  { id: 4,  title: 'D/F级板块强制清仓', desc: 'D级和F级板块不得持有任何仓位', violated: true },
  { id: 5,  title: '科技/新能源/消费分仓分散', desc: '不同方向需分散配置', violated: false },
  { id: 6,  title: '事件窗口静默期', desc: '重大事件前不操作（如美光6/25）', violated: false },
  { id: 7,  title: '科技合并≤35%上限', desc: '通信+半导体+存储+科创50折算等', violated: true },
  { id: 8,  title: '不碰禁止品种', desc: '军工/传媒/游戏/次新一律不碰', violated: false },
  { id: 9,  title: 'D→A才允许调仓', desc: 'D级仓位只能转入A级板块', violated: false },
  { id: 10, title: '证券纳入覆盖体系', desc: '证券板块纳入13板块评分+覆盖', violated: false },
  { id: 11, title: '反弹级别×仓位匹配', desc: '仅周线反弹→轻仓≤10%', violated: false },
  { id: 12, title: '连续找替代品→24h冷却', desc: '连续找≥3个替代品触发强制冷却', violated: true },
  { id: 13, title: '每日28板块四周期资金扫描', desc: '日/5日/10日/20日主力累计净流入', violated: false },
  { id: 14, title: '方向合并集中度上限', desc: '科技≤35%/新能源≤25%/金融≤20%', violated: true },
  { id: 15, title: '二次波段≥3/5才有效', desc: '跌幅>20%+底背离+资金反转+倍量+估值', violated: false }
];

// 今日违规详情
const VIOLATIONS = [
  '纪律七：科技合并58% > 35%上限',
  '纪律十四：科技超标+今日主力全面出逃，当日必须降仓',
  '纪律一：半导体设备18.15% > B级10%上限',
  '纪律一：电池储能14.88% > C级5%上限',
  '纪律四：机器人D级违纪持有（纪律十五：无二次波段）',
  '纪律四：电网设备D级违纪持有',
  '纪律四：消费电子D级违纪持有',
  '纪律四：绿色电力F级违纪持有',
  '纪律十二：今日连续试探7个替代品（501205→023452→工业有色→绿电→储能→小金属→电网），触发冷却'
];

// 资金流向
const FUND_FLOW = {
  topInflow: [
    { sector: '证券', amount: '+34.6亿' },
    { sector: '小金属', amount: '+16.7亿' },
    { sector: '化工', amount: '+13.4亿' },
    { sector: '电网设备', amount: '+11.4亿' },
    { sector: '保险', amount: '+4.3亿' }
  ],
  topOutflow: [
    { sector: '机器人', amount: '-315.5亿' },
    { sector: '光伏', amount: '-179.7亿' },
    { sector: '电力设备', amount: '-125.3亿' },
    { sector: '新能源车', amount: '-98.0亿' },
    { sector: 'CPO', amount: '-263.3亿' }
  ]
};

// 持仓板块 vs 资金方向
const PORTFOLIO_FLOW = [
  { sector: '半导体设备', holding: true, inflow: false, amount: '-57.4亿', color: 'red' },
  { sector: '通信设备', holding: true, inflow: false, amount: '-53.9亿', color: 'red' },
  { sector: '机器人', holding: true, inflow: false, amount: '-315.5亿', color: 'red' },
  { sector: '消费电子', holding: true, inflow: false, amount: '-70.4亿', color: 'red' },
  { sector: '电池储能', holding: true, inflow: false, amount: '-4.1亿', color: 'red' },
  { sector: '存储芯片', holding: true, inflow: false, amount: '-94.4亿', color: 'red' },
  { sector: '绿色电力', holding: true, inflow: false, amount: '-11.7亿', color: 'red' },
  { sector: '电网设备', holding: true, inflow: true, amount: '+11.4亿', color: 'green' }
];

// 今日策略总结
const STRATEGY = {
  mustDo: [
    { action: '清仓机器人', reason: 'D级42分、主力今日-315.5亿、纪律十五无二次波段' },
    { action: '清仓绿色电力', reason: 'F级31分、全周期阴跌、KDJ超卖反弹是逃命窗口' },
    { action: '降科技集中度', reason: '58%>35%上限、今日半导体+通信同步出逃触发纪律十四当日降仓' }
  ],
  reduce: [
    { action: '半导体设备降至10%', reason: 'B级上限10%、当前18.15%超配' },
    { action: '电池储能降至5%', reason: 'C级上限5%、当前14.88%超配3倍' }
  ],
  clear: [
    { action: '清仓消费电子', reason: 'D级46分' },
    { action: '清仓电网设备', reason: 'D级46分、反弹尾声、KDJ超买' }
  ],
  watch: [
    '通信设备（A级78分、等主力回流+纪律三③通过）',
    '存储芯片（A级73分、6/25美光财报后重评）'
  ],
  avoid: [
    '工业有色（不在13板块评分表、纪律一禁止）',
    '小金属（不在13板块评分表、涨停潮后追高危险）',
    'CPO（C级53分、纪律四D→C禁止调仓）'
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
    strategy: STRATEGY,
    violatingDisciplines: DISCIPLINES.filter(d => d.violated)
  },

  onLoad() {
    // TODO: 接入每日数据刷新后，从API拉取最新复盘
  }
});
