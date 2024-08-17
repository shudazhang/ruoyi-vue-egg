const BaseService = require('./baseService.js')
class SysUserService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.userMapper = this.ctx.service.system.mapper.sysUserMapper
    this.securityUtils = this.ctx.service.system.securityUtils
    this.userPostMapper = this.ctx.service.system.mapper.sysUserPostMapper
    this.userRoleMapper = this.ctx.service.system.mapper.sysUserRoleMapper
    this.dataScopeAspect = this.ctx.service.system.dataScopeAspect
    this.deptService = this.ctx.service.system.sysDeptService
    this.configService = this.ctx.service.system.sysConfigService
    this.roleMapper = this.ctx.service.system.mapper.sysRoleMapper
    this.postMapper = this.ctx.service.system.mapper.sysPostMapper
  }
  /**
   * 根据条件分页查询用户列表
   *
   * @param user 用户信息
   * @return 用户信息集合信息
   */
  async selectUserList(user) {
    await this.dataScopeAspect.dataScope('d', 'u')
    return this.userMapper.selectUserList(user)
  }

  /**
   * 根据条件分页查询已分配用户角色列表
   *
   * @param user 用户信息
   * @return 用户信息集合信息
   */
  async selectAllocatedList(user) {
    await this.dataScopeAspect.dataScope('d', 'u')
    return this.userMapper.selectAllocatedList(user)
  }
  /**
   * 根据条件分页查询未分配用户角色列表
   *
   * @param user 用户信息
   * @return 用户信息集合信息
   */
  async selectUnallocatedList(user) {
    await this.dataScopeAspect.dataScope('d', 'u')
    return this.userMapper.selectUnallocatedList(user)
  }
  /**
   * 通过用户名查询用户
   *
   * @param userName 用户名
   * @return 用户对象信息
   */
  async selectUserByUserName(username) {
    return this.userMapper.selectUserByUserName(username)
  }
  /**
   * 通过用户ID查询用户
   *
   * @param userId 用户ID
   * @return 用户对象信息
   */
  selectUserById(userId) {
    return this.userMapper.selectUserById(userId)
  }

  /**
   * 查询用户所属角色组
   *
   * @param userName 用户名
   * @return 结果
   */
  async selectUserRoleGroup(userName) {
    const list = await this.roleMapper.selectRolesByUserName(userName)
    if (list.length === 0) {
      return this.StringUtils.EMPTY
    }
    return list.map((sysRole) => sysRole.roleName).join(',')
  }
  /**
   * 查询用户所属岗位组
   *
   * @param userName 用户名
   * @return 结果
   */
  async selectUserPostGroup(userName) {
    const list = await this.postMapper.selectPostsByUserName(userName);
    if (list.length === 0)
    {
        return this.StringUtils.EMPTY;
    }
    return list.map((sysPost) => sysPost.postName).join(',')
  }

  /**
   * 校验用户名称是否唯一
   *
   * @param user 用户信息
   * @return 结果
   */
  async checkUserNameUnique(user) {
    const userId = this.StringUtils.isNull(user.userId) ? -1 : user.userId
    const info = await this.userMapper.checkUserNameUnique(user.userName)
    if (this.StringUtils.isNotNull(info) && info.userId != userId) {
      return this.UserConstants.NOT_UNIQUE
    }
    return this.UserConstants.UNIQUE
  }
  /**
   * 校验手机号码是否唯一
   *
   * @param user 用户信息
   * @return
   */
  async checkPhoneUnique(user) {
    const userId = this.StringUtils.isNull(user.userId) ? -1 : user.userId
    const info = await this.userMapper.checkPhoneUnique(user.phonenumber)
    if (this.StringUtils.isNotNull(info) && info.userId != userId) {
      return this.UserConstants.NOT_UNIQUE
    }
    return this.UserConstants.UNIQUE
  }
  /**
   * 校验email是否唯一
   *
   * @param user 用户信息
   * @return
   */
  async checkEmailUnique(user) {
    const userId = this.StringUtils.isNull(user.userId) ? -1 : user.userId
    const info = await this.userMapper.checkEmailUnique(user.email)
    if (this.StringUtils.isNotNull(info) && info.userId != userId) {
      return this.UserConstants.NOT_UNIQUE
    }
    return this.UserConstants.UNIQUE
  }
  /**
   * 校验用户是否允许操作
   *
   * @param user 用户信息
   */
  checkUserAllowed(user) {
    if (this.StringUtils.isNotNull(user.userId) && this.securityUtils.isAdmin(user.userId)) {
      throw new this.ServiceException('不允许操作超级管理员用户')
    }
  }
  /**
   * 校验用户是否有数据权限
   *
   * @param userId 用户id
   */
  async checkUserDataScope(userId) {
    if (!this.securityUtils.isAdmin(this.securityUtils.getUserId())) {
      const user = {}
      user.userId = userId
      const users = await this.selectUserList(user)
      if (this.StringUtils.isEmpty(users)) {
        throw new this.ServiceException('没有权限访问用户数据！')
      }
    }
  }
  /**
   * 新增保存用户信息
   *
   * @param user 用户信息
   * @return 结果
   */
  async insertUser(user) {
    const rows = 1
    // 新增用户信息
    await this.userMapper.insertUser(user)
    // 新增用户岗位关联
    await this.insertUserPost(user)
    // 新增用户与角色管理
    await this.insertUserRole(user.userId, user.roleIds)
    return rows
  }

  /**
   * 注册用户信息
   *
   * @param user 用户信息
   * @return 结果
   */
  async registerUser(user) {
    return !!(await this.userMapper.insertUser(user)).userId
  }

  /**
   * 修改保存用户信息
   *
   * @param user 用户信息
   * @return 结果
   */
  async updateUser(user) {
    const userId = user.userId
    // 删除用户与角色关联
    await this.userRoleMapper.deleteUserRoleByUserId(userId)
    // 新增用户与角色管理
    await this.insertUserRole(userId, user.roleIds)
    // 删除用户与岗位关联
    await this.userPostMapper.deleteUserPostByUserId(userId)
    // 新增用户与岗位管理
    await this.insertUserPost(user)
    return this.userMapper.updateUser(user)
  }
  /**
   * 用户授权角色
   *
   * @param userId 用户ID
   * @param roleIds 角色组
   */
  async insertUserAuth(userId, roleIds) {
    await this.userRoleMapper.deleteUserRoleByUserId(userId)
    await this.insertUserRole(userId, roleIds)
  }
  /**
   * 修改用户状态
   *
   * @param user 用户信息
   * @return 结果
   */
  updateUserStatus(user) {
    return this.userMapper.updateUser(user)
  }
  /**
   * 修改用户基本信息
   *
   * @param user 用户信息
   * @return 结果
   */
  async updateUserProfile(user) {
    return this.userMapper.updateUser(user)
  }
  /**
   * 修改用户头像
   *
   * @param userName 用户名
   * @param avatar 头像地址
   * @return 结果
   */
  async updateUserAvatar(userName, avatar) {
    await this.userMapper.updateUserAvatar(userName, avatar)
    return true
  }
  /**
   * 重置用户密码
   *
   * @param user 用户信息
   * @return 结果
   */
  resetPwd(user) {
    return this.userMapper.updateUser(user)
  }
  /**
   * 重置用户密码
   *
   * @param userName 用户名
   * @param password 密码
   * @return 结果
   */
  resetUserPwd(userName, password) {
    return this.userMapper.resetUserPwd(userName, password)
  }
  /**
   * 新增用户角色信息
   *
   * @param userId 用户ID
   * @param roleIds 角色组
   */
  async insertUserRole(userId, roleIds) {
    if (this.StringUtils.isNotEmpty(roleIds)) {
      // 新增用户与角色管理
      const list = []
      for (const roleId of roleIds) {
        const ur = {}
        ur.userId = userId
        ur.roleId = roleId
        list.push(ur)
      }
      await this.userRoleMapper.batchUserRole(list)
    }
  }
  /**
   * 新增用户岗位信息
   *
   * @param user 用户对象
   */
  async insertUserPost(user) {
    const posts = user.postIds
    if (this.StringUtils.isNotEmpty(posts)) {
      // 新增用户与岗位管理
      const list = []
      for (const postId of posts) {
        const up = {}
        up.userId = user.userId
        up.postId = postId
        list.push(up)
      }
      await this.userPostMapper.batchUserPost(list)
    }
  }

  /**
   * 通过用户ID删除用户
   *
   * @param userId 用户ID
   * @return 结果
   */
  async deleteUserById(userId) {
    // 删除用户与角色关联
    await this.userRoleMapper.deleteUserRoleByUserId(userId)
    // 删除用户与岗位表
    await this.userPostMapper.deleteUserPostByUserId(userId)
    return this.userMapper.deleteUserById(userId)
  }

  /**
   * 批量删除用户信息
   *
   * @param userIds 需要删除的用户ID
   * @return 结果
   */
  async deleteUserByIds(userIds) {
    for (const userId of userIds) {
      await this.checkUserAllowed({ userId })
      await this.checkUserDataScope(userId)
    }
    // 删除用户与角色关联
    await this.userRoleMapper.deleteUserRole(userIds)
    // 删除用户与岗位关联
    await this.userPostMapper.deleteUserPost(userIds)
    return this.userMapper.deleteUserByIds(userIds)
  }
  /**
   * 导入用户数据
   *
   * @param userList 用户数据列表
   * @param isUpdateSupport 是否更新支持，如果已存在，则进行更新数据
   * @param operName 操作用户
   * @return 结果
   */
  async importUser(userList, isUpdateSupport, operName) {
    if (this.StringUtils.isNull(userList) || userList.length == 0) {
      throw new this.ServiceException('导入用户数据不能为空！')
    }
    let successNum = 0
    let failureNum = 0
    let successMsg = ''
    let failureMsg = ''
    for (const user of userList) {
      try {
        // 验证是否存在这个用户
        const u = await this.userMapper.selectUserByUserName(user.userName)
        if (this.StringUtils.isNull(u)) {
          // BeanValidators.validateWithException(validator, user);
          await this.deptService.checkDeptDataScope(user.deptId)
          const password = await this.configService.selectConfigByKey('sys.user.initPassword')
          user.password = await this.securityUtils.encryptPassword(password)
          user.createBy = operName
          await this.userMapper.insertUser(user)
          successNum++
          successMsg += '<br/>' + successNum + '、账号 ' + user.userName + ' 导入成功'
        } else if ('' + isUpdateSupport === 'true') {
          // BeanValidators.validateWithException(validator, user);
          await this.checkUserAllowed(u)
          await this.checkUserDataScope(u.userId)
          await this.deptService.checkDeptDataScope(user.deptId)
          user.userId = u.userId
          user.updateBy = operName
          await this.userMapper.updateUser(user)
          successNum++
          successMsg += '<br/>' + successNum + '、账号 ' + user.userName + ' 更新成功'
        } else {
          failureNum++
          failureMsg += '<br/>' + failureNum + '、账号 ' + user.userName + ' 已存在'
        }
      } catch (e) {
        failureNum++
        const msg = '<br/>' + failureNum + '、账号 ' + user.userName + ' 导入失败：'
        failureMsg += msg + e.message
        this.ctx.logger.error(msg, e)
      }
    }
    if (failureNum > 0) {
      failureMsg = (0, '很抱歉，导入失败！共 ' + failureNum + ' 条数据格式不正确，错误如下：') + failureMsg
      throw new this.ServiceException(failureMsg)
    } else {
      successMsg = (0, '恭喜您，数据已全部导入成功！共 ' + successNum + ' 条，数据如下：') + successMsg
    }
    return successMsg
  }
}
module.exports = SysUserService
