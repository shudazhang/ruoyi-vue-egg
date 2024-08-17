const { Service } = require('egg')

class SysPostMapper extends Service {
  /**
   * 查询岗位数据集合
   *
   * @param post 岗位信息
   * @return 岗位数据集合
   */
  async selectPostList(post) {
    const params = {
      where: {}
    }

    if (post.pageNum && post.pageSize) {
      params.offset = parseInt(((post.pageNum || 1) - 1) * (post.pageSize || 10))
      params.limit = parseInt(post.pageSize || 10)
    }
    if (post.postCode) {
      params.where.postCode = {
        [this.app.Sequelize.Op.like]: `%${post.postCode}%`
      }
    }
    if (!['undefined', 'null', ''].includes('' + post.status)) {
      params.where.status = post.status
    }
    if (post.postName) {
      params.where.postName = {
        [this.app.Sequelize.Op.like]: `%${post.postName}%`
      }
    }

    if (post.pageNum && post.pageSize) {
      return this.app.model.System.SysPost.findAndCountAll(params)
    } else {
      return this.app.model.System.SysPost.findAll(params)
    }
  }
  /**
   * 查询所有岗位
   *
   * @return 岗位列表
   */
  selectPostAll() {
    return this.app.model.System.SysPost.findAll()
  }
  /**
   * 通过岗位ID查询岗位信息
   *
   * @param postId 岗位ID
   * @return 角色对象信息
   */
  selectPostById(postId) {
    return this.app.model.System.SysPost.findOne({ where: { postId } })
  }
  /**
   * 根据用户ID获取岗位选择框列表
   *
   * @param userId 用户ID
   * @return 选中岗位ID列表
   */
  async selectPostListByUserId(userId) {
    const userPosts = await this.app.model.System.SysUserPost.findAll({
      where: {
        userId: userId
      }
    })
    const postIds = userPosts.map((item) => item.postId)
    const posts = await this.app.model.System.SysPost.findAll({
      attributes: ['postId'],
      where: {
        postId: postIds
      }
    })
    return posts.map((item) => item.postId)
  }
  /**
   * 查询用户所属岗位组
   *
   * @param userName 用户名
   * @return 结果
   */
  async selectPostsByUserName(userName) {
    const users = await this.app.model.System.SysUser.findAll({
      attributes: ['userId'],
      where: {
        userName
      }
    })
    const userId = users.map((item) => item.userId)
    const userPosts = await this.app.model.System.SysUserPost.findAll({
      where: {
        userId: userId
      }
    })
    const postIds = userPosts.map((item) => item.postId)
    return this.app.model.System.SysPost.findAll({
      attributes: ['postId', 'postName', 'postCode'],
      where: {
        postId: postIds
      }
    })
  }
  /**
   * 删除岗位信息
   *
   * @param postId 岗位ID
   * @return 结果
   */
  deletePostById(postId) {
    return this.app.model.System.SysPost.destroy({ where: { postId } })
  }

  /**
   * 批量删除岗位信息
   *
   * @param postIds 需要删除的岗位ID
   * @return 结果
   */
  deletePostByIds(postIds) {
    return this.app.model.System.SysPost.destroy({ where: { postId: postIds } })
  }
  /**
   * 修改岗位信息
   *
   * @param post 岗位信息
   * @return 结果
   */
  updatePost(post) {
    return this.app.model.System.SysPost.update({ ...post, updateTime: new Date() }, { where: { postId: post.postId } })
  }
  /**
   * 新增岗位信息
   *
   * @param post 岗位信息
   * @return 结果
   */
  insertPost(post) {
    return this.app.model.System.SysPost.create({ ...post, createTime: new Date() })
  }
  /**
   * 校验岗位名称
   *
   * @param postName 岗位名称
   * @return 结果
   */
  checkPostNameUnique(postName) {
    return this.app.model.System.SysPost.findOne({ where: { postName } })
  }
  /**
   * 校验岗位编码
   *
   * @param postCode 岗位编码
   * @return 结果
   */
  checkPostCodeUnique(postCode) {
    return this.app.model.System.SysPost.findOne({ where: { postCode } })
  }
}
module.exports = SysPostMapper
