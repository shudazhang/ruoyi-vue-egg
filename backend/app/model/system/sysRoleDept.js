'use strict'

module.exports = (app) => {
  const { BIGINT } = app.Sequelize
  const SysRoleDept = app.model.define('sys_role_dept', {
    roleId: { field: 'role_id', type: BIGINT(20), primaryKey: true, allowNull: false, comment: '角色ID' },
    deptId: { field: 'dept_id', type: BIGINT(20), primaryKey: true, allowNull: false, comment: '部门ID' }
  })
  return SysRoleDept
}
