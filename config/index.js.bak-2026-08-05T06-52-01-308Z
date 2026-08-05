/** 配置文件 */
const config = {
  /** 是否使用 mock 数据代替真实 API */
  isMock: false,

  /** API 基础地址 (Sentinel - 登录/通用接口)
   * - Sentinel 本地: 'http://localhost:3000/api/pocket'
   * - 局域网测试: 'http://192.168.x.x:3000/api/pocket'
   * - 生产环境: 'https://api.psytwin.com/api/pocket'
   * - Mock 模式: '' (空字符串，让 Mock 系统拦截相对路径)
   */
  baseUrl: 'http://localhost:3000/api/pocket',

  /** Pet 服务地址 (心宠专用)
   * - 本地: 'http://localhost:3001'
   * - 生产: 'https://pet.psytwin.com'
   */
  petServiceUrl: 'http://localhost:3001',

  /** 心宠离线同步服务器地址
   * - 阿里云: 'http://42.121.14.189:13002'
   * - 本地: 'http://localhost:13002'
   * - 生产: 'https://pet-sync.psytwin.com'
   */
  petSyncUrl: 'http://localhost:13002',

  /** 演示用共享心宠 ID，Unity 与小程序必须使用同一个值 */
  petDemoUserId: 'demo_pet',

  /**
   * 大模型 LLM 配置（OpenAI 兼容格式）
   * 当前使用阿里云百炼 OpenAI 兼容接口
   * 如果配置了此项，日记/AI 对话等功能会优先走 LLM，不再请求 OpenClaw
   */
  llm: {
    /** 是否启用自有 LLM 替代 OpenClaw */
    enabled: true,

    /** API Base URL（必须以 /v1 结尾）
     * 当前配置：阿里云百炼
     * 其他可选：
     * - DeepSeek:   'https://api.deepseek.com/v1'
     * - 通义千问:   'https://dashscope.aliyuncs.com/compatible-mode/v1'
     * - Kimi:       'https://api.moonshot.cn/v1'
     * - 智谱:       'https://open.bigmodel.cn/api/paas/v4'
     * - SiliconFlow: 'https://api.siliconflow.cn/v1'
     */
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',

    /** API Key - 填入阿里云百炼 API Key */
    apiKey: 'sk-ws-H.RYDPYYE.vLgs.MEMCIBufCVoX7IpJf_Zs42D3YSaNndT4e61MGcXp_bfYyzcMAh9v_ieUeNQaFAZgzB3SJHvtxa9TR0QpWovrzUp8LJHh',

    /** 百炼模型 Code */
    model: 'qwen-plus',

    /** 温度参数 */
    temperature: 0.8,

    /** 最大 Token 数 */
    maxTokens: 1024,

    /** 系统提示词（日记等场景会在此基础上追加） */
    systemPrompt:
      '你是一只陪伴大学生的心理支持宠物，温暖、可爱、略带幽默。你会用第一人称和主人交流，给他情感支持和鼓励。',
  },
};

export default config;
