'use strict'

module.exports = (app) => {
  const { BIGINT } = app.Sequelize
  const SysRoleMenu = app.model.define('sys_role_menu', {
    roleId: { field: 'role_id', type: BIGINT(20), primaryKey: true, allowNull: false, comment: '角色ID' },
    menuId: { field: 'menu_id', type: BIGINT(20), primaryKey: true, allowNull: false, comment: '菜单ID' }
  })
  return SysRoleMenu
}
