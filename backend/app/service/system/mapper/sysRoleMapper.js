const { Service } = require('egg')

class SysRoleMapper extends Service {
  /**
   * 根据条件分页查询角色数据
   *
   * @param role 角色信息
   * @return 角色数据集合信息
   */
  async selectRoleList(role) {
    let sqlStr = ` 
    select 
      distinct 
      r.role_id as roleId, 
      r.role_name as roleName, 
      r.role_key as roleKey, 
      r.role_sort as roleSort, 
      r.data_scope as dataScope, 
      r.menu_check_strictly as menuCheckStrictly, 
      r.dept_check_strictly as deptCheckStrictly,
      r.status, 
      r.del_flag as delFlag, 
      r.create_time as createTime, 
      r.remark 
    from sys_role r
      left join sys_user_role ur on ur.role_id = r.role_id
      left join sys_user u on u.user_id = ur.user_id
      left join sys_dept d on u.dept_id = d.dept_id 
    where r.del_flag = '0'
    `
    if (role.roleId && role.roleId != 0) {
      sqlStr += ` AND r.role_id = '${role.roleId}'`
    }
    if (role.roleName) {
      sqlStr += ` AND r.role_name like concat('%', '${role.roleName}', '%')`
    }
    if (!['undefined', 'null', ''].includes('' + role.status)) {
      sqlStr += ` and r.status = '${role.status}'`
    }
    if (role.roleKey) {
      sqlStr += ` AND r.role_key like concat('%', '${role.roleKey}', '%')`
    }
    if (role['params[beginTime]'] || (role.params && role.params.beginTime)) {
      sqlStr += ` and date_format(r.create_time,'%Y%m%d') >= date_format('${role['params[beginTime]'] || (role.params && role.params.beginTime)}','%Y%m%d')`
    }
    if (role['params[endTime]'] || (role.params && role.params.endTime)) {
      sqlStr += ` and date_format(r.create_time,'%Y%m%d') <= date_format('${role['params[endTime]'] || (role.params && role.params.beginTime)}','%Y%m%d')`
    }

    if (this.ctx.params.dataScope) {
      sqlStr += ` ${this.ctx.params.dataScope}`
    }
    sqlStr += ` order by r.role_sort`
    let result = await this.ctx.model.query(sqlStr, { type: this.app.model.QueryTypes.SELECT })
    result = result.map((item) => ({ ...item, menuCheckStrictly: item.menuCheckStrictly == 1, deptCheckStrictly: item.deptCheckStrictly == 1 }))
    if (role.pageNum && role.pageSize) {
      const offset = parseInt(((role.pageNum || 1) - 1) * (role.pageSize || 10))
      const limit = parseInt(role.pageSize || 10)
      return {
        rows: result.slice(offset, offset + limit),
        count: result.length
      }
    } else {
      return result
    }
  }
  /**
   * 根据用户ID查询角色
   *
   * @param userId 用户ID
   * @return 角色列表
   */
  async selectRolePermissionByUserId(userId) {
    let userRoles = await this.app.model.System.SysUserRole.findAll({
      where: {
        userId
      }
    })
    let roleIds = userRoles.map((item) => item.roleId)
    return this.app.model.System.SysRole.findAll({
      where: {
        roleId: roleIds,
        delFlag: '0'
      }
    })
  }
  /**
   * 查询所有角色
   *
   * @return 角色列表
   */
  selectRoleAll() {
    return this.app.model.System.SysRole.findAll()
  }
  /**
   * 根据用户ID获取角色选择框列表
   *
   * @param userId 用户ID
   * @return 选中角色ID列表
   */
  async selectRoleListByUserId(userId) {
    let userRoles = await this.app.model.System.SysUserRole.findAll({
      where: {
        userId
      }
    })
    let roleIds = userRoles.map((item) => item.roleId)
    const roles = this.app.model.System.SysRole.findAll({
      attributes: ['roleId'],
      where: {
        roleId: roleIds,
        delFlag: '0'
      }
    })
    return roles.map((item) => item.roleId)
  }
  /**
   * 通过角色ID查询角色
   * 未完全实现
   * @param roleId 角色ID
   * @return 角色对象信息
   */
  selectRoleById(roleId) {
    return this.app.model.System.SysRole.findOne({ where: { roleId } })
  }
  /**
   * 根据用户ID查询角色
   *
   * @param userName 用户名
   * @return 角色列表
   */
  async selectRolesByUserName(userName) {
    const user = await this.app.model.System.SysUser.findOne({ where: { userName } })
    const userId = user.userId
    const userRoles = await this.app.model.System.SysUserRole.findAll({
      where: {
        userId
      }
    })
    const roleIds = userRoles.map((item) => item.roleId)
    return this.app.model.System.SysRole.findAll({
      where: {
        roleId: roleIds,
        delFlag: '0'
      }
    })
  }
  /**
   * 校验角色名称是否唯一
   *
   * @param roleName 角色名称
   * @return 角色信息
   */
  checkRoleNameUnique(roleName) {
    return this.app.model.System.SysRole.findOne({ where: { roleName: roleName, delFlag: '0' } })
  }
  /**
   * 校验角色权限是否唯一
   *
   * @param roleKey 角色权限
   * @return 角色信息
   */
  checkRoleKeyUnique(roleKey) {
    return this.app.model.System.SysRole.findOne({ where: { roleKey: roleKey, delFlag: '0' } })
  }
  /**
   * 修改角色信息
   *
   * @param role 角色信息
   * @return 结果
   */
  updateRole(role) {
    return this.app.model.System.SysRole.update({ ...role, updateTime: new Date() }, { where: { roleId: role.roleId } })
  }
  /**
   * 新增角色信息
   *
   * @param role 角色信息
   * @return 结果
   */
  insertRole(role) {
    return this.app.model.System.SysRole.create({ ...role, createTime: new Date() })
  }
  /**
   * 通过角色ID删除角色
   *
   * @param roleId 角色ID
   * @return 结果
   */
  deleteRoleById(roleId) {
    return this.app.model.System.SysRole.update({ delFlag: '2' }, { where: { roleId: roleId } })
  }
  /**
   * 批量删除角色信息
   *
   * @param roleIds 需要删除的角色ID
   * @return 结果
   */
  deleteRoleByIds(roleIds) {
    return this.app.model.System.SysRole.update({ delFlag: '2' }, { where: { roleId: roleIds } })
  }
}
module.exports = SysRoleMapper
