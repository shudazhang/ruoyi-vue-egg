const { Service } = require('egg')
class SysPermissionService extends Service {
  constructor(ctx) {
    super(ctx)
    this.menuService = this.ctx.service.system.sysMenuService
    this.roleService = this.ctx.service.system.sysRoleService
    this.securityUtils = this.ctx.service.system.securityUtils
  }
  /**
   * 获取角色数据权限
   *
   * @param user 用户信息
   * @return 角色权限信息
   */
  async getRolePermission(user) {
    let roles = []
    if (this.securityUtils.isAdmin(user.userId)) {
      roles.push('admin')
    } else {
      roles = await this.roleService.selectRolePermissionByUserId(user.userId)
    }
    return roles
  }
  /**
   * 获取菜单数据权限
   *
   * @param user 用户信息
   * @return 菜单权限信息
   */
  async getMenuPermission(user) {
    let perms = []
    if (this.securityUtils.isAdmin(user.userId)) {
      perms.push('*:*:*')
    } else {
      let roles = user.roles
      if (roles && roles.length > 0) {
        for (let role of roles) {
          const rolePerms = await this.menuService.selectMenuPermsByRoleId(role.roleId)
          role.permissions = rolePerms
          perms = perms.concat(rolePerms)
        }
      } else {
        perms = perms.concat(await this.menuService.selectMenuPermsByUserId(user.userId))
      }
    }
    return perms
  }
}

module.exports = SysPermissionService
