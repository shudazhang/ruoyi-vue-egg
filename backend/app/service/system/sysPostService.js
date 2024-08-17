const BaseService = require('./baseService.js')
class SysPostService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.postMapper = this.ctx.service.system.mapper.sysPostMapper
    this.userPostMapper = this.ctx.service.system.mapper.sysUserPostMapper
  }
  /**
   * 查询岗位信息集合
   *
   * @param post 岗位信息
   * @return 岗位信息集合
   */
  async selectPostList(post) {
    return this.postMapper.selectPostList(post)
  }

  /**
   * 查询所有岗位
   *
   * @return 岗位列表
   */
  selectPostAll() {
    return this.postMapper.selectPostAll()
  }
  /**
   * 通过岗位ID查询岗位信息
   *
   * @param postId 岗位ID
   * @return 角色对象信息
   */
  selectPostById(postId) {
    return this.postMapper.selectPostById(postId)
  }
  /**
   * 根据用户ID获取岗位选择框列表
   *
   * @param userId 用户ID
   * @return 选中岗位ID列表
   */
  selectPostListByUserId(userId) {
    return this.postMapper.selectPostListByUserId(userId)
  }
  /**
   * 校验岗位名称是否唯一
   *
   * @param post 岗位信息
   * @return 结果
   */
  async checkPostNameUnique(post) {
    const postId = this.StringUtils.isNull(post.postId) ? -1 : post.postId
    const info = await this.postMapper.checkPostNameUnique(post.postName)
    if (this.StringUtils.isNotNull(info) && info.postId != postId) {
      return this.UserConstants.NOT_UNIQUE
    }
    return this.UserConstants.UNIQUE
  }
  /**
   * 校验岗位编码是否唯一
   *
   * @param post 岗位信息
   * @return 结果
   */
  async checkPostCodeUnique(post) {
    const postId = this.StringUtils.isNull(post.postId) ? -1 : post.postId
    const info = await this.postMapper.checkPostCodeUnique(post.postCode)
    if (this.StringUtils.isNotNull(info) && info.postId != postId) {
      return this.UserConstants.NOT_UNIQUE
    }
    return this.UserConstants.UNIQUE
  }
  /**
   * 通过岗位ID查询岗位使用数量
   *
   * @param postId 岗位ID
   * @return 结果
   */
  async countUserPostById(postId) {
    return this.userPostMapper.countUserPostById(postId)
  }
  /**
   * 删除岗位信息
   *
   * @param postId 岗位ID
   * @return 结果
   */
  deletePostById(postId) {
    return this.postMapper.deletePostById(postId)
  }
  /**
   * 批量删除岗位信息
   *
   * @param postIds 需要删除的岗位ID
   * @return 结果
   */
  async deletePostByIds(postIds) {
    for (const postId of postIds) {
      const post = await this.selectPostById(postId)
      if ((await this.countUserPostById(postId)) > 0) {
        throw new this.ServiceException(`${post.postName}已分配,不能删除`)
      }
    }
    return this.postMapper.deletePostByIds(postIds)
  }
  /**
   * 新增保存岗位信息
   *
   * @param post 岗位信息
   * @return 结果
   */
  insertPost(post) {
    return this.postMapper.insertPost(post)
  }

  /**
   * 修改保存岗位信息
   *
   * @param post 岗位信息
   * @return 结果
   */
  updatePost(post) {
    return this.postMapper.updatePost(post)
  }
}
module.exports = SysPostService
