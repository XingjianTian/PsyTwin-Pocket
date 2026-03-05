const app = getApp();

Component({
  data: {
    value: '',
    unreadNum: 0,
    role: '',
    list: [],
  },

  lifetimes: {
    ready() {
      const role = wx.getStorageSync('user_role') || 'student';
      this.setData({ role });
      this.initTabList(role);
      this.updateCurrentPage();

      this.setUnreadNum(app.globalData.unreadNum);
      app.eventBus.on('unread-num-change', (unreadNum) => {
        this.setUnreadNum(unreadNum);
      });

      app.eventBus.on('role-change', (newRole) => {
        this.setData({ role: newRole });
        this.initTabList(newRole);
      });
    },
  },

  methods: {
    initTabList(role) {
      let tabList = [];

      if (role === 'teacher') {
        // 教师端 Tab：心友圈 + AI + 工作台 + 我的
        tabList = [
          {
            icon: 'home',
            value: 'home',
            label: '心墙',
          },
          {
            icon: 'chat',
            value: 'message',
            label: 'AI',
          },
          {
            icon: 'dashboard',
            value: 'dataCenter',
            label: '工作台',
          },
          {
            icon: 'user',
            value: 'my',
            label: '我的',
          },
        ];
        // 教师端 Tab：心友圈 + 工作台 + 消息 + 我的
        tabList = [
          {
            icon: 'home',
            value: 'home',
            label: '心墙',
          },
          {
            icon: 'dashboard',
            value: 'dataCenter',
            label: '工作台',
          },
          {
            icon: 'chat',
            value: 'message',
            label: '消息',
          },
          {
            icon: 'user',
            value: 'my',
            label: '我的',
          },
        ];
      } else {
        // 学生端 Tab：心友圈 + AI + 预约 + 我的
        tabList = [
          {
            icon: 'home',
            value: 'home',
            label: '心墙',
          },
          {
            icon: 'chat',
            value: 'message',
            label: 'AI',
          },
          {
            icon: 'calendar',
            value: 'appointment',
            label: '预约',
          },
          {
            icon: 'user',
            value: 'my',
            label: '我的',
          },
        ];
      }

      this.setData({ list: tabList });
    },

    updateCurrentPage() {
      const pages = getCurrentPages();
      const curPage = pages[pages.length - 1];
      if (curPage) {
        const nameRe = /pages\/(\w+)\/index/.exec(curPage.route);
        if (nameRe === null) return;
        if (nameRe[1] && nameRe) {
          this.setData({
            value: nameRe[1],
          });
        }
      }
    },

    handleChange(e) {
      const { value } = e.detail;
      wx.switchTab({ url: `/pages/${value}/index` });
    },

    setUnreadNum(unreadNum) {
      this.setData({ unreadNum });
    },
  },
});
