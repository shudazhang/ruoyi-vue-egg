'use strict'

module.exports = (app) => {
  const { BIGINT } = app.Sequelize
  const SysUserPost = app.model.define('sys_user_post', {
    userId: { field: 'user_id', type: BIGINT(20), primaryKey: true, allowNull: false, comment: '用户ID' },
    postId: { field: 'post_id', type: BIGINT(20), primaryKey: true, allowNull: false, comment: '岗位ID' }
  })
  return SysUserPost
}
