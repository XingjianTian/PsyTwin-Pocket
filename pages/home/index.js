import Message from 'tdesign-miniprogram/message/index';
import request from '~/api/request';

Page({
  data: {
    enable: false,
    leftList: [],
    rightList: [],
    focusCardInfo: [],
  },

  async onReady() {
    const cardRes = await request('/mock/student/home/feed')
      .then((res) => res.data)
      .catch(() => ({}));

    const feedData = cardRes?.follow || cardRes?.square || [];
    const limitedData = feedData.slice(0, 4);

    const cardData = this.formatCards(limitedData);
    const { leftList, rightList } = this.distributeCards(cardData);

    this.setData({
      leftList,
      rightList,
      focusCardInfo: cardData,
    });
  },

  formatCards(data) {
    return data.map((item, index) => ({
      id: item.id,
      url: item.content?.images?.[0] || `https://picsum.photos/300/${300 + index * 50}?random=${index}`,
      desc: item.content?.text?.slice(0, 60) || item.author?.nickname + '的分享',
      tags: this.generateTags(item),
    }));
  },

  distributeCards(cards) {
    const leftList = [];
    const rightList = [];
    let leftHeight = 0;
    let rightHeight = 0;

    cards.forEach((card, index) => {
      const imgHeight = 300 + (index % 3) * 30;
      const textHeight = card.desc?.length > 20 ? 100 : 80;
      const cardHeight = imgHeight + textHeight + 40;

      if (leftHeight <= rightHeight) {
        leftList.push(card);
        leftHeight += cardHeight;
      } else {
        rightList.push(card);
        rightHeight += cardHeight;
      }
    });

    return { leftList, rightList };
  },

  onLoad(option) {
    if (option.oper) {
      const content = option.oper === 'release' ? '发布成功' : '保存成功';
      this.showOperMsg(content);
    }
  },

  onRefresh() {
    this.refresh();
  },

  async refresh() {
    this.setData({ enable: true });

    const cardRes = await request('/mock/student/home/feed')
      .then((res) => res.data)
      .catch(() => ({}));

    const feedData = cardRes?.follow || cardRes?.square || [];
    const limitedData = feedData.slice(0, 4);
    const cardData = this.formatCards(limitedData);
    const { leftList, rightList } = this.distributeCards(cardData);

    setTimeout(() => {
      this.setData({ enable: false, leftList, rightList });
    }, 500);
  },

  generateTags(item) {
    const tags = [];
    if (item.author?.role === 'teacher') {
      tags.push({ text: '教师', theme: 'primary' });
    }
    if (item.content?.location) {
      tags.push({ text: item.content.location, theme: 'warning' });
    }
    return tags;
  },

  showOperMsg(content) {
    Message.success({
      context: this,
      offset: [120, 32],
      duration: 4000,
      content,
    });
  },

  goRelease() {
    wx.navigateTo({ url: '/pages/release/index' });
  },
});
