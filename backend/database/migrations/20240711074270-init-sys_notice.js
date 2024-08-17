'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DATE, STRING, CHAR, INTEGER,BLOB } = Sequelize
    await queryInterface.createTable('sys_notice', {
      noticeId: { field: 'notice_id', type: INTEGER(4), primaryKey: true, autoIncrement: true, allowNull: false, comment: '公告ID' },
      noticeTitle: { field: 'notice_title', type: STRING(50), allowNull: false, comment: '公告标题' },
      noticeType: { field: 'notice_type', type: CHAR(1),  allowNull: false, comment: '公告类型（1通知 2公告）' },
      noticeContent: { field: 'notice_content', type: BLOB('long'), comment: '公告内容' },
      status: { field: 'status', type: CHAR(1), defaultValue: '0', comment: '公告状态（0正常 1关闭）' },
      createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
      createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
      updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
      updateTime: { field: 'update_time', type: DATE, comment: '更新时间' },
      remark: { field: 'remark', type: STRING(255), comment: '备注' }
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE sys_notice COMMENT = '通知公告表';  
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sys_notice')
  }
}
