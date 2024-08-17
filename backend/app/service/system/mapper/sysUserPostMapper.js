const { Service } = require('egg')

class SysUserPostMapper extends Service {
  /**
   * 通过用户ID删除用户和岗位关联
   *
   * @param userId 用户ID
   * @return 结果
   */
  deleteUserPostByUserId(userId) {
    return this.app.model.System.SysUserPost.destroy({ where: { userId } })
  }
  /**
   * 通过岗位ID查询岗位使用数量
   *
   * @param postId 岗位ID
   * @return 结果
   */
  countUserPostById(postId) {
    return this.app.model.System.SysUserPost.count({ where: { postId } })
  }
  /**
   * 批量删除用户和岗位关联
   *
   * @param ids 需要删除的数据ID
   * @return 结果
   */
  deleteUserPost(ids) {
    return this.app.model.System.SysUserPost.destroy({ where: { userId: ids } })
  }
  /**
   * 批量新增用户岗位信息
   *
   * @param userPostList 用户岗位列表
   * @return 结果
   */
  batchUserPost(userPostList) {
    return this.app.model.System.SysUserPost.bulkCreate(userPostList)
  }
}
module.exports = SysUserPostMapper
