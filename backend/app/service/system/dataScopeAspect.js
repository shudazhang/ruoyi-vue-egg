const BaseService = require('./baseService.js')
class DataScopeAspect extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.securityUtils = this.ctx.service.system.securityUtils
  }
  /**
   * 全部数据权限
   */
  DATA_SCOPE_ALL = '1'

  /**
   * 自定数据权限
   */
  DATA_SCOPE_CUSTOM = '2'

  /**
   * 部门数据权限
   */
  DATA_SCOPE_DEPT = '3'

  /**
   * 部门及以下数据权限
   */
  DATA_SCOPE_DEPT_AND_CHILD = '4'

  /**
   * 仅本人数据权限
   */
  DATA_SCOPE_SELF = '5'

  /**
   * 数据权限过滤关键字
   */
  DATA_SCOPE = 'dataScope'

  async dataScope(deptAlias, userAlias) {
    // 获取当前的用户
    const loginUser = await this.securityUtils.getLoginUser()
    if (this.StringUtils.isNotNull(loginUser)) {
      const currentUser = loginUser.user
      // 如果是超级管理员，则不过滤数据
      if (this.StringUtils.isNotNull(currentUser) && !this.securityUtils.isAdmin(currentUser.userId)) {
        await this.dataScopeFilter(currentUser, deptAlias, userAlias, this.ctx.activeUser.permission)
      }
    }
  }
  async dataScopeFilter(user, deptAlias, userAlias, permission) {
    let sqlString = ''
    const conditions = []
    const scopeCustomIds = []
    user.roles.forEach((role) => {
      if (this.DATA_SCOPE_CUSTOM == role.dataScope && role.permissions.includes(permission)) {
        scopeCustomIds.push(role.roleId)
      }
    })

    for (const role of user.roles) {
      const dataScope = role.dataScope
      if (conditions.includes(dataScope)) {
        continue
      }
      if (!role.permissions.includes(permission)) {
        continue
      }
      if (this.DATA_SCOPE_ALL == dataScope) {
        sqlString = ''
        conditions.push(dataScope)
        break
      } else if (this.DATA_SCOPE_CUSTOM == dataScope) {
        if (scopeCustomIds.length > 1) {
          sqlString += ` OR ${deptAlias}.dept_id IN (SELECT dept_id FROM sys_role_dept WHERE role_id IN (${scopeCustomIds.join(',')})) `
        } else {
          sqlString += ` OR ${deptAlias}.dept_id IN (SELECT dept_id FROM sys_role_dept WHERE role_id = ${role.roleId}) `
        }
      } else if (this.DATA_SCOPE_DEPT == dataScope) {
        sqlString += ` OR ${deptAlias}.dept_id = ${user.deptId} `
      } else if (this.DATA_SCOPE_DEPT_AND_CHILD == dataScope) {
        sqlString += ` OR ${deptAlias}.dept_id IN (SELECT dept_id FROM sys_dept WHERE dept_id = ${user.deptId} OR find_in_set(${user.deptId}, ancestors)) `
      } else if (this.DATA_SCOPE_SELF == (dataScope)) {
        if(userAlias){
            sqlString += ` OR ${userAlias}.user_id = ${user.userId}  `
        }else{
            sqlString += ` OR ${deptAlias}.dept_id = 0  `
        }
      }
      conditions.push(dataScope)
    }

    // 角色都不包含传递过来的权限字符，这个时候sqlString也会为空，所以要限制一下,不查询任何数据
    if (this.StringUtils.isEmpty(conditions)) {
      sqlString += ` OR ${deptAlias}.dept_id = 0 `
    }

    if (sqlString) {
      this.ctx.params[this.DATA_SCOPE] = `AND (${sqlString.substring(4)})`
    }
  }
}
module.exports = DataScopeAspect
