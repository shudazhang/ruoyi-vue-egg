'use strict'

module.exports = (app) => {
  const { DATE, STRING, BIGINT, CHAR } = app.Sequelize
  const SysDictType = app.model.define('sys_dict_type', {
    dictId: { field: 'dict_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '字典主键' },
    dictName: {
      field: 'dict_name',
      type: STRING(100),
      defaultValue: '',
      comment: '字典名称',
      set(dictName) {
        if (['undefined', 'null', ''].includes('' + dictName)) {
          throw new Error('字典名称不能为空')
        }
        if (('' + dictName).length > 100) {
          throw new Error('字典名称长度不能超过100个字符')
        }
        this.setDataValue('dictName', dictName)
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
        if (!/^[a-z][a-z0-9_]*$/.test(dictType)) {
          throw new Error('字典类型必须以字母开头，且只能为（小写字母，数字，下滑线）')
        }
        this.setDataValue('dictType', dictType)
      }
    },
    status: { field: 'status', type: CHAR(1), defaultValue: '0', comment: '状态（0正常 1停用）' },
    createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
    createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
    updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
    updateTime: { field: 'update_time', type: DATE, comment: '更新时间' },
    remark: { field: 'remark', type: STRING(500), comment: '备注' }
  })
  return SysDictType
}
