// app.js - A股拐点助手 抖音小程序版
App({
  globalData: {
    userPortfolio: [],
    lastDashboard: null,
    riskProfile: {
      dailyMaxDrawdown: 5,
      annualTarget: 20,
      style: 'oldblue',
      excludeSectors: ['军工','传媒','游戏','次新']
    }
  },

  onLaunch() {
    // 抖音云开发初始化（需先在抖音开放平台开通）
    if (tt.cloud) {
      tt.cloud.init({ env: '你的抖音云环境ID' });
    }

    const portfolio = tt.getStorageSync('portfolio');
    if (portfolio) this.globalData.userPortfolio = portfolio;
  },

  // 调用抖音云函数
  async callCloud(name, data = {}) {
    if (tt.cloud) {
      const res = await tt.cloud.callFunction({ name, data });
      return res.result;
    }
    throw new Error('云开发未启用');
  },

  // HTTP 备用（本地调试）
  async callAPI(endpoint, data = {}) {
    return new Promise((resolve, reject) => {
      tt.request({
        url: `https://your-api.com/${endpoint}`,
        method: 'POST',
        data,
        header: { 'Content-Type': 'application/json' },
        success: (res) => resolve(res.data),
        fail: reject
      });
    });
  }
});
