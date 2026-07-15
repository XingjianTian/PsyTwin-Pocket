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
   * 支持：DeepSeek、通义千问、Kimi、智谱、SiliconFlow 等
   * 如果配置了此项，日记/AI 对话等功能会优先走 LLM，不再请求 OpenClaw
   */
  llm: {
    /** 是否启用自有 LLM 替代 OpenClaw */
    enabled: true,

    /** API Base URL（必须以 /v1 结尾或包含完整路径）
     * 当前配置: MiniMax
     * 其他可选：
     * - DeepSeek:   'https://api.deepseek.com/v1'
     * - 通义千问:   'https://dashscope.aliyuncs.com/compatible-mode/v1'
     * - Kimi:       'https://api.moonshot.cn/v1'
     * - 智谱:       'https://open.bigmodel.cn/api/paas/v4'
     * - SiliconFlow: 'https://api.siliconflow.cn/v1'
     */
    baseUrl: 'https://api.minimaxi.com',

    /** API Key - 请替换为你的 MiniMax Token Plan API Key (前缀 sk-cp-...) */
    apiKey: 'sk-cp-dPU72No3ZJtfuj-3M1mBlq1AuQU--4T51F3a2Wttss59sGVOGuM7UTW07odTBHkOh2uOsHyZc4uLo7gzekqzCH6MHokSaSk7rxif7xX2YDQpHel3O9DA2iY',

    /** 模型名称 (MiniMax Token Plan 支持的模型)
     * - 'MiniMax-M2.7'           旗舰模型，递归自改进，约 60 tps
     * - 'MiniMax-M2.7-highspeed' 同性能，更快，约 100 tps
     * - 'MiniMax-M2.5'           极致性价比，复杂任务
     * - 'MiniMax-M2.5-highspeed' 同性能，更快
     * - 'MiniMax-M2.1'           多语言编程能力强
     * - 'MiniMax-M2.1-highspeed' 同性能，更快
     * - 'MiniMax-M2'             Agent 能力、高级推理
     */
    model: 'MiniMax-M2.7',

    /** 温度参数（MiniMax 推荐范围 (0.0, 1.0]，推荐值 1.0） */
    temperature: 0.8,

    /** 最大 Token 数 */
    maxTokens: 1024,

    /** 系统提示词（日记等场景会在此基础上追加） */
    systemPrompt:
      '你是一只陪伴大学生的心理支持宠物，温暖、可爱、略带幽默。你会用第一人称和主人交流，给他情感支持和鼓励。',
  },
};

export default config;
