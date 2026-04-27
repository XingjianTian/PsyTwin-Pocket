// pages/pet/events/index.js
Page({
  data: {
    events: [],
    loading: true,
  },

  onLoad() {
    this.loadEvents();
  },

  // 加载事件列表
  loadEvents() {
    // 模拟数据，实际应从服务器获取
    const mockEvents = [
      {
        id: 'evt_001',
        type: 'large',
        category: 'emotion',
        title: '考试失利',
        description: '今天数学考试没考好，心情很差，需要你的鼓励',
        status: 'pending',
        deadline: Date.now() + 24 * 60 * 60 * 1000,
        options: [
          { id: 'opt_1', text: '安慰鼓励', hint: '温柔的鼓励能让心宠重拾信心', impact: { mood: 15, energy: 5 } },
          { id: 'opt_2', text: '分析原因', hint: '帮助心宠找到问题所在', impact: { mood: 5, energy: -5 } },
          { id: 'opt_3', text: '陪伴散步', hint: '换个环境，放松心情', impact: { mood: 10, energy: -10 } },
          { id: 'opt_4', text: '制定计划', hint: '一起制定学习计划', impact: { mood: 8, energy: 5 } },
        ],
      },
    ];

    this.setData({
      events: mockEvents,
      loading: false,
    });
  },

  // 选择选项
  onOptionSelect(e) {
    const { eventId, optionId } = e.currentTarget.dataset;
    let event = null;
    let option = null;
    for (let i = 0; i < this.data.events.length; i++) {
      if (this.data.events[i].id === eventId) {
        event = this.data.events[i];
        break;
      }
    }
    if (event && event.options) {
      for (let i = 0; i < event.options.length; i++) {
        if (event.options[i].id === optionId) {
          option = event.options[i];
          break;
        }
      }
    }

    if (!event || !option) return;

    wx.showModal({
      title: '确认选择',
      content: `确定要"${option.text}"吗？\n${option.hint}`,
      success: (res) => {
        if (res.confirm) {
          this.resolveEvent(eventId, optionId);
        }
      },
    });
  },

  // 解决事件
  resolveEvent(eventId, optionId) {
    wx.showLoading({ title: '处理中...' });

    // 模拟API调用
    setTimeout(() => {
      wx.hideLoading();

      // 找到选中的选项文本
      let selectedOption = null;
      for (let i = 0; i < this.data.events.length; i++) {
        if (this.data.events[i].id === eventId) {
          const opts = this.data.events[i].options;
          for (let j = 0; j < opts.length; j++) {
            if (opts[j].id === optionId) {
              selectedOption = opts[j];
              break;
            }
          }
          break;
        }
      }

      // 更新本地状态
      const events = this.data.events.map(ev => {
        if (ev.id === eventId) {
          return { 
            ...ev, 
            status: 'resolved', 
            resolvedOptionId: optionId,
            resolvedOptionText: (selectedOption && selectedOption.text) ? selectedOption.text : '未知选项'
          };
        }
        return ev;
      });

      this.setData({ events });

      wx.showToast({
        title: '事件已解决',
        icon: 'success',
      });

      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1000);
  },

  // 返回
  onBackTap() {
    wx.navigateBack();
  },
});
