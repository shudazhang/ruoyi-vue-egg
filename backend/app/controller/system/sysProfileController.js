const BaseController = require('./baseController.js')
/**
 * 个人信息 业务处理
 *
 * @author ruoyi
 */
class SysProfileController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.userService = this.ctx.service.system.sysUserService
    this.tokenService = this.ctx.service.system.tokenService
    this.RuoYiConfig = this.app.config.ruoYiConfig
  }

  /**
   * 个人信息
   */
  async profile() {
    try {
      const loginUser = await this.getLoginUser()
      const user = loginUser.user
      const ajax = this.success(user)
      ajax.roleGroup = await this.userService.selectUserRoleGroup(loginUser.user.userName)
      ajax.postGroup = await this.userService.selectUserPostGroup(loginUser.user.userName)
      this.ctx.body = ajax
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 修改用户
   */
  async updateProfile() {
    try {
      const user = this.ctx.request.body
      const loginUser = await this.getLoginUser()
      const currentUser = loginUser.user
      currentUser.nickName = user.nickName
      currentUser.email = user.email
      currentUser.phonenumber = user.phonenumber
      currentUser.sex = user.sex
      if (this.StringUtils.isNotEmpty(user.phonenumber) && !(await this.userService.checkPhoneUnique(currentUser))) {
        return (this.ctx.body = this.error("修改用户'" + loginUser.username + "'失败，手机号码已存在"))
      }
      if (this.StringUtils.isNotEmpty(user.email) && !(await this.userService.checkEmailUnique(currentUser))) {
        return (this.ctx.body = this.error("修改用户'" + loginUser.username + "'失败，邮箱账号已存在"))
      }
      if ((await this.userService.updateUserProfile(currentUser)) > 0) {
        // 更新缓存用户信息
        await this.tokenService.setLoginUser(loginUser)
        return (this.ctx.body = this.success())
      }
      return (this.ctx.body = this.error('修改个人信息异常，请联系管理员'))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 重置密码
   */
  async updatePwd() {
    try {
      const oldPassword = this.ctx.query.oldPassword
      let newPassword = this.ctx.query.newPassword
      const loginUser = await this.getLoginUser()
      const userName = loginUser.user.userName
      const password = loginUser.user.password

      if (!(await this.securityUtils.matchesPassword(oldPassword, password))) {
        return error('修改密码失败，旧密码错误')
      }
      if (await this.securityUtils.matchesPassword(newPassword, password)) {
        return error('新密码不能与旧密码相同')
      }
      newPassword = await this.securityUtils.encryptPassword(newPassword)
      if ((await this.userService.resetUserPwd(userName, newPassword)) > 0) {
        // 更新缓存用户密码
        loginUser.user.password = newPassword
        await this.tokenService.setLoginUser(loginUser)
        return (this.ctx.body = this.success())
      }
      return (this.ctx.body = this.error('修改密码异常，请联系管理员'))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 头像上传
   */
  async avatar() {
    try {
      const file = this.ctx.request.files[0]

      if (file) {
        const loginUser = await this.getLoginUser()
        const avatar = await this.fileUploadUtils.upload(this.RuoYiConfig.avatarPath, file, this.MimeTypeUtils.IMAGE_EXTENSION)
        if (await this.userService.updateUserAvatar(loginUser.user.userName, avatar)) {
          const ajax = this.AjaxResult.success()
          ajax.imgUrl = avatar
          // 更新缓存用户头像
          loginUser.user.avatar = avatar
          await this.tokenService.setLoginUser(loginUser)
          return (this.ctx.body = ajax)
        }
      }
      return (this.ctx.body = this.error('上传图片异常，请联系管理员'))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}

module.exports = SysProfileController
