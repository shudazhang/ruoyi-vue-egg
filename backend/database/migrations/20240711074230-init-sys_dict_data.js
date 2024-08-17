'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { INTEGER, DATE, STRING, BIGINT, CHAR } = Sequelize
    await queryInterface.createTable('sys_dict_data', {
      dictCode: { field: 'dict_code', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '字典编码' },
      dictSort: { field: 'dict_sort', type: INTEGER(4), defaultValue: 0, comment: '字典排序' },
      dictLabel: { field: 'dict_label', type: STRING(100), defaultValue: '', comment: '字典标签' },
      dictValue: { field: 'dict_value', type: STRING(100), defaultValue: '', comment: '字典键值' },
      dictType: { field: 'dict_type', type: STRING(100), defaultValue: '', comment: '字典类型' },
      cssClass: { field: 'css_class', type: STRING(100), comment: '样式属性（其他样式扩展）' },
      listClass: { field: 'list_class', type: STRING(100), comment: '表格回显样式' },
      isDefault: { field: 'is_default', type: CHAR(1), defaultValue: 'N', comment: '是否默认（Y是 N否）' },
      status: { field: 'status', type: CHAR(1), defaultValue: '0', comment: '状态（0正常 1停用）' },
      createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
      createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
      updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
      updateTime: { field: 'update_time', type: DATE, comment: '更新时间' },
      remark: { field: 'remark', type: STRING(500), comment: '备注' }
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE sys_dict_data COMMENT = '字典数据表';  
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sys_dict_data')
  }
}
