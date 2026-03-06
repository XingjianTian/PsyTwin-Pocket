import request from '~/api/request';

Page({
  data: {
    activeTab: 'pending',
    tabs: [
      { key: 'pending', label: '待确认' },
      { key: 'confirmed', label: '已确认' },
      { key: 'completed', label: '已完成' },
      { key: 'cancelled', label: '已取消' },
    ],
    appointmentList: [],
    loading: false,
    selectedDate: '',
    showCalendar: false,
  },

  onLoad() {
    this.setTodayDate();
    this.loadAppointments();
  },

  setTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.setData({
      selectedDate: `${year}-${month}-${day}`,
    });
  },

  onTabChange(e) {
    this.setData({
      activeTab: e.detail.value,
      appointmentList: [],
    });
    this.loadAppointments();
  },

  loadAppointments() {
    this.setData({ loading: true });

    // Mock数据
    const mockAppointments = [
      {
        id: 'a1',
        studentName: '张三',
        avatar: 'https://picsum.photos/80/80?random=41',
        studentId: '2021001001',
        type: 'counseling',
        date: '2026-03-07',
        time: '09:00',
        endTime: '09:50',
        location: '心理咨询室A',
        status: 'pending',
        reason: '学业压力大，需要咨询',
        createdAt: '2026-03-06T10:30:00',
      },
      {
        id: 'a2',
        studentName: '李四',
        avatar: 'https://picsum.photos/80/80?random=42',
        studentId: '2021001002',
        type: 'counseling',
        date: '2026-03-07',
        time: '10:30',
        endTime: '11:20',
        location: '心理咨询室A',
        status: 'confirmed',
        reason: '人际关系困扰',
        createdAt: '2026-03-05T14:20:00',
      },
      {
        id: 'a3',
        studentName: '王五',
        avatar: 'https://picsum.photos/80/80?random=43',
        studentId: '2021001003',
        type: 'vr',
        date: '2026-03-06',
        time: '14:00',
        endTime: '14:30',
        location: 'VR体验中心',
        status: 'completed',
        reason: '放松训练',
        createdAt: '2026-03-04T09:00:00',
      },
      {
        id: 'a4',
        studentName: '赵六',
        avatar: 'https://picsum.photos/80/80?random=44',
        studentId: '2021001004',
        type: 'counseling',
        date: '2026-03-08',
        time: '15:00',
        endTime: '15:50',
        location: '心理咨询室B',
        status: 'cancelled',
        reason: '职业规划咨询',
        createdAt: '2026-03-03T11:00:00',
        cancelReason: '学生临时有事',
      },
    ];

    const filtered = mockAppointments.filter((a) => a.status === this.data.activeTab);

    setTimeout(() => {
      this.setData({
        appointmentList: filtered,
        loading: false,
      });
    }, 300);
  },

  onDateSelect() {
    this.setData({ showCalendar: true });
  },

  onCalendarConfirm(e) {
    const date = new Date(e.detail.value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    this.setData({
      selectedDate: `${year}-${month}-${day}`,
      showCalendar: false,
    });
    this.loadAppointments();
  },

  onCalendarClose() {
    this.setData({ showCalendar: false });
  },

  onAppointmentTap(e) {
    const { item } = e.currentTarget.dataset;

    if (item.status === 'pending') {
      wx.showActionSheet({
        itemList: ['确认预约', '拒绝预约', '查看学生档案'],
        success: (res) => {
          switch (res.tapIndex) {
            case 0:
              this.confirmAppointment(item.id);
              break;
            case 1:
              this.rejectAppointment(item.id);
              break;
            case 2:
              wx.navigateTo({ url: `/pages/teacher/student-detail/index?id=${item.studentId}` });
              break;
          }
        },
      });
    } else {
      wx.navigateTo({
        url: `/pages/teacher/appointment-detail/index?id=${item.id}`,
      });
    }
  },

  confirmAppointment(id) {
    wx.showModal({
      title: '确认预约',
      content: '确认接受此预约请求？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '已确认', icon: 'success' });
          this.loadAppointments();
        }
      },
    });
  },

  rejectAppointment(id) {
    wx.showModal({
      title: '拒绝预约',
      content: '请输入拒绝原因（选填）',
      editable: true,
      placeholderText: '请输入原因',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '已拒绝', icon: 'success' });
          this.loadAppointments();
        }
      },
    });
  },

  onConfirmTap(e) {
    const { id } = e.currentTarget.dataset;
    this.confirmAppointment(id);
  },

  onRejectTap(e) {
    const { id } = e.currentTarget.dataset;
    this.rejectAppointment(id);
  },
});
