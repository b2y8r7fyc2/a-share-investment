// 策略看板
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
      const res = await app.callCloud('dashboard', {});
      this.setData({ ...res, loading: false });
    } catch (err) {
      this.setData({
        market: { sh:'4,090 ▼0.43%', sz:'16,030 +0.94%', kc50:'1,911 +3.84%', cycle:'确认→贪婪' },
        scores: [
          { name:'存储芯片',score:88,level:'s',prediction:12 },
          { name:'通信设备',score:82,level:'a',prediction:8 },
          { name:'半导体设备',score:76,level:'a',prediction:5 },
          { name:'机器人',score:72,level:'b',prediction:5 },
          { name:'科创50',score:70,level:'b',prediction:4 },
        ],
        operations: [
          { action:'sell',text:'电网设备：清仓' },
          { action:'buy', text:'存储芯片：加仓至16%' },
        ],
        alerts: [{ text:'电网设备破MA30已3周（纪律二违例）' }],
        updateTime:'离线模式', loading:false
      });
    }
  }
});
