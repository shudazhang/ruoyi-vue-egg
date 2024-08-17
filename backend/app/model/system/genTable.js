'use strict'

module.exports = (app) => {
  const { DATE, STRING, BIGINT, CHAR } = app.Sequelize
  const GenTable = app.model.define('gen_table', {
    tableId: { field: 'table_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '编号' },
    tableName: {
      field: 'table_name',
      type: STRING(200),
      defaultValue: '',
      comment: '表名称',
      set(tableName) {
        if (['undefined', 'null', ''].includes('' + tableName)) {
          throw new Error('表名称不能为空')
        }
        this.setDataValue('tableName', tableName)
      }
    },
    tableComment: {
      field: 'table_comment',
      type: STRING(500),
      defaultValue: '',
      comment: '表描述',
      set(tableComment) {
        if (['undefined', 'null', ''].includes('' + tableComment)) {
          throw new Error('表描述不能为空')
        }
        this.setDataValue('tableComment', tableComment)
      }
    },
    subTableName: { field: 'sub_table_name', type: STRING(64), comment: '关联子表的表名' },
    subTableFkName: { field: 'sub_table_fk_name', type: STRING(64), comment: '子表关联的外键名' },
    className: {
      field: 'class_name',
      type: STRING(100),
      defaultValue: '',
      comment: '实体类名称',
      set(className) {
        if (['undefined', 'null', ''].includes('' + className)) {
          throw new Error('实体类名称不能为空')
        }
        this.setDataValue('className', className)
      }
    },
    tplCategory: { field: 'tpl_category', type: STRING(200), defaultValue: 'crud', comment: '使用的模板（crud单表操作 tree树表操作）' },
    tplWebType: { field: 'tpl_web_type', type: STRING(30), defaultValue: '', comment: '前端模板类型（element-ui模版 element-plus模版）' },
    packageName: {
      field: 'package_name',
      type: STRING(100),
      comment: '生成包路径',
      set(packageName) {
        if (['undefined', 'null', ''].includes('' + packageName)) {
          throw new Error('生成包路径不能为空')
        }
        this.setDataValue('packageName', packageName)
      }
    },
    moduleName: {
      field: 'module_name',
      type: STRING(30),
      comment: '生成模块名',
      set(moduleName) {
        if (['undefined', 'null', ''].includes('' + moduleName)) {
          throw new Error('生成模块名不能为空')
        }
        this.setDataValue('moduleName', moduleName)
      }
    },
    businessName: {
      field: 'business_name',
      type: STRING(30),
      comment: '生成业务名',
      set(businessName) {
        if (['undefined', 'null', ''].includes('' + businessName)) {
          throw new Error('生成业务名不能为空')
        }
        this.setDataValue('businessName', businessName)
      }
    },
    functionName: {
      field: 'function_name',
      type: STRING(50),
      comment: '生成功能名',
      set(functionName) {
        if (['undefined', 'null', ''].includes('' + functionName)) {
          throw new Error('生成功能名不能为空')
        }
        this.setDataValue('functionName', functionName)
      }
    },
    functionAuthor: { field: 'function_author', type: STRING(50), comment: '生成功能作者' },
    genType: { field: 'gen_type', type: CHAR(1), defaultValue: '0', comment: '生成代码方式（0zip压缩包 1自定义路径）' },
    genPath: { field: 'gen_path', type: STRING(200), defaultValue: '/', comment: '生成路径（不填默认项目路径）' },
    options: { field: 'options', type: STRING(1000), comment: '其它生成选项' },
    createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
    createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
    updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
    updateTime: { field: 'update_time', type: DATE, comment: '更新时间' },
    remark: { field: 'remark', type: STRING(500), comment: '备注' }
  })
  GenTable.associate = function () {
    GenTable.hasMany(app.model.System.GenTableColumn, { as: 'columns', foreignKey: 'tableId' })
  }
  return GenTable
}
