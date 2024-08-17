const BaseController = require('./baseController.js')
/**
 * 在线用户监控
 *
 * @author ruoyi
 */
class SysUserOnlineController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.userOnlineService = this.ctx.service.system.sysUserOnlineService
  }
  async list() {
    try {
      const ipaddr = this.ctx.query.ipaddr
      const userName = this.ctx.query.userName

      const keys = await this.redisCache.keys(this.CacheConstants.LOGIN_TOKEN_KEY + '*')
      let userOnlineList = []
      for (const key of keys) {
        let user = await this.redisCache.getCacheObject(key)
        user = JSON.parse(user)
        if (this.StringUtils.isNotEmpty(ipaddr) && this.StringUtils.isNotEmpty(userName)) {
          userOnlineList.push(await this.userOnlineService.selectOnlineByInfo(ipaddr, userName, user))
        } else if (this.StringUtils.isNotEmpty(ipaddr)) {
          userOnlineList.push(await this.userOnlineService.selectOnlineByIpaddr(ipaddr, user))
        } else if (this.StringUtils.isNotEmpty(userName) && this.StringUtils.isNotNull(user.user)) {
          userOnlineList.push(await this.userOnlineService.selectOnlineByUserName(userName, user))
        } else {
          userOnlineList.push(await this.userOnlineService.loginUserToUserOnline(user))
        }
      }
      userOnlineList.reverse()
      userOnlineList = userOnlineList.filter((item) => item != null)
      this.ctx.body = this.getDataTable({ rows: userOnlineList, count: userOnlineList.length })
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async forceLogout() {
    try {
      const tokenId = this.ctx.params.tokenId
      await this.redisCache.deleteObject(this.CacheConstants.LOGIN_TOKEN_KEY + tokenId)
      this.ctx.body = this.success()
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}

module.exports = SysUserOnlineController
