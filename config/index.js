/** 配置文件 */
const config = {
  /** 是否使用 mock 数据代替真实 API */
  isMock: false,

  /** API 基础地址
   * - Sentinel 本地: 'http://localhost:3000/api/pocket'
   * - 局域网测试: 'http://192.168.x.x:3000/api/pocket'
   * - 生产环境: 'https://api.psytwin.com/api/pocket'
   * - Mock 模式: '' (空字符串，让 Mock 系统拦截相对路径)
   */
  baseUrl: 'http://localhost:3000/api/pocket',
};

export default config;
