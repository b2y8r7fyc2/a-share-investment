// 云函数：策略看板
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async () => {
  return {
    market: {
      sh: '4,090 ▼0.43%', sz: '16,030 +0.94%', kc50: '1,911 +3.84%',
      cycle: '确认→贪婪', pe: '17.96', pressure: 'MA30=4102'
    },
    scores: [
      { name:'存储芯片', score:88, level:'s', prediction:12, rank:1 },
      { name:'通信设备', score:82, level:'a', prediction:8, rank:2 },
      { name:'半导体设备', score:76, level:'a', prediction:5, rank:3 },
      { name:'机器人', score:72, level:'b', prediction:5, rank:4 },
      { name:'科创50', score:70, level:'b', prediction:4, rank:5 },
      { name:'沪深300', score:65, level:'b', prediction:2, rank:6 },
      { name:'电池储能', score:58, level:'c', prediction:0, rank:7 },
      { name:'绿色电力', score:52, level:'c', prediction:-1, rank:8 },
      { name:'电网设备', score:45, level:'d', prediction:-3, rank:9 },
    ],
    operations: [
      { action:'sell', text:'电网设备(13.59%)：D级45分 → 清仓' },
      { action:'sell', text:'消费电子(2.30%)：D级48分 → 清仓' },
      { action:'sell', text:'电池储能(11.48%)：C级58分 → 减至5%' },
      { action:'buy', text:'存储芯片：S级88分 → 加仓至16%' },
      { action:'buy', text:'通信设备：A级82分 → 加仓至10%' },
      { action:'buy', text:'机器人：B级72分 → 维持7.75%等突破' },
    ],
    alerts: [
      { text:'电网设备破MA30已超3周未清仓（纪律二违例）' },
      { text:'消费电子48分D级不应持有（纪律一违例）' },
    ],
    updateTime: '2026.6.18 收盘'
  };
};
