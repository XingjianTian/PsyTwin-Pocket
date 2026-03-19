import request from '~/api/request';

Page({
  data: {
    searchKeyword: '',
    activeTab: 'all',
    tabs: [
      { key: 'all', label: '全部' },
      { key: 'high', label: '高风险' },
      { key: 'followed', label: '已关注' },
    ],
    studentList: [],
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 20,
  },

  onLoad() {
    this.loadStudents();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore();
    }
  },

  onSearchChange(e) {
    this.setData({
      searchKeyword: e.detail.value,
      page: 1,
      studentList: [],
    });
    this.loadStudents();
  },

  onSearchConfirm() {
    this.loadStudents();
  },

  onTabChange(e) {
    this.setData({
      activeTab: e.detail.value,
      page: 1,
      studentList: [],
    });
    this.loadStudents();
  },

  loadStudents() {
    this.setData({ loading: true });

    // Mock数据
    const mockStudents = [
      {
        id: 's2021001',
        name: '张三',
        avatar: 'https://picsum.photos/80/80?random=31',
        studentId: '2021001001',
        department: '计算机学院',
        className: '软件2101',
        riskLevel: 'high',
        riskReason: '聊天中出现自伤倾向',
        lastConsultTime: '2026-03-05',
        isFollowed: true,
      },
      {
        id: 's2021002',
        name: '李四',
        avatar: 'https://picsum.photos/80/80?random=32',
        studentId: '2021001002',
        department: '电子工程学院',
        className: '通信2102',
        riskLevel: 'medium',
        riskReason: '持续负面情绪',
        lastConsultTime: '2026-03-03',
        isFollowed: true,
      },
      {
        id: 's2021003',
        name: '王五',
        avatar: 'https://picsum.photos/80/80?random=33',
        studentId: '2021001003',
        department: '经济管理学院',
        className: '工商2101',
        riskLevel: 'low',
        riskReason: null,
        lastConsultTime: null,
        isFollowed: false,
      },
      {
        id: 's2021004',
        name: '赵六',
        avatar: 'https://picsum.photos/80/80?random=34',
        studentId: '2021001004',
        department: '外国语学院',
        className: '英语2101',
        riskLevel: 'medium',
        riskReason: '学业压力大',
        lastConsultTime: '2026-02-28',
        isFollowed: false,
      },
      {
        id: 's2021005',
        name: '钱七',
        avatar: 'https://picsum.photos/80/80?random=35',
        studentId: '2021001005',
        department: '机械工程学院',
        className: '机械2103',
        riskLevel: 'low',
        riskReason: null,
        lastConsultTime: '2026-01-15',
        isFollowed: true,
      },
    ];

    // 筛选逻辑
    let filtered = mockStudents;
    if (this.data.activeTab === 'high') {
      filtered = mockStudents.filter((s) => s.riskLevel === 'high');
    } else if (this.data.activeTab === 'followed') {
      filtered = mockStudents.filter((s) => s.isFollowed);
    }

    if (this.data.searchKeyword) {
      filtered = filtered.filter(
        (s) => s.name.includes(this.data.searchKeyword) || s.studentId.includes(this.data.searchKeyword),
      );
    }

    setTimeout(() => {
      this.setData({
        studentList: filtered,
        loading: false,
        hasMore: false,
      });
    }, 300);
  },

  loadMore() {
    // 加载更多逻辑
  },

  onStudentTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/teacher/student-detail/index?id=${id}`,
    });
  },

  onFollowTap(e) {
    const { id } = e.currentTarget.dataset;
    const student = this.data.studentList.find((s) => s.id === id);
    if (student) {
      wx.showToast({
        title: student.isFollowed ? '已取消关注' : '已添加关注',
        icon: 'success',
      });
    }
  },

  onMessageTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/chat/index?type=counselor&studentId=${id}`,
    });
  },
});
