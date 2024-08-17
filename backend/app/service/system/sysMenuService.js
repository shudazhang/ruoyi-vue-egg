const BaseService = require('./baseService.js')
class SysMenuService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.menuMapper = this.ctx.service.system.mapper.sysMenuMapper
    this.securityUtils = this.ctx.service.system.securityUtils
    this.roleMapper = this.ctx.service.system.mapper.sysRoleMapper
    this.roleMenuMapper = this.ctx.service.system.mapper.sysRoleMenuMapper
  }
  /**
   * 查询系统菜单列表
   *
   * @param menu 菜单信息
   * @return 菜单列表
   */
  async selectMenuList(menu, userId) {
    let menuList = null
    // 管理员显示所有菜单信息
    if (this.securityUtils.isAdmin(userId)) {
      menuList = await this.menuMapper.selectMenuList(menu)
    } else {
      menu.params = {
        userId: userId
      }
      menuList = await this.menuMapper.selectMenuListByUserId(menu)
    }
    return menuList
  }

  /**
   * 根据用户ID查询权限
   *
   * @param userId 用户ID
   * @return 权限列表
   */
  async selectMenuPermsByUserId(userId) {
    const perms = await this.menuMapper.selectMenuPermsByUserId(userId)
    const permsSet = perms
      .map((item) => item.trim().split(','))
      .flat()
      .filter((item) => !!item)
    return permsSet
  }

  /**
   * 根据角色ID查询权限
   *
   * @param roleId 角色ID
   * @return 权限列表
   */
  async selectMenuPermsByRoleId(roleId) {
    const perms = await this.menuMapper.selectMenuPermsByRoleId(roleId)
    const permsSet = perms
      .map((item) => item.trim().split(','))
      .flat()
      .filter((item) => !!item)
    return permsSet
  }
  /**
   * 根据用户ID查询菜单
   *
   * @param userId 用户名称
   * @return 菜单列表
   */
  async selectMenuTreeByUserId(userId) {
    let menus = []
    if (this.securityUtils.isAdmin(userId)) {
      menus = await this.menuMapper.selectMenuTreeAll()
    } else {
      menus = await this.menuMapper.selectMenuTreeByUserId(userId)
    }
    menus = JSON.parse(JSON.stringify(menus))
    return this.getChildPerms(menus, 0)
  }
  /**
   * 根据角色ID查询菜单树信息
   *
   * @param roleId 角色ID
   * @return 选中菜单列表
   */
  async selectMenuListByRoleId(roleId) {
    const role = await this.roleMapper.selectRoleById(roleId)
    return this.menuMapper.selectMenuListByRoleId(roleId, role.menuCheckStrictly)
  }

  /**
   * 构建前端路由所需要的菜单
   *
   * @param menus 菜单列表
   * @return 路由列表
   */
  buildMenus(menus) {
    const routers = []
    for (let menu of menus) {
      const router = {}
      router.hidden = '1' === menu.visible
      router.name = this.getRouteName(menu)
      router.path = this.getRouterPath(menu)
      router.component = this.getComponent(menu)
      router.query = menu.query
      router.meta = {
        title: menu.menuName,
        icon: menu.icon,
        noCache: '1' === menu.isCache,
        link: menu.path.startsWith('http') ? menu.path : null
      }
      const cMenus = menu.children
      if (this.StringUtils.isNotEmpty(cMenus) && this.UserConstants.TYPE_DIR === menu.menuType) {
        router.alwaysShow = true
        router.redirect = 'noRedirect'
        router.children = this.buildMenus(cMenus)
      } else if (this.isMenuFrame(menu)) {
        router.meta = null
        const childrenList = []
        const children = {}
        children.path = menu.path
        children.component = menu.component
        children.name = this.getRouteName2(menu.routeName, menu.path)
        children.meta = {
          title: menu.menuName,
          icon: menu.icon,
          noCache: '1' === menu.isCache,
          link: menu.path.startsWith('http') ? menu.path : null
        }
        children.query = menu.query
        childrenList.push(children)
        router.children = childrenList
      } else if (menu.parentId == 0 && this.isInnerLink(menu)) {
        router.meta = {
          title: menu.menuName,
          icon: menu.icon
        }
        router.path = '/'
        const childrenList = []
        const children = {}
        const routerPath = this.innerLinkReplaceEach(menu.path)
        children.path = routerPath
        children.component = this.UserConstants.INNER_LINK
        children.name = this.getRouteName2(menu.routeName, routerPath)
        children.meta = {
          title: menu.menuName,
          icon: menu.icon,
          link: menu.path.startsWith('http') ? menu.path : null
        }
        childrenList.push(children)
        router.children = childrenList
      }
      routers.push(router)
    }
    return routers
  }
  buildMenuTree(menus) {
    let returnList = []
    const tempList = menus.map((menu) => menu.id)

    for (let menu of menus) {
      // 如果是顶级节点, 遍历该父节点的所有子节点
      if (!tempList.includes(menu.parentId)) {
        this.recursionFn(menus, menu)
        returnList.push(menu)
      }
    }

    if (returnList.length === 0) {
      returnList = [...menus]
    }
    return returnList
  }
  /**
   * 构建前端所需要下拉树结构
   *
   * @param menus 菜单列表
   * @return 下拉树结构列表
   */
  buildMenuTreeSelect(menus) {
    menus = JSON.parse(JSON.stringify(menus))
    menus = menus.map((item) => {
      return { id: item.menuId, label: item.menuName, parentId: item.parentId }
    })
    let menuTrees = this.buildMenuTree(menus)
    return menuTrees
  }
  /**
   * 根据菜单ID查询信息
   *
   * @param menuId 菜单ID
   * @return 菜单信息
   */
  selectMenuById(menuId) {
    return this.menuMapper.selectMenuById(menuId)
  }

  /**
   * 是否存在菜单子节点
   *
   * @param menuId 菜单ID
   * @return 结果
   */
  async hasChildByMenuId(menuId) {
    const result = await this.menuMapper.hasChildByMenuId(menuId)
    return result > 0
  }

  /**
   * 查询菜单使用数量
   *
   * @param menuId 菜单ID
   * @return 结果
   */
  async checkMenuExistRole(menuId) {
    const result = await this.roleMenuMapper.checkMenuExistRole(menuId)
    return result > 0
  }
  /**
   * 新增保存菜单信息
   *
   * @param menu 菜单信息
   * @return 结果
   */
  insertMenu(menu) {
    return this.menuMapper.insertMenu(menu)
  }
  /**
   * 修改保存菜单信息
   *
   * @param menu 菜单信息
   * @return 结果
   */
  updateMenu(menu) {
    return this.menuMapper.updateMenu(menu)
  }

  /**
   * 删除菜单管理信息
   *
   * @param menuId 菜单ID
   * @return 结果
   */
  deleteMenuById(menuId) {
    return this.menuMapper.deleteMenuById(menuId)
  }

  /**
   * 校验菜单名称是否唯一
   *
   * @param menu 菜单信息
   * @return 结果
   */
  async checkMenuNameUnique(menu) {
    const menuId = this.StringUtils.isNull(menu.menuId) ? -1 : menu.menuId
    const info = await this.menuMapper.checkMenuNameUnique(menu.menuName, menu.parentId)
    if (this.StringUtils.isNotNull(info) && info.menuId != menuId) {
      return this.UserConstants.NOT_UNIQUE
    }
    return this.UserConstants.UNIQUE
  }
  /**
   * 获取路由名称
   *
   * @param menu 菜单信息
   * @return 路由名称
   */
  getRouteName(menu) {
    // 非外链并且是一级目录（类型为目录）
    if (this.isMenuFrame(menu)) {
      return this.StringUtils.EMPTY
    }
    return this.getRouteName2(menu.routeName, menu.path)
  }
  /**
   * 获取路由名称，如没有配置路由名称则取路由地址
   *
   * @param routerName 路由名称
   * @param path 路由地址
   * @return 路由名称（驼峰格式）
   */
  getRouteName2(name, path) {
    const routerName = this.StringUtils.isNotEmpty(name) ? name : path
    return routerName.charAt(0).toUpperCase() + routerName.slice(1)
  }

  /**
   * 获取路由地址
   *
   * @param menu 菜单信息
   * @return 路由地址
   */
  getRouterPath(menu) {
    let routerPath = menu.path
    // 内链打开外网方式
    if (menu.parentId != 0 && this.isInnerLink(menu)) {
      routerPath = this.innerLinkReplaceEach(routerPath)
    }
    // 非外链并且是一级目录（类型为目录）
    if (0 == menu.parentId && this.UserConstants.TYPE_DIR === menu.menuType && this.UserConstants.NO_FRAME === menu.isFrame) {
      routerPath = '/' + menu.path
    }
    // 非外链并且是一级目录（类型为菜单）
    else if (this.isMenuFrame(menu)) {
      routerPath = '/'
    }
    return routerPath
  }

  /**
   * 获取组件信息
   *
   * @param menu 菜单信息
   * @return 组件信息
   */
  getComponent(menu) {
    let component = this.UserConstants.LAYOUT
    if (this.StringUtils.isNotEmpty(menu.component) && !this.isMenuFrame(menu)) {
      component = menu.component
    } else if (this.StringUtils.isEmpty(menu.component) && menu.parentId != 0 && this.isInnerLink(menu)) {
      component = this.UserConstants.INNER_LINK
    } else if (this.StringUtils.isEmpty(menu.component) && this.isParentView(menu)) {
      component = this.UserConstants.PARENT_VIEW
    }
    return component
  }

  /**
   * 是否为菜单内部跳转
   *
   * @param menu 菜单信息
   * @return 结果
   */
  isMenuFrame(menu) {
    return menu.parentId == 0 && this.UserConstants.TYPE_MENU === menu.menuType && menu.isFrame === this.UserConstants.NO_FRAME
  }

  /**
   * 是否为内链组件
   *
   * @param menu 菜单信息
   * @return 结果
   */
  isInnerLink(menu) {
    return menu.isFrame === this.UserConstants.NO_FRAME && this.StringUtils.ishttp(menu.path)
  }

  /**
   * 是否为parent_view组件
   *
   * @param menu 菜单信息
   * @return 结果
   */
  isParentView(menu) {
    return menu.parentId != 0 && this.UserConstants.TYPE_DIR === menu.menuType
  }

  /**
   * 根据父节点的ID获取所有子节点
   *
   * @param list 分类表
   * @param parentId 传入的父节点ID
   * @return String
   */
  getChildPerms(list, parentId) {
    // 创建一个对象来存储所有节点，key为menuId，value为节点本身
    let nodeMap = {}
    list.forEach((node) => {
      nodeMap[node.menuId] = node
    })

    // 创建一个空数组用于存储子节点
    let childNodes = []

    // 遍历整个列表
    list.forEach((node) => {
      // 如果当前元素的parentId与传入的parentId相等，则将其视为子节点
      if (node.parentId === parentId) {
        // 使用nodeMap快速获取当前节点的所有子节点，并递归构建子树
        node.children = this.getChildPerms(list, node.menuId)
        // 将当前节点添加到childNodes数组中
        childNodes.push(node)
      }
    })

    // 返回所有找到的子节点组成的数组
    return childNodes
  }

  /**
   * 递归列表
   *
   * @param {Array} list 分类表
   * @param {Object} t 子节点
   */
  recursionFn(list, t) {
    // 得到子节点列表
    const childList = this.getChildList(list, t)
    t.children = childList
    for (const tChild of childList) {
      if (this.hasChild(list, tChild)) {
        this.recursionFn(list, tChild)
      }
    }
  }

  /**
   * 获取子节点列表
   *
   * @param {Array} list 分类表
   * @param {Object} parent 父节点
   * @returns {Array} 子节点列表
   */
  getChildList(list, parent) {
    return list.filter((item) => item.parentId === parent.id)
  }

  /**
   * 判断是否有子节点
   *
   * @param {Array} list 分类表
   * @param {Object} node 节点
   * @returns {boolean} 是否有子节点
   */
  hasChild(list, node) {
    return list.some((item) => item.parentId === node.id)
  }
  /**
   * 内链域名特殊字符替换
   *
   * @return 替换后的内链域名
   */
  innerLinkReplaceEach(path) {
    return this.StringUtils.replaceEach(path, [this.Constants.HTTP, this.Constants.HTTPS, this.Constants.WWW, '.', ':'], ['', '', '', '/', '/'])
  }
}
module.exports = SysMenuService
