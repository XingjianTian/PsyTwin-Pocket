import request from '~/api/request';

Page({
  data: {
    currentTab: 'services',
    services: [],
    records: [],
    stats: { available: 0, busy: 0, total: 0 },
    typeFilters: [
      { label: '全部', value: 'all' },
      { label: '线下咨询', value: 'counseling' },
      { label: '减压舱', value: 'decompression' },
      { label: 'VR 体验', value: 'vr' },
    ],
    activeFilter: 'all',
    filteredServices: [],
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
    showForm: false,
    formData: { serviceId: null, serviceName: '', date: '', time: '', reason: '' },
    currentAvailableTimes: [],
  },

  onLoad() {
    this.loadServices();
    this.loadRecords();
  },

  onShow() {
    this.loadRecords();
  },

  async loadServices() {
    try {
      const res = await request('/student/appointment/services');
      const rooms = res.data?.rooms || [];

      const services = rooms.map((room) => {
        const isVR = room.name && room.name.includes('VR');
        const isDecompression = room.name && room.name.includes('减压舱');
        const type = isVR ? 'vr' : isDecompression ? 'decompression' : 'counseling';
        const duration = isVR ? 30 : isDecompression ? 50 : 50;

        const roomStatus = (room.status || 'AVAILABLE').toLowerCase();
        const isBusy = roomStatus === 'in_use';
        const status = isBusy ? 'busy' : roomStatus === 'maintenance' ? 'maintenance' : 'available';

        return {
          id: room.id,
          name: room.name,
          type: type,
          status: status,
          location: room.location,
          capacity: room.capacity,
          duration: duration,
          devices: isVR
            ? [
                { name: 'Pico 4 Enterprise', online: true },
                { name: '小米手环 9', online: true },
              ]
            : isDecompression
              ? [
                  { name: '生物反馈仪', online: true },
                  { name: '小米手环 9', online: true },
                ]
              : [{ name: '小米手环 9', online: true }],
          description: isVR
            ? 'VR 放松训练、冥想引导、场景暴露疗法'
            : isDecompression
              ? '减压放松训练、生物反馈调节、压力释放'
              : '专业心理咨询师一对一深度咨询',
          availableTimes: ['09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30'],
          currentUser: isBusy
            ? {
                name: '张同学',
                studentId: room.currentStudentId || '2024001',
                plan: '社交焦虑脱敏',
                usedMinutes: 25,
                totalMinutes: duration,
              }
            : null,
        };
      });

      // 排序：心理咨询室 > 减压舱 > VR体验区
      const sortedServices = this.sortServices(services);

      this.setData({ services: sortedServices });
      this.updateStats(sortedServices);
      this.applyServiceFilter(sortedServices, this.data.activeFilter);
    } catch (err) {
      console.error('加载失败:', err);
    }
  },

  // 排序服务列表
  sortServices(services) {
    const typePriority = { counseling: 1, decompression: 2, vr: 3 };

    return services.sort((a, b) => {
      const priorityDiff = typePriority[a.type] - typePriority[b.type];
      if (priorityDiff !== 0) return priorityDiff;

      const numA = this.extractNumber(a.name);
      const numB = this.extractNumber(b.name);
      return numA - numB;
    });
  },

  extractNumber(name) {
    if (!name) return 0;
    const match = name.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  },

  async loadRecords() {
    try {
      const res = await request('/student/appointment/records');
      const records = (res.data?.records || []).map((r) => ({
        ...r,
        status: (r.status || 'pending').toLowerCase(),
      }));
      const pendingCount = records.filter((r) => r.status === 'pending' || r.status === 'confirmed').length;
      this.setData({ records: records, pendingCount: pendingCount });
      this.applyStatusFilter(records, this.data.activeStatusFilter);
    } catch (err) {
      console.error('加载记录失败:', err);
    }
  },

  updateStats(services) {
    const available = services.filter((s) => s.status === 'available').length;
    const busy = services.filter((s) => s.status === 'busy').length;
    this.setData({ stats: { available: available, busy: busy, total: services.length } });
  },

  onTabChange(e) {
    this.setData({ currentTab: e.currentTarget.dataset.value });
  },

  onFilterChange(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({ activeFilter: value });
    this.applyServiceFilter(this.data.services, value);
  },

  applyServiceFilter(services, filter) {
    const filtered = filter === 'all' ? services : services.filter((s) => s.type === filter);
    this.setData({ filteredServices: filtered });
  },

  onStatusFilterChange(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({ activeStatusFilter: value });
    this.applyStatusFilter(this.data.records, value);
  },

  applyStatusFilter(records, filter) {
    const filtered = filter === 'all' ? records : records.filter((r) => r.status === filter);
    this.setData({ filteredRecords: filtered });
  },

  onServiceTap(e) {
    const { id, name, times } = e.currentTarget.dataset;
    let timeArray = [];
    if (Array.isArray(times)) {
      timeArray = times;
    } else if (typeof times === 'string') {
      timeArray = times ? times.split(',') : [];
    }
    this.setData({
      showForm: true,
      formData: { serviceId: id, serviceName: name, date: '', time: '', reason: '' },
      currentAvailableTimes: timeArray,
    });
  },

  preventTouchMove() {
    return false;
  },

  onFormClose() {
    this.setData({ showForm: false });
  },

  onDateChange(e) {
    this.setData({ 'formData.date': e.detail.value });
  },

  onTimeSelect(e) {
    const { time } = e.currentTarget.dataset;
    this.setData({ 'formData.time': time });
  },

  onReasonInput(e) {
    this.setData({ 'formData.reason': e.detail.value });
  },

  onSubmit() {
    const { formData } = this.data;
    if (!formData.date || !formData.time) {
      wx.showToast({ title: '请选择日期和时间', icon: 'none' });
      return;
    }
    wx.showToast({ title: '预约成功', icon: 'success' });
    this.setData({ showForm: false });
    this.loadRecords();
  },

  onCancel(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个预约吗？',
      success: (res) => {
        if (res.confirm) {
          const newRecords = this.data.records.map((item) =>
            item.id === id ? { ...item, status: 'cancelled', cancelable: false } : item,
          );
          const pendingCount = newRecords.filter((r) => r.status === 'pending' || r.status === 'confirmed').length;
          this.setData({ records: newRecords, pendingCount: pendingCount });
          this.applyStatusFilter(newRecords, this.data.activeStatusFilter);
          wx.showToast({ title: '已取消', icon: 'success' });
        }
      },
    });
  },
});
