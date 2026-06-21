// app.js - A股拐点助手 小程序
App({
  globalData: {
    apiBase: 'http://localhost:3456/api',  // 后端地址，上线后改云函数
    userPortfolio: [],
    lastDashboard: null,
    riskProfile: {
      dailyMaxDrawdown: 5,
      annualTarget: 20,
      style: 'oldblue',        // 老登股
      excludeSectors: ['军工','传媒','游戏','次新']
    }
  },

  onLaunch() {
    // 加载本地缓存
    const portfolio = wx.getStorageSync('portfolio');
    if (portfolio) this.globalData.userPortfolio = portfolio;
  },

  // 调用后端 API
  async callAPI(endpoint, data = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.globalData.apiBase}/${endpoint}`,
        method: 'POST',
        data,
        header: { 'Content-Type': 'application/json' },
        success: (res) => resolve(res.data),
        fail: (err) => reject(err)
      });
    });
  }
});
