Component({
  properties: {
    postId: String,
    isLiked: Boolean,
    commentCount: Number,
    url: String,
    desc: String,
    tags: Array,
    nickname: String,
    avatar: String,
    role: String,
    department: String,
    isAnonymous: Boolean,
    likeCount: Number,
    createdAt: String,
  },
  data: {},
  methods: {
    onCardTap() {
      this.triggerEvent('tap', { id: this.data.postId });
    },
  },
});
