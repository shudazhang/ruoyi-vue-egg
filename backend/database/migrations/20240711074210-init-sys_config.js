'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DATE, STRING, INTEGER, CHAR } = Sequelize
    await queryInterface.createTable('sys_config', {
      configId: { field: 'config_id', type: INTEGER(5), primaryKey: true, autoIncrement: true, allowNull: false, comment: '参数主键' },
      configName: { field: 'config_name', type: STRING(100), defaultValue: '', comment: '参数名称' },
      configKey: { field: 'config_key', type: STRING(100), defaultValue: '', comment: '参数键名' },
      configValue: { field: 'config_value', type: STRING(500), defaultValue: '', comment: '参数键值' },
      configType: { field: 'config_type', type: CHAR(1), defaultValue: 'N', comment: '系统内置（Y是 N否）' },
      createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
      createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
      updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
      updateTime: { field: 'update_time', type: DATE, comment: '更新时间' },
      remark: { field: 'remark', type: STRING(500), comment: '备注' }
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE sys_config COMMENT = '参数配置表';  
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sys_config')
  }
}
