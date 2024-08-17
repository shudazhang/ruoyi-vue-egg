'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { BIGINT } = Sequelize
    await queryInterface.createTable('sys_user_post', {
      userId: { field: 'user_id', type: BIGINT(20), primaryKey: true, allowNull: false, comment: '用户ID' },
      postId: { field: 'post_id', type: BIGINT(20), primaryKey: true, allowNull: false, comment: '岗位ID' }
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE sys_user_post COMMENT = '用户与岗位关联表';  
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sys_user_post')
  }
}
