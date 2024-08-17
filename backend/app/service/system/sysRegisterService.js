const BaseService = require('./baseService.js')
class SysRegisterService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.configService = this.ctx.service.system.sysConfigService
    this.userService = this.ctx.service.system.sysUserService
    this.securityUtils = this.ctx.service.system.securityUtils
    this.asyncFactory = this.ctx.service.system.asyncFactory
  }
  /**
   * 注册
   */
  async register(registerBody) {
    let msg = '',
      username = registerBody.username,
      password = registerBody.password
    const sysUser = {}
    sysUser.userName = username

    // 验证码开关
    const captchaEnabled = await this.configService.selectCaptchaEnabled()
    if (captchaEnabled) {
      await this.validateCaptcha(username, registerBody.code, registerBody.uuid)
    }

    if (this.StringUtils.isEmpty(username)) {
      msg = '用户名不能为空'
    } else if (this.StringUtils.isEmpty(password)) {
      msg = '用户密码不能为空'
    } else if (username.length < this.UserConstants.USERNAME_MIN_LENGTH || username.length > this.UserConstants.USERNAME_MAX_LENGTH) {
      msg = '账户长度必须在2到20个字符之间'
    } else if (password.length < this.UserConstants.PASSWORD_MIN_LENGTH || password.length > this.UserConstants.PASSWORD_MAX_LENGTH) {
      msg = '密码长度必须在5到20个字符之间'
    } else if (!(await this.userService.checkUserNameUnique(sysUser))) {
      msg = "保存用户'" + username + "'失败，注册账号已存在"
    } else {
      sysUser.nickName = username
      sysUser.password = await this.securityUtils.encryptPassword(password)
      const regFlag = await this.userService.registerUser(sysUser)
      if (!regFlag) {
        msg = '注册失败,请联系系统管理人员'
      } else {
        await this.asyncFactory.recordLogininfor(username, this.Constants.REGISTER, this.MessageUtils.message('user.register.success'))
      }
    }
    return msg
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
    const verifyKey = this.CacheConstants.CAPTCHA_CODE_KEY + this.StringUtils.nvl(uuid, '')
    const captcha = await this.redisCache.getCacheObject(verifyKey)
    await this.redisCache.deleteObject(verifyKey)
    if (captcha == null) {
      throw new this.CaptchaExpireException()
    }
    if (('' + code).toLowerCase() !== ('' + captcha).toLowerCase()) {
      throw new this.CaptchaException()
    }
  }
}
module.exports = SysRegisterService
