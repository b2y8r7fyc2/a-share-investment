// pages/predict/predict.js - 板块预测页
// TODO: 接入每日数据刷新

const app = getApp();

// ============ 硬编码预测数据（2026-06-22 第一轮） ============
const PREDICT_DATA = {
  date: '2026年6月22日',
  totalPosition: { min: 50, max: 55 },
  direction: '减仓为主，不追买',

  sectors: [
    {
      name: '存储芯片',
      score: 73,
      level: 'A',
      week: { trend: 'down', text: '回踩' },
      month: { trend: 'flat', text: '震荡整理' },
      support: '6400',
      resistance: '7300',
      advice: '美光6/25后评估',
      fundTag: '🟡短线',
      fundTagClass: 'short'
    },
    {
      name: '通信设备',
      score: 78,
      level: 'A',
      week: { trend: 'down', text: '短线撤离' },
      month: { trend: 'down', text: '回调' },
      support: '5800',
      resistance: '6500',
      advice: '主力今日-54亿',
      fundTag: '🟡短线→🔴',
      fundTagClass: 'exit'
    },
    {
      name: '半导体设备',
      score: 60,
      level: 'B',
      week: { trend: 'down', text: '回踩' },
      month: { trend: 'flat', text: '震荡' },
      support: '5200',
      resistance: '6200',
      advice: '超配需降',
      fundTag: '🟡短线→🔴',
      fundTagClass: 'exit'
    },
    {
      name: '电池储能',
      score: 57,
      level: 'C',
      week: { trend: 'flat', text: '震荡' },
      month: { trend: 'flat', text: '横盘' },
      support: '27000',
      resistance: '29000',
      advice: '需降仓至5%',
      fundTag: '🔴撤离',
      fundTagClass: 'evacuate'
    },
    {
      name: '电网设备',
      score: 46,
      level: 'D',
      week: { trend: 'up', text: '反弹尾声' },
      month: { trend: 'down', text: '回落' },
      support: '—',
      resistance: '6451',
      advice: '冲高减仓',
      fundTag: '⚪混合',
      fundTagClass: 'mixed'
    },
    {
      name: '消费电子',
      score: 46,
      level: 'D',
      week: { trend: 'down', text: '下行' },
      month: { trend: 'down', text: '弱势' },
      support: '—',
      resistance: '—',
      advice: '清仓',
      fundTag: '🔴撤离',
      fundTagClass: 'evacuate'
    },
    {
      name: '机器人',
      score: 42,
      level: 'D',
      week: { trend: 'down', text: '主力-316亿今日' },
      month: { trend: 'down', text: '无二次波段' },
      support: '无底',
      resistance: '—',
      advice: '清仓，无二次波段',
      fundTag: '🔴撤离',
      fundTagClass: 'evacuate'
    },
    {
      name: '绿色电力',
      score: 31,
      level: 'F',
      week: { trend: 'up', text: '超卖反弹' },
      month: { trend: 'down', text: '持续弱势' },
      support: '1482',
      resistance: '1550',
      advice: '反弹是逃命窗口',
      fundTag: '🔴撤离',
      fundTagClass: 'evacuate'
    },
    {
      name: '证券',
      score: 60,
      level: 'B/C',
      week: { trend: 'flat', text: '横盘' },
      month: { trend: 'flat', text: '蓄势' },
      support: '—',
      resistance: '6388(120日线)',
      advice: '轻仓试3-5%',
      fundTag: '🟡短线',
      fundTagClass: 'short'
    },
    {
      name: '小金属',
      score: 55,
      level: 'C+',
      week: { trend: 'flat', text: '横盘' },
      month: { trend: 'flat', text: '观望' },
      support: '—',
      resistance: '—',
      advice: '不追，今日+5.8%已高',
      fundTag: '🟡短线',
      fundTagClass: 'short'
    },
    {
      name: '工业有色',
      score: 55,
      level: 'C+',
      week: { trend: 'flat', text: '横盘' },
      month: { trend: 'flat', text: '观望' },
      support: '—',
      resistance: '—',
      advice: '不追',
      fundTag: '🟡短线',
      fundTagClass: 'short'
    },
    {
      name: '化工',
      score: 0,
      level: '—',
      week: { trend: 'flat', text: '横盘' },
      month: { trend: 'flat', text: '观望' },
      support: '—',
      resistance: '—',
      advice: '观察',
      fundTag: '🟡短线',
      fundTagClass: 'short'
    }
  ],

  summary: {
    title: '综合预判',
    text: '13板块中仅证券、小金属、工业有色、化工4个方向偏中性，其余全部偏空或明确看跌。科技主线全面降温，机器人单日出逃316亿创纪录。建议总仓50-55%，以减仓和防御为主，反弹即减仓窗口。'
  }
};

Page({
  data: {
    date: PREDICT_DATA.date,
    totalPosition: PREDICT_DATA.totalPosition,
    direction: PREDICT_DATA.direction,
    sectors: PREDICT_DATA.sectors,
    summary: PREDICT_DATA.summary
  },

  onLoad() {
    // TODO: 接入每日数据刷新后，从云函数/API拉取最新预测
  },

  // 获取评分颜色
  getScoreColor(score) {
    if (score >= 80) return '#ffd700'; // S 金
    if (score >= 70) return '#6bcb77'; // A 绿
    if (score >= 55) return '#4da6ff'; // B 蓝
    if (score >= 45) return '#ffd93d'; // C 黄
    if (score >= 30) return '#ff8c00'; // D 橙
    return '#ff6b6b';                   // F 红
  },

  // 获取趋势箭头
  getTrendArrow(trend) {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return '→';
  },

  // 获取评级颜色class
  getLevelClass(level) {
    const l = String(level).charAt(0).toUpperCase();
    if (l === 'S') return 'level-s';
    if (l === 'A') return 'level-a';
    if (l === 'B') return 'level-b';
    if (l === 'C') return 'level-c';
    if (l === 'D') return 'level-d';
    if (l === 'F') return 'level-f';
    return 'level-none';
  }
});
