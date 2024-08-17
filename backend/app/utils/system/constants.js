class Constants {
  /**
   * UTF-8 字符集
   */
  static UTF8 = 'UTF-8'
  /**
   * GBK 字符集
   */
  static GBK = 'GBK'
  /**
   * 系统语言
   */
  static DEFAULT_LOCALE = { lang: 'zh', country: 'CN' }
  /**
   * www主域
   */
  static WWW = 'www.'
  /**
   * http请求
   */
  static HTTP = 'http://'
  /**
   * https请求
   */
  static HTTPS = 'https://'
  /**
   * 通用成功标识
   */
  static SUCCESS = '0'
  /**
   * 通用失败标识
   */
  static FAIL = '1'
  /**
   * 登录成功
   */
  static LOGIN_SUCCESS = 'Success'

  /**
   * 注销
   */
  static LOGOUT = 'Logout'
  /**
   * 注册
   */
  static REGISTER = 'Register'
  /**
   * 登录失败
   */
  static LOGIN_FAIL = 'Error'
  /**
   * 所有权限标识
   */
  static ALL_PERMISSION = '*:*:*'
  /**
   * 管理员角色权限标识
   */
  static SUPER_ADMIN = 'admin'
  /**
   * 角色权限分隔符
   */
  static ROLE_DELIMETER = ','
  /**
   * 权限标识分隔符
   */
  static PERMISSION_DELIMETER = ','
  /**
   * 验证码有效期（分钟）
   */
  static CAPTCHA_EXPIRATION = 2
  /**
   * 令牌
   */
  static TOKEN = 'token'
  /**
   * 令牌前缀
   */
  static TOKEN_PREFIX = 'Bearer '
  /**
   * 令牌前缀
   */
  static LOGIN_USER_KEY = 'login_user_key'
  /**
   * 用户ID
   */
  static JWT_USERID = 'userid'
  /**
   * 用户名称
   */
  static JWT_USERNAME = 'sub'
  /**
   * 用户头像
   */
  static JWT_AVATAR = 'avatar'
  /**
   * 创建时间
   */
  static JWT_CREATED = 'created'
  /**
   * 用户权限
   */
  static JWT_AUTHORITIES = 'authorities'
  /**
   * 资源映射路径 前缀
   */
  static RESOURCE_PREFIX = '/profile'
  /**
   * RMI 远程方法调用
   */
  static LOOKUP_RMI = 'rmi:'
  /**
   * LDAP 远程方法调用
   */
  static LOOKUP_LDAP = 'ldap:'
  /**
   * LDAPS 远程方法调用
   */
  static LOOKUP_LDAPS = 'ldaps:'
  /**
   * 自动识别json对象白名单配置（仅允许解析的包名，范围越小越安全）
   */
  static JSON_WHITELIST_STR = ['org.springframework', 'com.ruoyi']
  /**
   * 定时任务白名单配置（仅允许访问的包名，如其他需要可以自行添加）
   */
  static JOB_WHITELIST_STR = ['ctx.service.system.sysTaskService']
  /**
   * 定时任务违规的字符
   */
  static JOB_ERROR_STR = []
}

// 导出这个类
module.exports = Constants
