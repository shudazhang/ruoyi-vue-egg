const BaseController = require('./baseController.js')
/**
 * 登录验证
 *
 * @author ruoyi
 */
class SysLoginController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.loginService = this.ctx.service.system.sysLoginService
    this.securityUtils = this.ctx.service.system.securityUtils
    this.permissionService = this.ctx.service.system.sysPermissionService
    this.menuService = this.ctx.service.system.sysMenuService
    this.tokenService = this.ctx.service.system.tokenService
    this.asyncFactory = this.ctx.service.system.asyncFactory
  }

  /**
   * 登录方法
   *
   * @param loginBody 登录信息
   * @return 结果
   */
  async login() {
    try {
      const loginBody = this.ctx.request.body
      const ajax = this.AjaxResult.success()
      const token = await this.loginService.login(loginBody.username, loginBody.password, loginBody.code, loginBody.uuid)
      ajax[this.Constants.TOKEN] = token
      this.ctx.body = ajax
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 获取用户信息
   *
   * @return 用户信息
   */
  async getInfo() {
    try {
      const user = (await this.securityUtils.getLoginUser()).user
      // 角色集合
      const roles = await this.permissionService.getRolePermission(user)
      // 权限集合
      const permissions = await this.permissionService.getMenuPermission(user)
      const ajax = this.AjaxResult.success()
      ajax.user = user
      ajax.roles = roles
      ajax.permissions = permissions
      this.ctx.body = ajax
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 获取路由信息
   *
   * @return 路由信息
   */
  async getRouters() {
    try {
      const userId = await this.securityUtils.getUserId()
      const menus = await this.menuService.selectMenuTreeByUserId(userId)
      this.ctx.body = this.success(this.menuService.buildMenus(menus))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 退出处理
   *
   * @return
   */
  async onLogoutSuccess() {
    try {
      let loginUser = await this.tokenService.getLoginUser()
      if (this.StringUtils.isNotNull(loginUser)) {
        const userName = loginUser.user.userName
        // 删除用户缓存记录
        await this.tokenService.delLoginUser(loginUser.token)
        // 记录用户退出日志
        await this.asyncFactory.recordLogininfor(userName, this.Constants.LOGOUT, this.MessageUtils.message('user.logout.success'))
      }
    } catch (error) {}
    this.ctx.body = this.AjaxResult.success(this.MessageUtils.message('user.logout.success'))
  }
}

module.exports = SysLoginController
