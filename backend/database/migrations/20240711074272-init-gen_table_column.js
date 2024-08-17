'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DATE, STRING, BIGINT, CHAR,INTEGER } = Sequelize
    await queryInterface.createTable('gen_table_column', {
      columnId: { field: 'column_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '编号' },
      tableId: { field: 'table_id', type: BIGINT(20),  comment: '归属表编号' },
      columnName: { field: 'column_name', type: STRING(200),  comment: '列名称' },
      columnComment: { field: 'column_comment', type: STRING(500),  comment: '列描述' },
      columnType: { field: 'column_type', type: STRING(100), comment: '列类型' },
      javaType: { field: 'java_type', type: STRING(500),  comment: 'JAVA类型' },
      javaField: { field: 'java_field', type: STRING(200), comment: 'JAVA字段名' },
      isPk: { field: 'is_pk', type: CHAR(1), comment: '是否主键（1是）' },
      isIncrement: { field: 'is_increment', type: CHAR(1), comment: '是否自增（1是）' },
      isRequired: { field: 'is_required', type: CHAR(1),  comment: '是否必填（1是）' },
      isInsert: { field: 'is_insert', type: CHAR(1),  comment: '是否为插入字段（1是）' },
      isEdit: { field: 'is_edit', type: CHAR(1), comment: '是否编辑字段（1是）' },
      isList: { field: 'is_list', type: CHAR(1), comment: '是否列表字段（1是）' },
      isQuery: { field: 'is_query', type: CHAR(1),  comment: '是否查询字段（1是）' },
      queryType: { field: 'query_type', type: STRING(200),defaultValue: 'EQ',comment: '查询方式（等于、不等于、大于、小于、范围）' },
      htmlType: { field: 'html_type', type: STRING(200), comment: '显示类型（文本框、文本域、下拉框、复选框、单选框、日期控件）' },
      dictType: { field: 'dict_type', type: STRING(200), defaultValue: '',comment: '字典类型' },
      sort: { field: 'sort', type: INTEGER(11), comment: '排序' },
      createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
      createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
      updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
      updateTime: { field: 'update_time', type: DATE, comment: '更新时间' },
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE gen_table_column COMMENT = '代码生成业务表字段';  
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('gen_table_column')
  }
}
