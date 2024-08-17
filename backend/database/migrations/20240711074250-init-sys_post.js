'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DATE, STRING, BIGINT, INTEGER, CHAR } = Sequelize
    await queryInterface.createTable('sys_post', {
      postId: { field: 'post_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '岗位ID' },
      postCode: { field: 'post_code', type: STRING(64), allowNull: false, comment: '岗位编码' },
      postName: { field: 'post_name', type: STRING(50), allowNull: false, comment: '岗位名称' },
      postSort: { field: 'post_sort', type: INTEGER(4), allowNull: false, comment: '显示顺序' },
      status: { field: 'status', type: CHAR(1), allowNull: false, comment: '状态（0正常 1停用）' },
      createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
      createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
      updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
      updateTime: { field: 'update_time', type: DATE, comment: '更新时间' },
      remark: { field: 'remark', type: STRING(500), comment: '备注' }
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE sys_post COMMENT = '岗位信息表';  
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sys_post')
  }
}
