const BaseController = require('./baseController.js')
/**
 * 菜单信息
 * 
 * @author ruoyi
 */
class SysMenuController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.menuService = this.ctx.service.system.sysMenuService
  }
  /**
   * 获取菜单列表
   */
  async list() {
    try {
      const menu = this.ctx.query
      const list = await this.menuService.selectMenuList(menu, await this.getUserId())
      this.ctx.body = this.success(list)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }

  /**
   * 根据菜单编号获取详细信息
   */
  async getInfo() {
    try {
      const menuId = this.ctx.params.menuId
      this.ctx.body = this.success(await this.menuService.selectMenuById(menuId))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 获取菜单下拉树列表
   */
  async treeselect() {
    try {
      const menu = this.ctx.query
      const menus = await this.menuService.selectMenuList(menu, await this.getUserId())
      this.ctx.body = this.success(this.menuService.buildMenuTreeSelect(menus))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 加载对应角色菜单列表树
   */
  async roleMenuTreeselect() {
    try {
      const roleId = this.ctx.params.roleId
      const menus = await this.menuService.selectMenuList({}, await this.getUserId())
      const ajax = this.AjaxResult.success()
      ajax.checkedKeys = await this.menuService.selectMenuListByRoleId(roleId)
      ajax.menus = this.menuService.buildMenuTreeSelect(menus)
      this.ctx.body = ajax
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 新增菜单
   */
  async add() {
    try {
      const menu = this.ctx.request.body
      if (!(await this.menuService.checkMenuNameUnique(menu))) {
        return (this.ctx.body = this.error("新增菜单'" + menu.menuName + "'失败，菜单名称已存在"))
      } else if (this.UserConstants.YES_FRAME == menu.isFrame && !this.StringUtils.ishttp(menu.path)) {
        return (this.ctx.body = this.error("新增菜单'" + menu.menuName + "'失败，地址必须以http(s)://开头"))
      }
      menu.createBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.menuService.insertMenu(menu))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 修改菜单
   */
  async edit() {
    try {
      const menu = this.ctx.request.body
      if (!(await this.menuService.checkMenuNameUnique(menu))) {
        return (this.ctx.body = this.error("修改菜单'" + menu.menuName + "'失败，菜单名称已存在"))
      } else if (this.UserConstants.YES_FRAME == menu.isFrame && !this.StringUtils.ishttp(menu.path)) {
        return (this.ctx.body = this.error("修改菜单'" + menu.menuName + "'失败，地址必须以http(s)://开头"))
      } else if (menu.menuId == menu.parentId) {
        return (this.ctx.body = this.error("修改菜单'" + menu.menuName + "'失败，上级菜单不能选择自己"))
      }
      menu.updateBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.menuService.updateMenu(menu))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 删除菜单
   */
  async remove() {
    try {
      const menuId = this.ctx.params.menuId
      if (await this.menuService.hasChildByMenuId(menuId)) {
        return (this.ctx.body = this.warn('存在子菜单,不允许删除'))
      }
      if (await this.menuService.checkMenuExistRole(menuId)) {
        return (this.ctx.body = this.warn('菜单已分配,不允许删除'))
      }
      this.ctx.body = this.toAjax(await this.menuService.deleteMenuById(menuId))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}

module.exports = SysMenuController
