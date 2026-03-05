import request from '~/api/request';

Page({
  data: {
    currentTab: 'services', // services | records
    services: [],
    records: [],

    // 统计数据
    stats: {
      available: 0,
      busy: 0,
      total: 0,
    },

    // 服务类型筛选
    typeFilters: [
      { label: '全部', value: 'all' },
      { label: '心理咨询', value: 'counseling' },
      { label: 'VR 体验', value: 'vr' },
      { label: '团体活动', value: 'group' },
    ],
    activeFilter: 'all',
    filteredServices: [],

    // 记录状态筛选
    statusFilters: [
      { label: '全部', value: 'all' },
      { label: '待就诊', value: 'pending' },
      { label: '已确认', value: 'confirmed' },
      { label: '已完成', value: 'completed' },
      { label: '已取消', value: 'cancelled' },
    ],
    activeStatusFilter: 'all',
    filteredRecords: [],
    pendingCount: 0,

    // 预约表单
    showForm: false,
    formData: {
      serviceId: null,
      serviceName: '',
      date: '',
      time: '',
      reason: '',
    },
    currentAvailableTimes: [],
  },

  onLoad() {
    this.loadServices();
    this.loadRecords();
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadRecords();
  },

  // ===== 数据加载 =====

  async loadServices() {
    try {
      const res = await request('/mock/student/appointment/services');
      const services = res.data || [];
      this.setData({ services });
      this.updateStats(services);
      this.applyServiceFilter(services, this.data.activeFilter);
    } catch (err) {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  async loadRecords() {
    try {
      const res = await request('/mock/student/appointment/records');
      const records = res.data || [];
      const pendingCount = records.filter((r) => r.status === 'pending' || r.status === 'confirmed').length;
      this.setData({ records, pendingCount });
      this.applyStatusFilter(records, this.data.activeStatusFilter);
    } catch (err) {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  // 更新统计数据
  updateStats(services) {
    const available = services.filter((s) => s.status === 'available').length;
    const busy = services.filter((s) => s.status === 'busy').length;
    this.setData({
      stats: {
        available,
        busy,
        total: services.length,
      },
    });
  },

  // ===== Tab 切换 =====

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
  },

  // ===== 服务类型筛选 =====

  onFilterChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ activeFilter: value });
    this.applyServiceFilter(this.data.services, value);
  },

  applyServiceFilter(services, filter) {
    const filteredServices = filter === 'all' ? services : services.filter((s) => s.type === filter);
    this.setData({ filteredServices });
  },

  // ===== 记录状态筛选 =====

  onStatusFilterChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ activeStatusFilter: value });
    this.applyStatusFilter(this.data.records, value);
  },

  applyStatusFilter(records, filter) {
    const filteredRecords = filter === 'all' ? records : records.filter((r) => r.status === filter);
    this.setData({ filteredRecords });
  },

  // ===== 预约表单 =====

  // 点击服务卡片 - 打开预约表单
  onServiceTap(e) {
    const { id, name, times } = e.currentTarget.dataset;
    // 解析 availableTimes（从 dataset 传入可能是 JSON 字符串）
    let availableTimes = [];
    if (Array.isArray(times)) {
      availableTimes = times;
    } else {
      // 从 services 中直接查找
      const service = this.data.services.find((s) => s.id === id);
      availableTimes = service?.availableTimes || [];
    }

    this.setData({
      showForm: true,
      currentAvailableTimes: availableTimes,
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
    this.setData({ 'formData.date': e.detail.value });
  },

  // 选择时间（格子点击）
  onTimeSelect(e) {
    const { time } = e.currentTarget.dataset;
    this.setData({ 'formData.time': time });
  },

  // 输入事由
  onReasonInput(e) {
    this.setData({ 'formData.reason': e.detail.value });
  },

  // 提交预约
  async onSubmit() {
    const { formData } = this.data;

    if (!formData.date || !formData.time) {
      wx.showToast({ title: '请选择日期和时间', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '提交中...' });

    try {
      // 实际项目中替换为真实接口
      // await request('/api/student/appointment/book', 'POST', { data: formData });

      // 模拟延迟
      await new Promise((resolve) => setTimeout(resolve, 600));

      wx.hideLoading();
      this.setData({ showForm: false });

      wx.showToast({ title: '预约成功', icon: 'success' });

      // 刷新数据
      this.loadRecords();
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '预约失败，请重试', icon: 'none' });
    }
  },

  // ===== 取消预约 =====

  onCancelAppointment(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认取消',
      content: '取消后该时段将释放，确定要取消吗？',
      confirmColor: '#ef4444',
      success: (res) => {
        if (res.confirm) {
          const newRecords = this.data.records.map((item) => {
            if (item.id === id) {
              return { ...item, status: 'cancelled', cancelable: false };
            }
            return item;
          });

          const pendingCount = newRecords.filter((r) => r.status === 'pending' || r.status === 'confirmed').length;

          this.setData({ records: newRecords, pendingCount });
          this.applyStatusFilter(newRecords, this.data.activeStatusFilter);

          wx.showToast({ title: '已取消', icon: 'success' });
        }
      },
    });
  },
});
