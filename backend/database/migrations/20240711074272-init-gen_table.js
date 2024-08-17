'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DATE, STRING, BIGINT, CHAR } = Sequelize
    await queryInterface.createTable('gen_table', {
      tableId: { field: 'table_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '编号' },
      tableName: { field: 'table_name', type: STRING(200), defaultValue: '', comment: '表名称' },
      tableComment: { field: 'table_comment', type: STRING(500), defaultValue: '', comment: '表描述' },
      subTableName: { field: 'sub_table_name', type: STRING(64), comment: '关联子表的表名' },
      subTableFkName: { field: 'sub_table_fk_name', type: STRING(64),  comment: '子表关联的外键名' },
      className: { field: 'class_name', type: STRING(100), defaultValue: '', comment: '实体类名称' },
      tplCategory: { field: 'tpl_category', type: STRING(200), defaultValue: 'crud', comment: '使用的模板（crud单表操作 tree树表操作）' },
      tplWebType: { field: 'tpl_web_type', type: STRING(30),defaultValue: '', comment: '前端模板类型（element-ui模版 element-plus模版）' },
      packageName: { field: 'package_name', type: STRING(100),  comment: '生成包路径' },
      moduleName: { field: 'module_name', type: STRING(30),  comment: '生成模块名' },
      businessName: { field: 'business_name', type: STRING(30), comment: '生成业务名' },
      functionName: { field: 'function_name', type: STRING(50), comment: '生成功能名' },
      functionAuthor: { field: 'function_author', type: STRING(50),  comment: '生成功能作者' },
      genType: { field: 'gen_type', type: CHAR(1),defaultValue: '0',comment: '生成代码方式（0zip压缩包 1自定义路径）' },
      genPath: { field: 'gen_path', type: STRING(200),defaultValue: '/', comment: '生成路径（不填默认项目路径）' },
      options: { field: 'options', type: STRING(1000), comment: '其它生成选项' },
      createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
      createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
      updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
      updateTime: { field: 'update_time', type: DATE, comment: '更新时间' },
      remark: { field: 'remark', type: STRING(500), comment: '备注' }
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE gen_table COMMENT = '代码生成业务表';  
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('gen_table')
  }
}
