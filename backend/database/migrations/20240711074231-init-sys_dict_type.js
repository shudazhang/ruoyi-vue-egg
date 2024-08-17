'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DATE, STRING, BIGINT, CHAR } = Sequelize
    await queryInterface.createTable('sys_dict_type', {
      dictId: { field: 'dict_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '字典主键' },
      dictName: { field: 'dict_name', type: STRING(100), defaultValue: '', comment: '字典名称' },
      dictType: { field: 'dict_type', type: STRING(100), defaultValue: '', comment: '字典类型' },
      status: { field: 'status', type: CHAR(1), defaultValue: '0', comment: '状态（0正常 1停用）' },
      createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
      createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
      updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
      updateTime: { field: 'update_time', type: DATE, comment: '更新时间' },
      remark: { field: 'remark', type: STRING(500), comment: '备注' }
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE sys_dict_type COMMENT = '字典类型表';  
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sys_dict_type')
  }
}
