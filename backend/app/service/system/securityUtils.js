const BaseService = require('./baseService.js')
const bcrypt = require('bcrypt')
class SecurityUtils extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.tokenService = this.ctx.service.system.tokenService
  }
  /**
   * 用户ID
   **/
  async getUserId() {
    try {
      return (await this.getLoginUser()).userId;
    } catch (e) {
      throw new this.ServiceException('获取用户ID异常', this.HttpStatus.UNAUTHORIZED)
    }
  }
  /**
   * 获取部门ID
   **/
  async getDeptId() {
    try {
      return (await this.getLoginUser()).deptId;
    } catch (e) {
      throw new this.ServiceException('获取部门ID异常', this.HttpStatus.UNAUTHORIZED)
    }
  }
  /**
   * 获取用户账户
   **/
  async getUsername() {
    try {
      return (await this.getLoginUser()).user.userName;
    } catch (e) {
      throw new this.ServiceException('获取用户账户异常', this.HttpStatus.UNAUTHORIZED)
    }
  }
  /**
   * 获取用户
   **/
  async getLoginUser() {
    return await this.tokenService.getLoginUser()
  }
  /**
   * 生成BCryptPasswordEncoder密码
   *
   * @param password 密码
   * @return 加密字符串
   */
  async encryptPassword(password) {
    return await bcrypt.hash(password, 10)
  }
  /**
   * 判断密码是否相同
   *
   * @param rawPassword 真实密码
   * @param encodedPassword 加密后字符
   * @return 结果
   */
  async matchesPassword(rawPassword, encodedPassword) {
    return await bcrypt.compare(rawPassword, encodedPassword)
  }

  /**
   * 是否为管理员
   *
   * @param userId 用户ID
   * @return 结果
   */
  isAdmin(userId) {
    return userId != null && userId == 1
  }
  /**
   * 验证用户是否具备某权限
   *
   * @param permission 权限字符串
   * @return 用户是否具备某权限
   */
  async hasPermi(permission) {
    return (await this.getLoginUser()).permissions.some((x) => x && (x === this.Constants.ALL_PERMISSION || x === permission))
  }
  /**
   * 验证用户是否拥有某个角色
   *
   * @param role 角色标识
   * @return 用户是否具备某角色
   */
  async hasRole(role) {
    return (await this.getLoginUser()).user.roles.map((r) => r.roleKey).some((x) => x && (x === this.Constants.SUPER_ADMIN || x === role))
  }
}

// 导出类
module.exports = SecurityUtils
