// pages/pet/map/index.js

Page({
  data: {
    showModal: false,
    selectedScene: {},
    // 5个地块数据 - 冒险岛风格地图
    scenes: [
      {
        id: 'fantasy_space',
        name: '奇幻空间',
        description: '充满魔法的神秘森林，树木会发光，蘑菇会说话，是心宠探索未知的起点',
        icon: '🌲',
        gradient: 'linear-gradient(135deg, #7BC8A4, #5BA88A)',
        color: '#7BC8A4',
        deco: '✨',
        unlocked: true,
        current: true,
        x: 'calc(50% - 80rpx)',
        y: '8%',
        tags: ['探索', '魔法', '森林'],
      },

      {
        id: 'open_wilderness',
        name: '自由旷野',
        description: '一望无际的开放林地，有篝火、吊床和野餐区，适合社交和放松身心',
        icon: '🌳',
        gradient: 'linear-gradient(135deg, #A8E6CF, #88C6AF)',
        color: '#A8E6CF',
        deco: '🔥',
        unlocked: true,
        current: false,
        x: 'calc(25% - 80rpx)',
        y: '56%',
        tags: ['野餐', '社交', '开阔'],
      },
      {
        id: 'soul_harbor',
        name: '心灵港湾',
        description: '温馨舒适的心理咨询室，有柔软沙发、绿植和书架，是倾诉烦恼的安全港湾',
        icon: '🛋️',
        gradient: 'linear-gradient(135deg, #87CEEB, #67AECB)',
        color: '#87CEEB',
        deco: '📚',
        unlocked: true,
        current: false,
        x: 'calc(75% - 80rpx)',
        y: '56%',
        tags: ['安全', '舒适', '倾诉'],
      },
      {
        id: 'dream_house',
        name: '梦境小屋',
        description: '温馨的夜晚小屋，窗外星空璀璨，适合休息、做梦和整理心情',
        icon: '🌙',
        gradient: 'linear-gradient(135deg, #9B89B3, #7B6993)',
        color: '#9B89B3',
        deco: '⭐',
        unlocked: true,
        current: false,
        x: 'calc(50% - 80rpx)',
        y: '32%',
        tags: ['梦境', '休息', '星空'],
      },
    ],
  },

  onLoad() {
    // 可以在这里从服务器获取场景列表和当前场景
  },

  // 点击地块
  onSceneTap(e) {
    const { scene } = e.currentTarget.dataset;
    
    this.setData({
      selectedScene: scene,
      showModal: true,
    });
  },

  // 关闭弹窗
  closeModal() {
    this.setData({
      showModal: false,
    });
  },

  // 确认进入场景
  confirmEnter() {
    const { selectedScene } = this.data;
    
    if (!selectedScene.unlocked) {
      wx.showToast({
        title: '该场景尚未解锁',
        icon: 'none',
      });
      return;
    }

    if (selectedScene.current) {
      wx.showToast({
        title: '当前就在这个场景',
        icon: 'none',
      });
      this.closeModal();
      return;
    }

    wx.showModal({
      title: '切换场景',
      content: `确定要进入「${selectedScene.name}」吗？`,
      confirmText: '进入',
      confirmColor: '#6B5B95',
      success: (res) => {
        if (res.confirm) {
          // 更新当前场景
          const scenes = this.data.scenes.map((scene) => ({
            ...scene,
            current: scene.id === selectedScene.id,
          }));

          this.setData({ scenes });

          wx.showToast({
            title: `已进入${selectedScene.name}`,
            icon: 'success',
          });

          this.closeModal();

          // TODO: 调用API切换场景
          // this.switchScene(selectedScene.id);
        }
      },
    });
  },

  // 返回上一页
  onBackTap() {
    wx.navigateBack();
  },

  // TODO: 调用API切换场景
  // switchScene(sceneId) {
  //   wx.request({
  //     url: `${app.globalData.baseUrl}/pet/scenes/${sceneId}/enter`,
  //     method: 'POST',
  //     header: { Authorization: `Bearer ${wx.getStorageSync('token')}` },
  //     success: (res) => {
  //       console.log('场景切换成功', res);
  //     },
  //   });
  // },
});
