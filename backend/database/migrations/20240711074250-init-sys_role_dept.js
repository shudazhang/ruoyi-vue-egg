'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { BIGINT } = Sequelize
    await queryInterface.createTable('sys_role_dept', {
      roleId: { field: 'role_id', type: BIGINT(20), primaryKey: true, allowNull: false, comment: '角色ID' },
      deptId: { field: 'dept_id', type: BIGINT(20), primaryKey: true, allowNull: false, comment: '部门ID' }
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE sys_role_dept COMMENT = '角色和部门关联表';  
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sys_role_dept')
  }
}
