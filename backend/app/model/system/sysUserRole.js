'use strict'

module.exports = (app) => {
  const { BIGINT } = app.Sequelize
  const SysUserRole = app.model.define('sys_user_role', {
    userId: { field: 'user_id', type: BIGINT(20), primaryKey: true, allowNull: false, comment: '用户ID' },
    roleId: { field: 'role_id', type: BIGINT(20), primaryKey: true, allowNull: false, comment: '角色ID' }
  })
  return SysUserRole
}
