import { getPostDetail } from './post-api';

Page({
  data: {
    postId: '',
    postDetail: null,
    comments: [],
    inputValue: '',
    isLiked: false,
    likeCount: 0,
    isCollected: false,
    isLoading: true,
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ postId: options.id });
      this.loadPostDetail();
    }
  },

  async loadPostDetail() {
    wx.showLoading({ title: '加载中' });
    try {
      const res = await getPostDetail(this.data.postId);
      if (res.code === 0 || res.code === 200) {
        const detail = res.data;
        this.setData({
          postDetail: detail,
          isLiked: detail.isLiked,
          likeCount: detail.stats ? detail.stats.likeCount : 0,
          isCollected: detail.isCollected,
        });
      } else {
        wx.showToast({ title: res.message || '加载失败', icon: 'none' });
      }
    } catch (err) {
      console.error('加载详情失败', err);
      wx.showToast({ title: '网络错误', icon: 'none' });
    } finally {
      wx.hideLoading();
      this.setData({ isLoading: false });
    }
  },

  previewImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = this.data.postDetail?.content?.images || [];
    if (images.length > 0) {
      wx.previewImage({
        current: images[index],
        urls: images,
      });
    }
  },

  // Placeholders for future tasks
  onLikeTap() {
    // To be implemented in Task 7
  },

  onCommentTap() {
    // To be implemented in Task 8
  },

  onInputChange(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },

  onSendComment() {
    // To be implemented in Task 8
  },
});
