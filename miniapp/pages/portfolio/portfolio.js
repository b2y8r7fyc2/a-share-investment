// 持仓管理
const app = getApp();

Page({
  data: {
    totalValue: '145',
    holdings: [
      { name:'电网设备', pct:'13.59', level:'d', action:'清仓' },
      { name:'电池储能', pct:'11.48', level:'c', action:'减至5%' },
      { name:'存储芯片', pct:'14.64', level:'s', action:'加仓' },
      { name:'半导体设备', pct:'11.80', level:'a', action:'持有' },
      { name:'通信设备', pct:'9.10', level:'a', action:'加仓' },
      { name:'机器人', pct:'7.75', level:'b', action:'持有' },
      { name:'绿色电力', pct:'9.00', level:'c', action:'持有观察' },
      { name:'科创50', pct:'7.56', level:'b', action:'持有' },
      { name:'沪深300', pct:'7.80', level:'b', action:'持有' },
      { name:'消费电子', pct:'2.30', level:'d', action:'清仓' },
    ],
  },

  // 添加持仓（后续扩展）
  addHolding() {
    wx.showToast({ title:'即将支持自定义添加', icon:'none' });
  },

  onShow() {
    const saved = wx.getStorageSync('portfolio');
    if (saved && saved.length) {
      this.setData({ holdings: saved });
    }
  }
});
