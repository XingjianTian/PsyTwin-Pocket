export default {
  path: '/login/postPasswordLogin',
  data: {
    message: '登录成功',
    code: 0,
    data: {
      token: '@guid()',
      // role 由后端根据手机号返回 student 或 teacher
      role: 'student',
      userId: 10001,
      name: '张三',
      phone: '13800138000',
    },
  },
};
