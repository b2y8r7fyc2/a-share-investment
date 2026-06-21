// 对话页逻辑
const app = getApp();

Page({
  data: {
    messages: [],
    inputText: '',
    loading: false,
    scrollToView: ''
  },

  onLoad() {
    // 初始欢迎消息
    wx.setNavigationBarTitle({ title: 'A股拐点助手' });
  },

  onInput(e) { this.setData({ inputText: e.detail.value }); },

  // 快捷提问
  quickAsk(e) {
    const q = e.currentTarget.dataset.q;
    this.setData({ inputText: q });
    this.sendMsg();
  },

  // 发送消息
  async sendMsg() {
    const text = this.data.inputText.trim();
    if (!text || this.data.loading) return;

    // 添加用户消息
    const userMsg = { id: Date.now(), role: 'user', type: 'text', content: text };
    const msgs = [...this.data.messages, userMsg];
    this.setData({ messages: msgs, inputText: '', loading: true, scrollToView: `msg-${userMsg.id}` });

    try {
      // 检测是否请求看板
      const isDashboard = /看板|打分|排序|评分/.test(text);
      const res = await app.callAPI('chat', { 
        message: text, 
        includeDashboard: isDashboard 
      });

      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        type: isDashboard && res.scores ? 'dashboard' : 'text',
        content: res.reply || '收到，正在分析...',
        scores: res.scores || null
      };
      this.setData({
        messages: [...this.data.messages, botMsg],
        loading: false,
        scrollToView: `msg-${botMsg.id}`
      });
    } catch (err) {
      // 离线回退：本地预置回答
      const fallbackMsg = this.getFallbackReply(text);
      const botMsg = { id: Date.now() + 1, role: 'bot', type: 'text', content: fallbackMsg };
      this.setData({
        messages: [...this.data.messages, botMsg],
        loading: false,
        scrollToView: `msg-${botMsg.id}`
      });
    }
  },

  // 离线回退（无后端时的预置回答）
  getFallbackReply(text) {
    if (/看板|打分|排序/.test(text)) {
      return '📊 **策略看板速览**\n\n需要连接后端服务才能获取实时数据。\n\n当前可离线查看交易纪律和框架说明。';
    }
    if (/操作|买卖|加仓|减仓/.test(text)) {
      return '⚡ 操作建议需要实时行情数据。请先启动后端服务。\n\n纪律提醒：\n· 单板块≤25%\n· 破MA30当日清仓\n· 加仓等右侧信号';
    }
    if (/纪律|止损|止盈/.test(text)) {
      return '📋 **9条铁血纪律**\n\n① 评分卡唯一依据\n② 破MA20减半/破MA30清仓\n③ 加仓等右侧信号\n④ 从低分换高分\n⑤ 减仓分三批\n⑥ 宏观前静默期\n⑦ 单板块上限\n⑧ 阶梯止盈\n⑨ 老登股不碰名单';
    }
    return '收到。请确保后端服务已启动，或尝试以下快捷操作：\n\n· 「刷新策略看板」- 查看最新评分\n· 「今天该怎么操作」- 获取操作建议\n· 「检查纪律执行」- 纪律扫描';
  },

  goDashboard() {
    wx.switchTab({ url: '/pages/dashboard/dashboard' });
  }
});
