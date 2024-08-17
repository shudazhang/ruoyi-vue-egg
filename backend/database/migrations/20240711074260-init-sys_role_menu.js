'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { BIGINT } = Sequelize
    await queryInterface.createTable('sys_role_menu', {
      roleId: { field: 'role_id', type: BIGINT(20), primaryKey: true, allowNull: false, comment: '角色ID' },
      menuId: { field: 'menu_id', type: BIGINT(20), primaryKey: true, allowNull: false, comment: '菜单ID' }
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE sys_role_menu COMMENT = '角色和菜单关联表';  
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sys_role_menu')
  }
}
