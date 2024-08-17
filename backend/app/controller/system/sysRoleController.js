const BaseController = require('./baseController.js')
const ExcelJS = require('exceljs')

/**
 * 角色信息
 *
 * @author ruoyi
 */
class SysRoleController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.roleService = this.ctx.service.system.sysRoleService
    this.permissionService = this.ctx.service.system.sysPermissionService
    this.userService = this.ctx.service.system.sysUserService
    this.tokenService = this.ctx.service.system.tokenService
    this.deptService = this.ctx.service.system.sysDeptService
    this.securityUtils = this.ctx.service.system.securityUtils
  }
  async list() {
    try {
      const role = this.ctx.query
      
      const list = await this.roleService.selectRoleList(role)
      this.ctx.body = this.getDataTable(list)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async export() {
    try {
      const role = this.ctx.request.body
      const list = await this.roleService.selectRoleList(role)
      // 创建工作簿
      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('角色数据')

      // 添加表头
      sheet.columns = [
        { header: '角色序号', key: 'roleId' },
        { header: '角色名称', key: 'roleName' },
        { header: '角色权限', key: 'roleKey' },
        { header: '角色排序', key: 'roleSort' },
        { header: '数据范围', key: 'dataScope' },
        { header: '角色状态', key: 'status' }
      ]

      // 添加数据
      list.rows.forEach((item) => {
        if (item.dataScope === '1') {
          item.dataScope = '全部数据权限'
        } else if (item.dataScope === '2') {
          item.dataScope = '自定数据权限'
        } else if (item.dataScope === '3') {
          item.dataScope = '本部门数据权限'
        } else if (item.dataScope === '4') {
          item.dataScope = '本部门及以下数据权限）'
        }
        if (item.status === '0') {
          item.status = '正常'
        } else if (item.status === '1') {
          item.status = '停用'
        }
        sheet.addRow(item)
      })

      // 定义响应的形式
      const fileName = 'sys_role.xlsx'
      this.ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      this.ctx.set('Content-Disposition', `attachment; filename=${encodeURIComponent(fileName)}`)

      // 将Excel文件流输出到HTTP响应
      // 使用 writeBuffer 方法并等待Promise完成
      this.ctx.body = await workbook.xlsx.writeBuffer()
      this.ctx.status = 200
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 根据角色编号获取详细信息
   */
  async getInfo() {
    try {
      const roleId = this.ctx.params.roleId
      await this.roleService.checkRoleDataScope([roleId])
      this.ctx.body = this.success(await this.roleService.selectRoleById(roleId))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 新增角色
   */
  async add() {
    try {
      const role = this.ctx.request.body
      if (!(await this.roleService.checkRoleNameUnique(role))) {
        return (this.ctx.body = this.error("新增角色'" + role.roleName + "'失败，角色名称已存在"))
      } else if (!(await this.roleService.checkRoleKeyUnique(role))) {
        return (this.ctx.body = this.error("新增角色'" + role.roleName + "'失败，角色权限已存在"))
      }
      role.createBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.roleService.insertRole(role))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 修改保存角色
   */
  async edit() {
    try {
      const role = this.ctx.request.body
      await this.roleService.checkRoleAllowed(role)
      await this.roleService.checkRoleDataScope([role.roleId])
      if (!(await this.roleService.checkRoleNameUnique(role))) {
        return (this.ctx.body = this.error("修改角色'" + role.roleName + "'失败，角色名称已存在"))
      } else if (!(await this.roleService.checkRoleKeyUnique(role))) {
        return (this.ctx.body = this.error("修改角色'" + role.roleName + "'失败，角色权限已存在"))
      }
      role.updateBy = await this.getUsername()

      if ((await this.roleService.updateRole(role)) > 0) {
        // 更新缓存用户权限
        const loginUser = await this.getLoginUser()
        if (this.StringUtils.isNotNull(loginUser.user) && !this.securityUtils.isAdmin(loginUser.user.userId)) {
          loginUser.permissions = await this.permissionService.getMenuPermission(loginUser.user)
          loginUser.user = await this.userService.selectUserByUserName(loginUser.user.userName)
          await this.tokenService.setLoginUser(loginUser)
        }
        return (this.ctx.body = this.success())
      }
      this.ctx.body = this.error("修改角色'" + role.roleName + "'失败，请联系管理员")
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 修改保存数据权限
   */
  async dataScope() {
    try {
      const role = this.ctx.request.body
      await this.roleService.checkRoleAllowed(role)
      await this.roleService.checkRoleDataScope([role.roleId])
      this.ctx.body = this.toAjax(await this.roleService.authDataScope(role))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 状态修改
   */
  async changeStatus() {
    try {
      const role = this.ctx.request.body
      await this.roleService.checkRoleAllowed(role)
      await this.roleService.checkRoleDataScope([role.roleId])
      role.updateBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.roleService.updateRoleStatus(role))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 删除角色
   */
  async remove() {
    try {
      const roleIds = this.ctx.params.roleIds.split(',')
      this.ctx.body = this.toAjax(await this.roleService.deleteRoleByIds(roleIds))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 获取角色选择框列表
   */
  async optionselect() {
    try {
      this.ctx.body = this.success(await this.roleService.selectRoleAll())
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 查询已分配用户角色列表
   */
  async allocatedList() {
    try {
      const user = this.ctx.query
      const list = await this.userService.selectAllocatedList(user)
      this.ctx.body = this.getDataTable(list)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 查询未分配用户角色列表
   */
  async unallocatedList() {
    try {
      const user = this.ctx.query
      const list = await this.userService.selectUnallocatedList(user)
      this.ctx.body = this.getDataTable(list)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 取消授权用户
   */
  async cancelAuthUser() {
    try {
      const userRole = this.ctx.request.body
      this.ctx.body = this.toAjax(await this.roleService.deleteAuthUser(userRole))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 批量取消授权用户
   */
  async cancelAuthUserAll() {
    try {
      const roleId = this.ctx.query.roleId
      const userIds = this.ctx.query.userIds.split(',')
      this.ctx.body = this.toAjax(await this.roleService.deleteAuthUsers(roleId, userIds))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 批量选择用户授权
   */
  async selectAuthUserAll() {
    try {
      const roleId = this.ctx.query.roleId
      const userIds = this.ctx.query.userIds.split(',')
      await this.roleService.checkRoleDataScope([roleId])
      this.ctx.body = this.toAjax(await this.roleService.insertAuthUsers(roleId, userIds))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 获取对应角色部门树列表
   */
  async deptTree() {
    try {
      const roleId = this.ctx.params.roleId
      const ajax = this.AjaxResult.success()
      ajax.checkedKeys = await this.deptService.selectDeptListByRoleId(roleId)
      ajax.depts = await this.deptService.selectDeptTreeList({})
      this.ctx.body = ajax
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}

module.exports = SysRoleController
