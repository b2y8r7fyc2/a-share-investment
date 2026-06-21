// 对话页 - 抖音版
const app = getApp();

Page({
  data: {
    messages: [],
    inputText: '',
    loading: false,
    scrollToView: ''
  },

  onInput(e) { this.setData({ inputText: e.detail.value }); },

  quickAsk(e) {
    this.setData({ inputText: e.currentTarget.dataset.q });
    this.sendMsg();
  },

  async sendMsg() {
    const text = this.data.inputText.trim();
    if (!text || this.data.loading) return;

    const userMsg = { id: Date.now(), role: 'user', type: 'text', content: text };
    this.setData({ messages: [...this.data.messages, userMsg], inputText: '', loading: true, scrollToView: `msg-${userMsg.id}` });

    try {
      const res = await app.callCloud('chat', { message: text });
      const botMsg = {
        id: Date.now() + 1, role: 'bot',
        type: res.scores ? 'dashboard' : 'text',
        content: res.reply, scores: res.scores || null
      };
      this.setData({ messages: [...this.data.messages, botMsg], loading: false, scrollToView: `msg-${botMsg.id}` });
    } catch (err) {
      const w = this.getFallback(text);
      this.setData({ messages: [...this.data.messages, { id: Date.now()+1, role:'bot', type:'text', content:w }], loading: false });
    }
  },

  getFallback(msg) {
    if (/看板|打分|排序/.test(msg)) return '📊 存储芯片88分S级 / 通信设备82分A级 / 电网设备45分D级需清仓';
    if (/操作|买卖/.test(msg)) return '⚡ 清仓:电网设备、消费电子 | 加仓:存储芯片→16% 通信→10%';
    if (/纪律/.test(msg)) return '📋 9条铁律 | ⚠️ 电网设备MA30违例需优先执行';
    return '收到。试试：「刷新策略看板」「今天该怎么操作」「检查纪律执行」';
  },

  goDashboard() { tt.switchTab({ url: '/pages/dashboard/dashboard' }); }
});
