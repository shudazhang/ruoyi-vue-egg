const BaseController = require('./baseController.js')
const ExcelJS = require('exceljs')
const fs = require('fs')
/**
 * 用户信息
 *
 * @author ruoyi
 */
class SysRoleController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.userService = this.ctx.service.system.sysUserService
    this.roleService = this.ctx.service.system.sysRoleService
    this.deptService = this.ctx.service.system.sysDeptService
    this.postService = this.ctx.service.system.sysPostService
    this.securityUtils = this.ctx.service.system.securityUtils
  }

  /**
   * 获取用户列表
   */
  async list() {
    try {
      const user = this.ctx.query
      const list = await this.userService.selectUserList(user)
      this.ctx.body = this.getDataTable(list)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async export() {
    try {
      const user = this.ctx.request.body
      const list = await this.userService.selectUserList(user)
      // 创建工作簿
      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('用户数据')

      // 添加表头
      sheet.columns = [
        { header: '用户序号', key: 'userId' },
        { header: '登录名称', key: 'userName' },
        { header: '用户名称', key: 'nickName' },
        { header: '用户邮箱', key: 'email' },
        { header: '手机号码', key: 'phonenumber' },
        { header: '用户性别', key: 'sex' },
        { header: '帐号状态', key: 'status' },
        { header: '最后登录IP', key: 'loginIp' },
        { header: '最后登录时间', key: 'loginDate' },
        { header: '部门名称', key: 'deptName' },
        { header: '部门负责人', key: 'leader' }
      ]

      // 添加数据
      list.rows.forEach((item) => {
        item.status = item.status === '0' ? '正常' : '停用'
        item.sex = item.sex === '0' ? '男' : item.sex === '1' ? '女' : '未知'
        item.deptName = item.dept.deptName
        item.leader = item.dept.leader
        sheet.addRow(item)
      })

      // 定义响应的形式
      const fileName = 'sys_user.xlsx'
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
  async importData() {
    try {
      const updateSupport = this.ctx.query.updateSupport
      for (const file of this.ctx.request.files) {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(file.filepath)
        const sheet = workbook.getWorksheet('用户数据')
        const userList = []
        sheet.eachRow(function (row, rowNumber) {
          if (rowNumber != 1) {
            userList.push({
              deptId: row.getCell(1).text,
              userName: row.getCell(2).text,
              nickName: row.getCell(3).text,
              email: row.getCell(4).text,
              phonenumber: row.getCell(5).text,
              sex: row.getCell(6).text,
              status: row.getCell(7).text
            })
          }
        })

        fs.unlinkSync(file.filepath)
        const operName = await this.getUsername();
        const message = await this.userService.importUser(userList, updateSupport, operName);
        return this.ctx.body = this.success(message);
      }
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async importTemplate() {
    try {
      // 创建工作簿
      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('用户数据')

      // 添加表头
      sheet.columns = [
        { header: '部门编号', key: 'deptId' },
        { header: '登录名称', key: 'userName' },
        { header: '用户名称', key: 'nickName' },
        { header: '用户邮箱', key: 'email' },
        { header: '手机号码', key: 'phonenumber' },
        { header: '用户性别', key: 'sex' },
        { header: '帐号状态', key: 'status' }
      ]

      // 定义响应的形式
      const fileName = 'sys_user_template.xlsx'
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
   * 根据用户编号获取详细信息
   */
  async getInfo() {
    try {
      const userId = this.ctx.params.userId
      await this.userService.checkUserDataScope(userId)
      const ajax = this.AjaxResult.success()
      const roles = await this.roleService.selectRoleAll()
      ajax.roles = this.securityUtils.isAdmin(userId) ? roles : roles.filter((r) => !this.securityUtils.isAdmin(r.roleId))
      ajax.posts = await this.postService.selectPostAll()
      if (this.StringUtils.isNotNull(userId)) {
        const sysUser = await this.userService.selectUserById(userId)
        ajax[this.AjaxResult.DATA_TAG] = sysUser
        ajax.postIds = await this.postService.selectPostListByUserId(userId)
        ajax.roleIds = sysUser.roles.map((r) => r.roleId)
      }
      this.ctx.body = ajax
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 新增用户
   */
  async add() {
    try {
      const user = this.ctx.request.body
      await this.deptService.checkDeptDataScope(user.deptId)
      await this.roleService.checkRoleDataScope(('' + user.roleIds).split(','))
      if (!(await this.userService.checkUserNameUnique(user))) {
        return (this.ctx.body = this.error("新增用户'" + user.userName + "'失败，登录账号已存在"))
      } else if (this.StringUtils.isNotEmpty(user.phonenumber) && !(await this.userService.checkPhoneUnique(user))) {
        return (this.ctx.body = this.error("新增用户'" + user.userName + "'失败，手机号码已存在"))
      } else if (this.StringUtils.isNotEmpty(user.email) && !(await this.userService.checkEmailUnique(user))) {
        return (this.ctx.body = this.error("新增用户'" + user.userName + "'失败，邮箱账号已存在"))
      }
      user.createBy = await this.getUsername()
      user.password = await this.securityUtils.encryptPassword(user.password)
      this.ctx.body = this.toAjax(await this.userService.insertUser(user))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 修改用户
   */
  async edit() {
    try {
      const user = this.ctx.request.body
      await this.userService.checkUserAllowed(user)
      await this.userService.checkUserDataScope(user.userId)
      await this.deptService.checkDeptDataScope(user.deptId)
      await this.roleService.checkRoleDataScope(('' + user.roleIds).split(','))
      if (!(await this.userService.checkUserNameUnique(user))) {
        return (this.ctx.body = this.error("新增用户'" + user.userName + "'失败，登录账号已存在"))
      } else if (this.StringUtils.isNotEmpty(user.phonenumber) && !(await this.userService.checkPhoneUnique(user))) {
        return (this.ctx.body = this.error("新增用户'" + user.userName + "'失败，手机号码已存在"))
      } else if (this.StringUtils.isNotEmpty(user.email) && !(await this.userService.checkEmailUnique(user))) {
        return (this.ctx.body = this.error("新增用户'" + user.userName + "'失败，邮箱账号已存在"))
      }
      user.updateBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.userService.updateUser(user))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 删除用户
   */
  async remove() {
    try {
      const userIds = this.ctx.params.userIds.split(',')
      if (userIds.includes(await this.getUserId())) {
        return (this.ctx.body = this.error('当前用户不能删除'))
      }
      this.ctx.body = this.toAjax(await this.userService.deleteUserByIds(userIds))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 重置密码
   */
  async resetPwd() {
    try {
      const user = this.ctx.request.body
      await this.userService.checkUserAllowed(user)
      await this.userService.checkUserDataScope(user.userId)
      user.password = await this.securityUtils.encryptPassword(user.password)
      user.updateBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.userService.resetPwd(user))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 状态修改
   */
  async changeStatus() {
    try {
      const user = this.ctx.request.body
      await this.userService.checkUserAllowed(user)
      await this.userService.checkUserDataScope(user.userId)
      user.updateBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.userService.updateUserStatus(user))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 根据用户编号获取授权角色
   */
  async authRole() {
    try {
      const userId = this.ctx.params.userId
      const ajax = this.AjaxResult.success()
      const user = await this.userService.selectUserById(userId)
      const roles = await this.roleService.selectRolesByUserId(userId)
      ajax.user = user
      ajax.roles = this.securityUtils.isAdmin(userId) ? roles : roles.filter((r) => !this.securityUtils.isAdmin(r.roleId))
      this.ctx.body = ajax
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 用户授权角色
   */
  async insertAuthRole() {
    try {
      const userId = this.ctx.query.userId
      const roleIds = this.ctx.query.roleIds.split(',')
      await this.userService.checkUserDataScope(userId)
      await this.roleService.checkRoleDataScope(roleIds)
      await this.userService.insertUserAuth(userId, roleIds)
      this.ctx.body = this.success()
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 获取部门树列表
   */
  async deptTree() {
    try {
      const dept = this.ctx.query
      this.ctx.body = this.success(await this.deptService.selectDeptTreeList(dept))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}

module.exports = SysRoleController
