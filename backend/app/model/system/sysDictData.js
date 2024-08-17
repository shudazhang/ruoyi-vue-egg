'use strict'

module.exports = (app) => {
  const { INTEGER, DATE, STRING, BIGINT, CHAR } = app.Sequelize
  const SysDictData = app.model.define('sys_dict_data', {
    dictCode: { field: 'dict_code', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '字典编码' },
    dictSort: { field: 'dict_sort', type: INTEGER(4), defaultValue: 0, comment: '字典排序' },
    dictLabel: {
      field: 'dict_label',
      type: STRING(100),
      defaultValue: '',
      comment: '字典标签',
      set(dictLabel) {
        if (['undefined', 'null', ''].includes('' + dictLabel)) {
          throw new Error('字典标签不能为空')
        }
        if (('' + dictLabel).length > 100) {
          throw new Error('字典标签长度不能超过100个字符')
        }
        this.setDataValue('dictLabel', dictLabel)
      }
    },
    dictValue: {
      field: 'dict_value',
      type: STRING(100),
      defaultValue: '',
      comment: '字典键值',
      set(dictValue) {
        if (['undefined', 'null', ''].includes('' + dictValue)) {
          throw new Error('字典键值不能为空')
        }
        if (('' + dictValue).length > 100) {
          throw new Error('字典键值长度不能超过100个字符')
        }
        this.setDataValue('dictValue', dictValue)
      }
    },
    dictType: {
      field: 'dict_type',
      type: STRING(100),
      defaultValue: '',
      comment: '字典类型',
      set(dictType) {
        if (['undefined', 'null', ''].includes('' + dictType)) {
          throw new Error('字典类型不能为空')
        }
        if (('' + dictType).length > 100) {
          throw new Error('字典类型长度不能超过100个字符')
        }
        this.setDataValue('dictType', dictType)
      }
    },
    cssClass: {
      field: 'css_class',
      type: STRING(100),
      comment: '样式属性（其他样式扩展）',
      set(cssClass) {
        if (('' + cssClass).length > 100) {
          throw new Error('样式属性长度不能超过100个字符')
        }
        this.setDataValue('cssClass', cssClass)
      }
    },
    listClass: { field: 'list_class', type: STRING(100), comment: '表格回显样式' },
    isDefault: { field: 'is_default', type: CHAR(1), defaultValue: 'N', comment: '是否默认（Y是 N否）' },
    status: { field: 'status', type: CHAR(1), defaultValue: '0', comment: '状态（0正常 1停用）' },
    createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
    createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
    updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
    updateTime: { field: 'update_time', type: DATE, comment: '更新时间' },
    remark: { field: 'remark', type: STRING(500), comment: '备注' }
  })
  return SysDictData
}
