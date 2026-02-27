import request from '~/api/request';

Page({
  data: {
    currentTab: 'services', // services-服务, records-记录
    services: [],
    records: [],
    // 预约表单
    showForm: false,
    formData: {
      serviceId: null,
      serviceName: '',
      date: '',
      time: '',
      reason: '',
    },
    // 可选时间
    availableTimes: [
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
    ],
  },

  onLoad() {
    this.loadServices();
    this.loadRecords();
  },

  async loadServices() {
    try {
      const res = await request('/mock/student/appointment/services');
      this.setData({ services: res.data || [] });
    } catch (err) {
      // 使用默认数据
      this.setData({
        services: [
          {
            id: 1,
            name: '心理咨询室',
            type: 'counseling',
            description: '专业心理咨询师一对一咨询',
            duration: 50,
            location: '学生活动中心 302',
            icon: '🧠',
          },
          {
            id: 2,
            name: 'VR 心理体验',
            type: 'vr',
            description: 'VR 放松训练、场景暴露',
            duration: 30,
            location: '心理中心 101',
            icon: '🥽',
          },
          {
            id: 3,
            name: '团体活动室',
            type: 'group',
            description: '6-10 人团体辅导',
            duration: 90,
            location: '学生活动中心 305',
            icon: '👥',
          },
        ],
      });
    }
  },

  async loadRecords() {
    try {
      const res = await request('/mock/student/appointment/records');
      this.setData({ records: res.data || [] });
    } catch (err) {
      // 使用默认数据
      this.setData({
        records: [],
      });
    }
  },

  // 切换 Tab
  onTabChange(e) {
    const { value } = e.detail;
    this.setData({ currentTab: value });
  },

  // 点击服务项 - 打开预约表单
  onServiceTap(e) {
    const { id, name } = e.currentTarget.dataset;
    this.setData({
      showForm: true,
      formData: {
        serviceId: id,
        serviceName: name,
        date: '',
        time: '',
        reason: '',
      },
    });
  },

  // 关闭表单
  onFormClose() {
    this.setData({ showForm: false });
  },

  // 选择日期
  onDateChange(e) {
    this.setData({
      'formData.date': e.detail.value,
    });
  },

  // 选择时间
  onTimeChange(e) {
    this.setData({
      'formData.time': e.detail.value,
    });
  },

  // 输入事由
  onReasonInput(e) {
    this.setData({
      'formData.reason': e.detail.value,
    });
  },

  // 提交预约
  async onSubmit() {
    const { formData } = this.data;

    if (!formData.date || !formData.time) {
      wx.showToast({
        title: '请选择日期和时间',
        icon: 'none',
      });
      return;
    }

    wx.showLoading({ title: '提交中...' });

    try {
      // 模拟提交
      // await request('/mock/student/appointment/book', 'post', { data: formData });

      wx.hideLoading();
      wx.showToast({
        title: '预约成功',
        icon: 'success',
      });

      this.setData({ showForm: false });
      this.loadRecords();
    } catch (err) {
      wx.hideLoading();
      wx.showToast({
        title: '预约失败',
        icon: 'none',
      });
    }
  },

  // 取消预约
  async onCancelAppointment(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认取消',
      content: '确定要取消该预约吗？',
      success: (res) => {
        if (res.confirm) {
          // 模拟取消
          const { records } = this.data;
          const newRecords = records.map((item) => {
            if (item.id === id) {
              return { ...item, status: 'cancelled' };
            }
            return item;
          });
          this.setData({ records: newRecords });

          wx.showToast({
            title: '已取消',
            icon: 'success',
          });
        }
      },
    });
  },
});
