'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { BIGINT } = Sequelize
    await queryInterface.createTable('sys_user_role', {
      userId: { field: 'user_id', type: BIGINT(20), primaryKey: true, allowNull: false, comment: '用户ID' },
      roleId: { field: 'role_id', type: BIGINT(20), primaryKey: true, allowNull: false, comment: '角色ID' }
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE sys_user_role COMMENT = '用户和角色关联表';  
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sys_user_role')
  }
}
