/** 配置文件 */
const config = {
  /** 是否使用 mock 数据代替真实 API */
  isMock: true,
  /** API 基础地址
   * - 生产环境: 'https://your-api-domain.com'
   * - Mock 模式: '' (空字符串，让 Mock 系统拦截相对路径)
   */
  baseUrl: '',
};

export default config;
