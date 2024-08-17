class CacheConstants {
  /**
   * 登录用户 redis key
   */
  static LOGIN_TOKEN_KEY = 'login_tokens:'
  /**
   * 验证码 redis key
   */
  static CAPTCHA_CODE_KEY = 'captcha_codes:'
  /**
   * 参数管理 cache key
   */
  static SYS_CONFIG_KEY = 'sys_config:'
  /**
   * 字典管理 cache key
   */
  static SYS_DICT_KEY = 'sys_dict:'
  /**
   * 防重提交 redis key
   */
  static REPEAT_SUBMIT_KEY = 'repeat_submit:'
  /**
   * 限流 redis key
   */
  static RATE_LIMIT_KEY = 'rate_limit:'
  /**
   * 登录账户密码错误次数 redis key
   */
  static PWD_ERR_CNT_KEY = 'pwd_err_cnt:'
}

// 导出这个类
module.exports = CacheConstants
