const BaseService = require('./baseService.js')
class SysRoleService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.roleMapper = this.ctx.service.system.mapper.sysRoleMapper
    this.securityUtils = this.ctx.service.system.securityUtils
    this.roleMenuMapper = this.ctx.service.system.mapper.sysRoleMenuMapper
    this.roleDeptMapper = this.ctx.service.system.mapper.sysRoleDeptMapper
    this.userRoleMapper = this.ctx.service.system.mapper.sysUserRoleMapper
    this.dataScopeAspect = this.ctx.service.system.dataScopeAspect
  }

  /**
   * 根据条件分页查询角色数据
   *
   * @param role 角色信息
   * @return 角色数据集合信息
   */
  async selectRoleList(role) {
    await this.dataScopeAspect.dataScope('d', '')
    return this.roleMapper.selectRoleList(role)
  }
  /**
   * 根据用户ID查询角色
   *
   * @param userId 用户ID
   * @return 角色列表
   */
  async selectRolesByUserId(userId) {
    const userRoles = await this.roleMapper.selectRolePermissionByUserId(userId)
    const roles = await this.selectRoleAll()
    for (const role of roles) {
      for (const userRole of userRoles) {
        if (role.roleId == userRole.roleId) {
          role.flag = true
          break
        }
      }
    }
    return roles
  }
  /**
   * 根据用户ID查询角色权限
   *
   * @param userId 用户ID
   * @return 权限列表
   */
  async selectRolePermissionByUserId(userId) {
    const perms = await this.roleMapper.selectRolePermissionByUserId(userId)
    const permsSet = perms
      .map((item) => item.roleKey.trim().split(','))
      .flat()
      .filter((item) => !!item)
    return permsSet
  }

  /**
   * 查询所有角色
   *
   * @return 角色列表
   */
  selectRoleAll() {
    return this.selectRoleList({})
  }
  /**
   * 根据用户ID获取角色选择框列表
   *
   * @param userId 用户ID
   * @return 选中角色ID列表
   */
  selectRoleListByUserId(userId) {
    return this.roleMapper.selectRoleListByUserId(userId)
  }
  /**
   * 通过角色ID查询角色
   *
   * @param roleId 角色ID
   * @return 角色对象信息
   */
  selectRoleById(roleId) {
    return this.roleMapper.selectRoleById(roleId)
  }
  /**
   * 校验角色名称是否唯一
   *
   * @param role 角色信息
   * @return 结果
   */
  async checkRoleNameUnique(role) {
    const roleId = this.StringUtils.isNull(role.roleId) ? -1 : role.roleId
    const info = await this.roleMapper.checkRoleNameUnique(role.roleName)
    if (this.StringUtils.isNotNull(info) && info.roleId != roleId) {
      return this.UserConstants.NOT_UNIQUE
    }
    return this.UserConstants.UNIQUE
  }

  /**
   * 校验角色权限是否唯一
   *
   * @param role 角色信息
   * @return 结果
   */
  async checkRoleKeyUnique(role) {
    const roleId = this.StringUtils.isNull(role.roleId) ? -1 : role.roleId
    const info = await this.roleMapper.checkRoleKeyUnique(role.roleKey)
    if (this.StringUtils.isNotNull(info) && info.roleId != roleId) {
      return this.UserConstants.NOT_UNIQUE
    }
    return this.UserConstants.UNIQUE
  }
  /**
   * 校验角色是否允许操作
   *
   * @param role 角色信息
   */
  checkRoleAllowed(role) {
    if (this.StringUtils.isNotNull(role.roleId) && this.securityUtils.isAdmin(role.roleId)) {
      throw new this.ServiceException('不允许操作超级管理员角色')
    }
  }

  /**
   * 校验角色是否有数据权限
   *
   * @param roleIds 角色id
   */
  async checkRoleDataScope(roleIds) {
    if (!this.securityUtils.isAdmin(await this.securityUtils.getUserId())) {
      for (const roleId of roleIds) {
        const role = {}
        role.roleId = roleId
        const roles = await this.selectRoleList(role)
        if (this.StringUtils.isEmpty(roles)) {
          throw new this.ServiceException('没有权限访问角色数据！')
        }
      }
    }
  }

  /**
   * 通过角色ID查询角色使用数量
   *
   * @param roleId 角色ID
   * @return 结果
   */
  countUserRoleByRoleId(roleId) {
    return this.userRoleMapper.countUserRoleByRoleId(roleId)
  }
  /**
   * 新增保存角色信息
   *
   * @param role 角色信息
   * @return 结果
   */
  async insertRole(role) {
    // 新增角色信息
    const nRole = await this.roleMapper.insertRole(role)
    role.roleId = nRole.roleId
    return this.insertRoleMenu(role)
  }
  /**
   * 修改保存角色信息
   *
   * @param role 角色信息
   * @return 结果
   */
  async updateRole(role) {
    // 修改角色信息
    await this.roleMapper.updateRole(role)
    // 删除角色与菜单关联
    await this.roleMenuMapper.deleteRoleMenuByRoleId(role.roleId)
    return this.insertRoleMenu(role)
  }
  /**
   * 修改角色状态
   *
   * @param role 角色信息
   * @return 结果
   */
  updateRoleStatus(role) {
    return this.roleMapper.updateRole(role)
  }
  /**
   * 修改数据权限信息
   *
   * @param role 角色信息
   * @return 结果
   */
  async authDataScope(role) {
    // 修改角色信息
    await this.roleMapper.updateRole(role)
    // 删除角色与部门关联
    await this.roleDeptMapper.deleteRoleDeptByRoleId(role.roleId)
    // 新增角色和部门信息（数据权限）
    return this.insertRoleDept(role)
  }

  /**
   * 新增角色菜单信息
   *
   * @param role 角色对象
   */
  async insertRoleMenu(role) {
    let rows = 1
    // 新增用户与角色管理
    const list = []
    for (const menuId of role.menuIds) {
      const rm = {}
      rm.roleId = role.roleId
      rm.menuId = menuId
      list.push(rm)
    }
    if (list.length > 0) {
      rows = list.length
      await this.roleMenuMapper.batchRoleMenu(list)
    }
    return rows
  }

  /**
   * 新增角色部门信息(数据权限)
   *
   * @param role 角色对象
   */
  async insertRoleDept(role) {
    let rows = 1
    // 新增角色与部门（数据权限）管理
    const list = []
    for (const deptId of role.deptIds) {
      const rd = {}
      rd.roleId = role.roleId
      rd.deptId = deptId
      list.push(rd)
    }
    if (list.length > 0) {
      rows = list.length
      await this.roleDeptMapper.batchRoleDept(list)
    }
    return rows
  }
  /**
   * 通过角色ID删除角色
   *
   * @param roleId 角色ID
   * @return 结果
   */
  async deleteRoleById(roleId) {
    // 删除角色与菜单关联
    await this.roleMenuMapper.deleteRoleMenuByRoleId(roleId)
    // 删除角色与部门关联
    await this.roleDeptMapper.deleteRoleDeptByRoleId(roleId)
    return this.roleMapper.deleteRoleById(roleId)
  }

  /**
   * 批量删除角色信息
   *
   * @param roleIds 需要删除的角色ID
   * @return 结果
   */
  async deleteRoleByIds(roleIds) {
    for (const roleId of roleIds) {
      await this.checkRoleAllowed({ roleId })
      await this.checkRoleDataScope([roleId])
      const role = await this.selectRoleById(roleId)
      if ((await this.countUserRoleByRoleId(roleId)) > 0) {
        throw new this.ServiceException(`${role.roleName}已分配,不能删除`)
      }
    }
    // 删除角色与菜单关联
    await this.roleMenuMapper.deleteRoleMenu(roleIds)
    // 删除角色与部门关联
    await this.roleDeptMapper.deleteRoleDept(roleIds)
    return this.roleMapper.deleteRoleByIds(roleIds)
  }

  /**
   * 取消授权用户角色
   *
   * @param userRole 用户和角色关联信息
   * @return 结果
   */
  deleteAuthUser(userRole) {
    return this.userRoleMapper.deleteUserRoleInfo(userRole)
  }

  /**
   * 批量取消授权用户角色
   *
   * @param roleId 角色ID
   * @param userIds 需要取消授权的用户数据ID
   * @return 结果
   */
  deleteAuthUsers(roleId, userIds) {
    return this.userRoleMapper.deleteUserRoleInfos(roleId, userIds)
  }
  /**
   * 批量选择授权用户角色
   *
   * @param roleId 角色ID
   * @param userIds 需要授权的用户数据ID
   * @return 结果
   */
  insertAuthUsers(roleId, userIds) {
    // 新增用户与角色管理
    const list = []
    for (const userId of userIds) {
      const ur = {}
      ur.userId = userId
      ur.roleId = roleId
      list.push(ur)
    }
    return this.userRoleMapper.batchUserRole(list)
  }
}
module.exports = SysRoleService
