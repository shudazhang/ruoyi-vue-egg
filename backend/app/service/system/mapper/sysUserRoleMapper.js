const { Service } = require('egg')

class SysUserRoleMapper extends Service {
  /**
   * 通过用户ID删除用户和角色关联
   *
   * @param userId 用户ID
   * @return 结果
   */
  deleteUserRoleByUserId(userId) {
    return this.app.model.System.SysUserRole.destroy({
      where: {
        userId
      }
    })
  }
  /**
   * 批量删除用户和角色关联
   *
   * @param ids 需要删除的数据ID
   * @return 结果
   */
  deleteUserRole(ids) {
    return this.app.model.System.SysUserRole.destroy({
      where: {
        userId: ids
      }
    })
  }
  /**
   * 通过角色ID查询角色使用数量
   *
   * @param roleId 角色ID
   * @return 结果
   */
  countUserRoleByRoleId(roleId) {
    return this.app.model.System.SysUserRole.count({ where: { roleId } })
  }

  /**
   * 批量新增用户角色信息
   *
   * @param userRoleList 用户角色列表
   * @return 结果
   */
  batchUserRole(userRoleList) {
    return this.app.model.System.SysUserRole.bulkCreate(userRoleList)
  }
  /**
   * 删除用户和角色关联信息
   *
   * @param userRole 用户和角色关联信息
   * @return 结果
   */
  deleteUserRoleInfo(userRole) {
    return this.app.model.System.SysUserRole.destroy({ where: { userId: userRole.userId, roleId: userRole.roleId } })
  }

  /**
   * 批量取消授权用户角色
   *
   * @param roleId 角色ID
   * @param userIds 需要删除的用户数据ID
   * @return 结果
   */
  deleteUserRoleInfos(roleId, userIds) {
    return this.ctx.app.model.System.SysUserRole.destroy({
      where: {
        userId: userIds,
        roleId: roleId
      }
    })
  }
}
module.exports = SysUserRoleMapper
