const BaseService = require('./baseService.js')
class SysUserOnlineService extends BaseService {
  constructor(ctx) {
    super(ctx)
  }
  /**
   * 通过登录地址查询信息
   *
   * @param ipaddr 登录地址
   * @param user 用户信息
   * @return 在线用户信息
   */
  selectOnlineByIpaddr(ipaddr, user) {
    if (this.StringUtils.equals(ipaddr, user.ipaddr)) {
      return this.loginUserToUserOnline(user)
    }
    return null
  }
  /**
   * 通过用户名称查询信息
   *
   * @param userName 用户名称
   * @param user 用户信息
   * @return 在线用户信息
   */
  selectOnlineByUserName(userName, user) {
    if (this.StringUtils.equals(userName, user.user.userName)) {
      return this.loginUserToUserOnline(user)
    }
    return null
  }
  /**
   * 通过登录地址/用户名称查询信息
   *
   * @param ipaddr 登录地址
   * @param userName 用户名称
   * @param user 用户信息
   * @return 在线用户信息
   */
  selectOnlineByInfo(ipaddr, userName, user) {
    if (this.StringUtils.equals(ipaddr, user.ipaddr) && this.StringUtils.equals(userName, user.user.userName)) {
      return this.loginUserToUserOnline(user)
    }
    return null
  }
  /**
   * 设置在线用户信息
   *
   * @param user 用户信息
   * @return 在线用户
   */
  loginUserToUserOnline(user) {
    if (this.StringUtils.isNull(user) || this.StringUtils.isNull(user.user)) {
      return null
    }
    const sysUserOnline = {}
    sysUserOnline.tokenId = user.token
    sysUserOnline.userName = user.user.userName
    sysUserOnline.ipaddr = user.ipaddr
    sysUserOnline.loginLocation = user.loginLocation
    sysUserOnline.browser = user.browser
    sysUserOnline.os = user.os
    sysUserOnline.loginTime = user.loginTime
    if (this.StringUtils.isNotNull(user.user.dept)) {
      sysUserOnline.deptName = user.user.dept.deptName
    }
    return sysUserOnline
  }
}
module.exports = SysUserOnlineService
