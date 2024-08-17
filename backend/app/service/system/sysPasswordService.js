const BaseService = require('./baseService.js')
class SysPasswordService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.maxRetryCount = this.app.config.user.password.maxRetryCount
    this.lockTime = this.app.config.user.password.lockTime
    this.securityUtils = this.ctx.service.system.securityUtils
    this.asyncFactory = this.ctx.service.system.asyncFactory
  }
  /**
   * 登录账户密码错误次数缓存键名
   *
   * @param username 用户名
   * @return 缓存键key
   */
  getCacheKey(username) {
    return this.CacheConstants.PWD_ERR_CNT_KEY + username
  }
  async validate(user) {
    const username = this.ctx.request.body.username
    const password = this.ctx.request.body.password
    let retryCount = await this.redisCache.getCacheObject(this.getCacheKey(username))
    if (retryCount == null) {
      retryCount = 0
    }
    retryCount = parseInt(retryCount)
    if (retryCount >= this.maxRetryCount) {
      await this.asyncFactory.recordLogininfor(username, this.Constants.LOGIN_FAIL, this.MessageUtils.message('user.password.retry.limit.exceed'))
      throw new this.UserPasswordRetryLimitExceedException(this.maxRetryCount, this.lockTime)
    }
    if (!(await this.matches(user, password))) {
      retryCount = retryCount + 1
      await this.redisCache.setCacheObjectWithTimeout(this.getCacheKey(username), retryCount, 60 * this.lockTime)
      await this.asyncFactory.recordLogininfor(username, this.Constants.LOGIN_FAIL, this.MessageUtils.message('user.password.not.match'))
      throw new this.UserPasswordNotMatchException()
    } else {
      await this.clearLoginRecordCache(username)
    }
  }

  async matches(user, rawPassword) {
    return this.securityUtils.matchesPassword(rawPassword, user.password)
  }
  async clearLoginRecordCache(loginName) {
    if (await this.redisCache.hasKey(this.getCacheKey(loginName))) {
      await this.redisCache.deleteObject(this.getCacheKey(loginName))
    }
  }
}
module.exports = SysPasswordService
