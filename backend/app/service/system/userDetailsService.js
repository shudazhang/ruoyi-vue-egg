const BaseService = require('./baseService.js')
class UserDetailsService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.userService = this.ctx.service.system.sysUserService
    this.passwordService = this.ctx.service.system.sysPasswordService
    this.permissionService = this.ctx.service.system.sysPermissionService
    this.asyncFactory = this.ctx.service.system.asyncFactory
  }
  async loadUserByUsername(username) {
    let user = await this.userService.selectUserByUserName(username)
    if (user) {
      user = JSON.parse(JSON.stringify(user))
    }
    if (this.StringUtils.isNull(user)) {
      this.ctx.logger.info(`登录用户：${username} 不存在.`)
      await this.asyncFactory.recordLogininfor(username, this.Constants.LOGIN_FAIL, this.MessageUtils.message('user.not.exists'))
      throw new this.ServiceException(this.MessageUtils.message('user.not.exists'))
    } else if (this.UserStatus.DELETED.code === user.delFlag) {
      this.ctx.logger.info(`登录用户：${username} 已被删除.`)
      await this.asyncFactory.recordLogininfor(username, this.Constants.LOGIN_FAIL, this.MessageUtils.message('user.password.delete'))
      throw new this.ServiceException(this.MessageUtils.message('user.password.delete'))
    } else if (this.UserStatus.DISABLE.code === user.status) {
      this.ctx.logger.info(`登录用户：${username} 已被停用.`)
      await this.asyncFactory.recordLogininfor(username, this.Constants.LOGIN_FAIL, this.MessageUtils.message('user.blocked'))
      throw new this.ServiceException(this.MessageUtils.message('user.blocked'))
    }
    await this.passwordService.validate(user)
    return this.createLoginUser(user)
  }
  async createLoginUser(user) {
    return { userId: user.userId, deptId: user.deptId, user, permissions: await this.permissionService.getMenuPermission(user) }
  }
}
module.exports = UserDetailsService
