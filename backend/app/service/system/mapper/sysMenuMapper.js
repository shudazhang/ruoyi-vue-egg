const { Service } = require('egg')

class SysMenuMapper extends Service {
  /**
   * 查询系统菜单列表
   *
   * @param menu 菜单信息
   * @return 菜单列表
   */
  selectMenuList(menu) {
    const params = {
      where: {},
      order: [
        ['parentId', 'ASC'],
        ['orderNum', 'ASC']
      ]
    }
    if (menu.pageNum && menu.pageSize) {
      params.offset = parseInt(((menu.pageNum || 1) - 1) * (menu.pageSize || 10))
      params.limit = parseInt(menu.pageSize || 10)
    }
    if (menu.menuName) {
      params.where.menuName = {
        [this.app.Sequelize.Op.like]: `%${menu.menuName}%`
      }
    }
    if (!['undefined', 'null', ''].includes('' + menu.visible)) {
      params.where.visible = menu.visible
    }
    if (!['undefined', 'null', ''].includes('' + menu.status)) {
      params.where.status = menu.status
    }
    if (menu.pageNum && menu.pageSize) {
      return this.app.model.System.SysMenu.findAndCountAll(params)
    } else {
      return this.app.model.System.SysMenu.findAll(params)
    }
  }
  /**
   * 根据用户所有权限
   *
   * @return 权限列表
   */
  async selectMenuPerms(userId) {
    // 获取用户的角色
    const roles = await this.app.model.System.SysUserRole.findAll({
      where: { userId: userId },
      attributes: ['roleId']
    })
    // 根据角色获取菜单权限
    const roleIds = roles.map((role) => role.roleId)
    const perms = await this.app.model.System.SysMenu.findAll({
      where: {
        menu_id: {
          [this.app.Sequelize.Op.in]: (
            await this.app.model.System.SysRoleMenu.findAll({
              where: { roleId: { [this.app.Sequelize.Op.in]: roleIds } },
              attributes: ['menuId']
            })
          ).map((rm) => rm.menuId)
        }
      },
      attributes: ['perms'],
      distinct: true
    })
    return perms.map((p) => p.perms)
  }
  /**
   * 根据用户查询系统菜单列表
   *
   * @param menu 菜单信息
   * @return 菜单列表
   */
  async selectMenuListByUserId(menu) {
    const userRoles = await this.app.model.System.SysUserRole.findAll({ where: { userId: menu.params.userId } })
    const roleIds = userRoles.map((item) => item.roleId)
    const roleMenus = await this.app.model.System.SysRoleMenu.findAll({ where: { roleId: roleIds } })
    const menuIds = roleMenus.map((item) => item.menuId)
    const params = {
      where: {
        menuId: menuIds
      },
      order: [
        ['parentId', 'ASC'],
        ['orderNum', 'ASC']
      ]
    }
    if (menu.pageNum && menu.pageSize) {
      params.offset = parseInt(((menu.pageNum || 1) - 1) * (menu.pageSize || 10))
      params.limit = parseInt(menu.pageSize || 10)
    }
    if (menu.menuName) {
      params.where.menuName = {
        [this.app.Sequelize.Op.like]: `%${menu.menuName}%`
      }
    }
    if (!['undefined', 'null', ''].includes('' + menu.visible)) {
      params.where.visible = menu.visible
    }
    if (!['undefined', 'null', ''].includes('' + menu.status)) {
      params.where.status = menu.status
    }
    if (menu.pageNum && menu.pageSize) {
      return this.app.model.System.SysMenu.findAndCountAll(params)
    } else {
      return this.app.model.System.SysMenu.findAll(params)
    }
  }
  /**
   * 根据角色ID查询权限
   *
   * @param roleId 角色ID
   * @return 权限列表
   */
  async selectMenuPermsByRoleId(roleId) {
    const roleMenus = await this.app.model.System.SysRoleMenu.findAll({
      where: {
        roleId: roleId
      }
    })
    const menuIds = roleMenus.map((item) => item.menuId)
    const menus = await this.app.model.System.SysMenu.findAll({
      attributes: ['perms'],
      where: {
        menuId: menuIds,
        status: '0'
      }
    })
    return Array.from(new Set(menus.map((item) => item.perms)))
  }
  /**
   * 根据用户ID查询权限
   *
   * @param userId 用户ID
   * @return 权限列表
   */
  async selectMenuPermsByUserId(userId) {
    const userRoles = await this.app.model.System.SysUserRole.findAll({
      where: {
        userId
      }
    })
    let roleIds = userRoles.map((item) => item.roleId)

    const roles = await this.app.model.System.SysRole.findAll({
      attributes: ['roleId'],
      where: {
        roleId: roleIds,
        status: '0'
      }
    })
    roleIds = roles.map((item) => item.roleId)
    const roleMenus = await this.app.model.System.SysRoleMenu.findAll({
      where: {
        roleId: roleIds
      }
    })
    const menuIds = roleMenus.map((item) => item.menuId)
    const menus = await this.app.model.System.SysMenu.findAll({
      where: {
        menuId: menuIds,
        status: '0'
      }
    })
    return Array.from(new Set(menus.map((item) => item.perms)))
  }
  /**
   * 根据用户ID查询菜单
   *
   * @return 菜单列表
   */
  async selectMenuTreeAll() {
    return this.app.model.System.SysMenu.findAll({
      where: { menuType: ['M', 'C'], status: '0' },
      order: [
        ['parentId', 'ASC'],
        ['orderNum', 'ASC']
      ]
    })
  }

  /**
   * 根据用户ID查询菜单
   *
   * @param userId 用户名称
   * @return 菜单列表
   */
  async selectMenuTreeByUserId(userId) {
    const userRoles = await this.app.model.System.SysUserRole.findAll({ where: { userId } })
    let roleIds = userRoles.map((item) => item.roleId)
    const roles = await this.app.model.System.SysRole.findAll({ where: { roleId: roleIds, status: '0' } })
    roleIds = roles.map((item) => item.roleId)
    const roleMenus = await this.app.model.System.SysRoleMenu.findAll({ where: { roleId: roleIds } })
    const menuIds = roleMenus.map((item) => item.menuId)
    return this.app.model.System.SysMenu.findAll({
      where: { menuId: menuIds, menuType: ['M', 'C'], status: '0' },
      order: [
        ['parentId', 'asc'],
        ['orderNum', 'asc']
      ]
    })
  }
  /**
   * 根据角色ID查询菜单树信息
   *
   * @param roleId 角色ID
   * @param menuCheckStrictly 菜单树选择项是否关联显示
   * @return 选中菜单列表
   */
  async selectMenuListByRoleId(roleId, menuCheckStrictly) {
    const sysRoleMenus = await this.app.model.System.SysRoleMenu.findAll({
      where: {
        roleId: roleId
      }
    })
    const menuIds = sysRoleMenus.map((item) => item.menuId)
    const params = {
      where: {
        menuId: menuIds
      },
      order: [
        ['parentId', 'asc'],
        ['orderNum', 'asc']
      ]
    }
    let menus = await this.app.model.System.SysMenu.findAll(params)
    if (menuCheckStrictly) {
      const parentIds = menus.map((item) => item.parentId)
      menus = menus.filter((item) => !parentIds.includes(item.menuId))
    }
    return menus.map((item) => item.menuId)
  }
  /**
   * 根据菜单ID查询信息
   *
   * @param menuId 菜单ID
   * @return 菜单信息
   */
  selectMenuById(menuId) {
    return this.app.model.System.SysMenu.findOne({ where: { menuId } })
  }
  /**
   * 是否存在菜单子节点
   *
   * @param menuId 菜单ID
   * @return 结果
   */
  hasChildByMenuId(menuId) {
    return this.app.model.System.SysMenu.count({ where: { parentId: menuId } })
  }
  /**
   * 新增菜单信息
   *
   * @param menu 菜单信息
   * @return 结果
   */
  insertMenu(menu) {
    return this.app.model.System.SysMenu.create({ ...menu, createTime: new Date() })
  }

  /**
   * 修改菜单信息
   *
   * @param menu 菜单信息
   * @return 结果
   */
  updateMenu(menu) {
    return this.app.model.System.SysMenu.update({ ...menu, updateTime: new Date() }, { where: { menuId: menu.menuId } })
  }

  /**
   * 删除菜单管理信息
   *
   * @param menuId 菜单ID
   * @return 结果
   */
  deleteMenuById(menuId) {
    return this.app.model.System.SysMenu.destroy({ where: { menuId: menuId } })
  }
  /**
   * 校验菜单名称是否唯一
   *
   * @param menuName 菜单名称
   * @param parentId 父菜单ID
   * @return 结果
   */
  checkMenuNameUnique(menuName, parentId) {
    return this.app.model.System.SysMenu.findOne({
      where: {
        menuName,
        parentId
      }
    })
  }
}
module.exports = SysMenuMapper
