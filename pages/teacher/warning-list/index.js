import request from '~/api/request';

Page({
  data: {
    activeTab: 'pending',
    tabs: [
      { key: 'pending', label: '待处理' },
      { key: 'processing', label: '处理中' },
      { key: 'resolved', label: '已解决' },
    ],
    warningList: [],
    loading: false,
  },

  onLoad(options) {
    this.loadWarnings();

    // 如果有指定id，高亮显示
    if (options.id) {
      // TODO: 滚动到指定位置
    }
  },

  onTabChange(e) {
    this.setData({
      activeTab: e.detail.value,
    });
    this.loadWarnings();
  },

  loadWarnings() {
    this.setData({ loading: true });

    request('/teacher/workbench/warnings', { status: this.data.activeTab })
      .then((res) => {
        const { list } = res.data.data;
        this.setData({
          warningList: list,
          loading: false,
        });
      })
      .catch(() => {
        // Mock数据
        const mockWarnings = [
          {
            id: 'w1',
            studentId: 's2021001',
            studentName: '张三',
            avatar: 'https://picsum.photos/80/80?random=11',
            riskLevel: 'high',
            riskReason: '聊天中出现自伤倾向关键词',
            triggerSource: 'chat',
            triggeredAt: '2026-03-06T15:30:00',
            status: 'pending',
            lastAction: null,
          },
          {
            id: 'w2',
            studentId: 's2021002',
            studentName: '李四',
            avatar: 'https://picsum.photos/80/80?random=12',
            riskLevel: 'high',
            riskReason: '连续3天情绪评分低于-0.8',
            triggerSource: 'assessment',
            triggeredAt: '2026-03-06T14:20:00',
            status: 'processing',
            lastAction: {
              type: 'message',
              content: '已发送关怀消息',
              time: '2026-03-06T14:30:00',
            },
          },
          {
            id: 'w3',
            studentId: 's2021003',
            studentName: '王五',
            avatar: 'https://picsum.photos/80/80?random=13',
            riskLevel: 'medium',
            riskReason: '周活跃度下降60%，发布负面动态',
            triggerSource: 'post',
            triggeredAt: '2026-03-06T10:15:00',
            status: 'pending',
            lastAction: null,
          },
          {
            id: 'w4',
            studentId: 's2021004',
            studentName: '赵六',
            avatar: 'https://picsum.photos/80/80?random=14',
            riskLevel: 'medium',
            riskReason: '连续一周情绪标签为"焦虑"',
            triggerSource: 'chat',
            triggeredAt: '2026-03-05T18:45:00',
            status: 'resolved',
            lastAction: {
              type: 'appointment',
              content: '已预约3月7日咨询',
              time: '2026-03-05T19:00:00',
            },
          },
        ];

        const filtered = mockWarnings.filter((w) => w.status === this.data.activeTab);

        this.setData({
          warningList: filtered,
          loading: false,
        });
      });
  },

  onWarningTap(e) {
    const { item } = e.currentTarget.dataset;
    wx.showActionSheet({
      itemList: ['查看学生档案', '电话联系', '发送消息', '预约咨询', '添加备注'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            wx.navigateTo({ url: `/pages/teacher/student-detail/index?id=${item.studentId}` });
            break;
          case 1:
            wx.makePhoneCall({ phoneNumber: '13800138000' });
            break;
          case 2:
            wx.navigateTo({ url: `/pages/chat/index?type=counselor&studentId=${item.studentId}` });
            break;
          case 3:
            wx.showToast({ title: '跳转预约页面', icon: 'none' });
            break;
          case 4:
            this.addNote(item.id);
            break;
        }
      },
    });
  },

  addNote(id) {
    wx.showModal({
      title: '添加备注',
      editable: true,
      placeholderText: '请输入备注内容',
      success: (res) => {
        if (res.confirm && res.content) {
          request(`/teacher/workbench/warnings/${id}/action`, {
            actionType: 'note',
            content: res.content,
          }).then(() => {
            wx.showToast({ title: '备注已添加', icon: 'success' });
            this.loadWarnings();
          });
        }
      },
    });
  },

  formatTime(timeStr) {
    const date = new Date(timeStr);
    const now = new Date();
    const diff = (now - date) / 1000 / 60; // 分钟

    if (diff < 60) {
      return `${Math.floor(diff)}分钟前`;
    } else if (diff < 24 * 60) {
      return `${Math.floor(diff / 60)}小时前`;
    } else {
      return `${Math.floor(diff / 60 / 24)}天前`;
    }
  },
});
