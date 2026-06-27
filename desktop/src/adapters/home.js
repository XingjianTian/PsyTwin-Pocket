export function generateTags(item) {
  const tags = [];

  if (item.content?.location) {
    tags.push({ text: item.content.location, theme: 'primary' });
  }

  if (item.content?.isAnonymous) {
    tags.push({ text: '匿名', theme: 'default' });
  }

  return tags;
}

export function formatCards(data = []) {
  return data.map((item) => ({
    postId: item.id || '',
    url: item.content?.images?.[0] || '',
    desc: item.content?.text || '',
    tags: generateTags(item),
    nickname: item.author?.nickname || '匿名的你',
    avatar: item.author?.avatar || '',
    role: item.author?.role || 'student',
    department: item.author?.department || '',
    isAnonymous: Boolean(item.content?.isAnonymous),
    likeCount: item.stats?.likeCount || 0,
    createdAt: item.createdAt || '',
    commentCount: item.stats?.commentCount || 0,
  }));
}

export function distributeCards(cards = []) {
  const leftList = [];
  const rightList = [];
  let leftHeight = 0;
  let rightHeight = 0;

  cards.forEach((card, index) => {
    const imageHeight = card.url ? 180 + (index % 3) * 18 : 0;
    const textHeight = card.desc.length > 38 ? 96 : 76;
    const tagHeight = card.tags.length > 0 ? 28 : 0;
    const cardHeight = imageHeight + textHeight + tagHeight + 72;

    if (leftHeight <= rightHeight) {
      leftList.push(card);
      leftHeight += cardHeight;
    } else {
      rightList.push(card);
      rightHeight += cardHeight;
    }
  });

  return { leftList, rightList };
}
