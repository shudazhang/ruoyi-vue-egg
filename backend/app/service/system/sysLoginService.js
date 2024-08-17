const BaseService = require('./baseService.js')
class SysLoginService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.configService = this.ctx.service.system.sysConfigService
    this.asyncFactory = this.ctx.service.system.asyncFactory
    this.userDetailsService = this.ctx.service.system.userDetailsService
    this.userService = this.ctx.service.system.sysUserService
    this.tokenService = this.ctx.service.system.tokenService
  }
  /**
   * 登录验证
   *
   * @param username 用户名
   * @param password 密码
   * @param code 验证码
   * @param uuid 唯一标识
   * @return 结果
   */
  async login(username, password, code, uuid) {
    // 验证码校验
    await this.validateCaptcha(username, code, uuid)
    // 登录前置校验
    await this.loginPreCheck(username, password)
    // 该方法会去调用UserDetailsServiceImpl.loadUserByUsername
    const loginUser = await this.userDetailsService.loadUserByUsername(username)
    await this.asyncFactory.recordLogininfor(username, this.Constants.LOGIN_SUCCESS, this.MessageUtils.message('user.login.success'))
    await this.recordLoginInfo(loginUser.userId)
    // 生成token
    return this.tokenService.createToken(loginUser)
  }
  /**
   * 校验验证码
   *
   * @param username 用户名
   * @param code 验证码
   * @param uuid 唯一标识
   * @return 结果
   */
  async validateCaptcha(username, code, uuid) {
    const captchaEnabled = await this.configService.selectCaptchaEnabled()
    if (captchaEnabled) {
      const verifyKey = this.CacheConstants.CAPTCHA_CODE_KEY + this.StringUtils.nvl(uuid, '')
      const captcha = await this.redisCache.getCacheObject(verifyKey)
      if (captcha == null) {
        await this.asyncFactory.recordLogininfor(username, this.Constants.LOGIN_FAIL, this.MessageUtils.message('user.jcaptcha.expire'))
        throw new this.CaptchaExpireException()
      }
      await this.redisCache.deleteObject(verifyKey)
      if (('' + code).toLowerCase() !== ('' + captcha).toLowerCase()) {
        await this.asyncFactory.recordLogininfor(username, this.Constants.LOGIN_FAIL, this.MessageUtils.message('user.jcaptcha.error'))
        throw new this.CaptchaException()
      }
    }
  }
  /**
   * 登录前置校验
   * @param username 用户名
   * @param password 用户密码
   */
  async loginPreCheck(username, password) {
    // 用户名或密码为空 错误
    if (this.StringUtils.isEmpty(username) || this.StringUtils.isEmpty(password)) {
      await this.asyncFactory.recordLogininfor(username, this.Constants.LOGIN_FAIL, this.MessageUtils.message('not.null'))
      throw new this.UserNotExistsException()
    }
    // 密码如果不在指定范围内 错误
    if (('' + password).length < this.UserConstants.PASSWORD_MIN_LENGTH || ('' + password).length > this.UserConstants.PASSWORD_MAX_LENGTH) {
      await this.asyncFactory.recordLogininfor(username, this.Constants.LOGIN_FAIL, this.MessageUtils.message('user.password.not.match'))
      throw new this.UserPasswordNotMatchException()
    }
    // 用户名不在指定范围内 错误
    if (('' + username).length < this.UserConstants.USERNAME_MIN_LENGTH || ('' + username).length > this.UserConstants.USERNAME_MAX_LENGTH) {
      await this.asyncFactory.recordLogininfor(username, this.Constants.LOGIN_FAIL, this.MessageUtils.message('user.password.not.match'))
      throw new this.UserPasswordNotMatchException()
    }
    // IP黑名单校验
    const blackStr = await this.configService.selectConfigByKey('sys.login.blackIPList')
    if (this.IpUtils.isMatchedIp(blackStr, this.ctx.ip)) {
      await this.asyncFactory.recordLogininfor(username, this.Constants.LOGIN_FAIL, this.MessageUtils.message('login.blocked'))
      throw new this.BlackListException()
    }
  }
  /**
   * 记录登录信息
   *
   * @param userId 用户ID
   */
  async recordLoginInfo(userId) {
    const sysUser = {}
    sysUser.userId = userId
    sysUser.loginIp = this.ctx.ip
    sysUser.loginDate = new Date()
    await this.userService.updateUserProfile(sysUser)
  }
}
module.exports = SysLoginService
