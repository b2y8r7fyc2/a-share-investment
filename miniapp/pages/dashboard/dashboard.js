// 策略看板页
const app = getApp();

Page({
  data: {
    market: {},
    scores: [],
    operations: [],
    alerts: [],
    updateTime: '',
    loading: false
  },

  onShow() { this.refreshDashboard(); },

  async refreshDashboard() {
    this.setData({ loading: true });
    try {
      const res = await app.callAPI('dashboard', {});
      this.setData({
        market: res.market || {},
        scores: res.scores || [],
        operations: res.operations || [],
        alerts: res.alerts || [],
        updateTime: res.updateTime || '',
        loading: false
      });
    } catch (err) {
      // 离线预置数据
      this.setData({
        market: { sh: '4,090 ▼0.43%', sz: '16,030 +0.94%', kc50: '1,911 +3.84%', cycle: '确认→贪婪' },
        scores: [
          { name: '存储芯片', score: 88, level: 's', prediction: 12 },
          { name: '通信设备', score: 82, level: 'a', prediction: 8 },
          { name: '半导体设备', score: 76, level: 'a', prediction: 5 },
          { name: '机器人', score: 72, level: 'b', prediction: 5 },
          { name: '科创50', score: 70, level: 'b', prediction: 4 },
          { name: '电池储能', score: 58, level: 'c', prediction: 0 },
          { name: '绿色电力', score: 52, level: 'c', prediction: -1 },
          { name: '电网设备', score: 45, level: 'd', prediction: -3 },
        ],
        operations: [
          { action: 'sell', text: '电网设备：破MA30超3周，清仓' },
          { action: 'sell', text: '消费电子：D级非主线，清仓' },
          { action: 'buy', text: '存储芯片：S级88分，加仓至16%' },
          { action: 'buy', text: '通信设备：A级82分，加仓至10%' },
        ],
        alerts: [
          { text: '电网设备破MA30已超3周未清仓（纪律二违例）' },
        ],
        updateTime: '2026.6.18 收盘（离线）',
        loading: false
      });
    }
  }
});
