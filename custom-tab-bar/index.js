const app = getApp();

Component({
  data: {
    value: '',
    unreadNum: 0,
    role: '',
    list: [],
    hidden: false,
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

      app.eventBus.on('tabbar-toggle', (hidden) => {
        this.setData({ hidden });
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

      } else {
        // 学生端 Tab：心墙 + 心宠 + AI + 预约 + 我的
        tabList = [
          {
            icon: 'home',
            value: 'home',
            label: '心墙',
          },
          {
            icon: 'heart',
            value: 'pet',
            label: '心宠',
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
        const routeToTab = [
          { prefix: 'pages/home/', value: 'home' },
          { prefix: 'pages/pet/', value: 'pet' },
          { prefix: 'pages/message/', value: 'message' },
          { prefix: 'pages/dataCenter/', value: 'dataCenter' },
          { prefix: 'pages/appointment/', value: 'appointment' },
          { prefix: 'pages/my/', value: 'my' },
        ];
        const currentTab = routeToTab.find((item) => curPage.route.startsWith(item.prefix));
        if (currentTab) {
          this.setData({
            value: currentTab.value,
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
