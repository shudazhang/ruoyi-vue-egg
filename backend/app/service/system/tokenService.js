const BaseService = require('./baseService.js')
const useragent = require('useragent')
class TokenService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.expireTime = this.app.config.jwt.expiresIn
  }
  MILLIS_MINUTE_TEN = 20 * 60 * 1000
  /**
   * 获取用户身份信息
   *
   * @return 用户信息
   */
  async getLoginUser() {
    let token = await this.getToken()

    if (this.StringUtils.isNotEmpty(token)) {
      try {
        const claims = await this.ctx.app.jwt.verify(token)
        const uuid = claims[this.Constants.LOGIN_USER_KEY]
        const userKey = this.getTokenKey(uuid)
        let user = await this.redisCache.getCacheObject(userKey)
        if (user) {
          user = JSON.parse(user)
        }
        return user
      } catch (e) {
        throw new this.ServiceException('获取用户信息异常', this.HttpStatus.UNAUTHORIZED)
      }
    }
    return null
  }

  /**
   * 设置用户身份信息
   */
  setLoginUser(loginUser) {
    if (this.StringUtils.isNotNull(loginUser) && this.StringUtils.isNotEmpty(loginUser.token)) {
      return this.refreshToken(loginUser)
    }
  }
  /**
   * 删除用户身份信息
   */
  async delLoginUser(token) {
    if (this.StringUtils.isNotEmpty(token)) {
      const userKey = this.getTokenKey(token)
      this.redisCache.deleteObject(userKey)
    }
  }

  /**
   * 创建令牌
   *
   * @param loginUser 用户信息
   * @return 令牌
   */
  async createToken(loginUser) {
    const token = this.IdUtils.fastUUID()
    loginUser.token = token
    await this.setUserAgent(loginUser)
    await this.refreshToken(loginUser)
    return this.app.jwt.sign({ [this.Constants.LOGIN_USER_KEY]: loginUser.token }, this.app.config.jwt.secret, { expiresIn: this.app.config.jwt.expiresIn })
  }
  /**
   * 验证令牌有效期，相差不足20分钟，自动刷新缓存
   *
   * @param loginUser
   * @return 令牌
   */
  async verifyToken(loginUser) {
    const expireTime = loginUser.expireTime
    const currentTime = new Date().getTime()
    if (expireTime - currentTime <= this.MILLIS_MINUTE_TEN) {
      await this.refreshToken(loginUser)
    }
  }
  /**
   * 刷新令牌有效期
   *
   * @param loginUser 登录信息
   */
  async refreshToken(loginUser) {
    loginUser.loginTime = new Date().getTime()
    loginUser.expireTime = loginUser.loginTime + this.expireTime
    // 根据uuid将loginUser缓存
    const userKey = this.getTokenKey(loginUser.token)
    await this.redisCache.setCacheObjectWithTimeout(userKey, JSON.stringify(loginUser), this.expireTime / 1000)
  }
  /**
   * 设置用户代理信息
   *
   * @param loginUser 登录信息
   */
  async setUserAgent(loginUser) {
    const userAgent = useragent.parse(this.ctx.request.headers['user-agent'])
    const ip = this.ctx.ip
    loginUser.ipaddr = ip
    loginUser.loginLocation = await this.addressUtils.getRealAddressByIP(this.ctx.ip)
    loginUser.browser = userAgent.toAgent()
    loginUser.os = userAgent.os.toString()
  }

  /**
   * 获取请求token
   *
   * @param request
   * @return token
   */
  async getToken() {
    let token = this.ctx.get(this.ctx.app.config.jwt.header)

    if (this.StringUtils.isNotEmpty(token) && token.startsWith(this.Constants.TOKEN_PREFIX)) {
      token = token.replace(this.Constants.TOKEN_PREFIX, '')
    }
    return token
  }

  getTokenKey(uuid) {
    return this.CacheConstants.LOGIN_TOKEN_KEY + uuid
  }
}
module.exports = TokenService
