'use strict'

module.exports = (app) => {
  const { DATE, STRING, INTEGER, CHAR } = app.Sequelize
  const SysConfig = app.model.define('sys_config', {
    configId: { field: 'config_id', type: INTEGER(5), primaryKey: true, autoIncrement: true, allowNull: false, comment: '参数主键' },
    configName: {
      field: 'config_name',
      type: STRING(100),
      defaultValue: '',
      comment: '参数名称',
      set(configName) {
        if (['undefined', 'null', ''].includes('' + configName)) {
          throw new Error('参数名称不能为空')
        }
        if (('' + configName).length > 100) {
          throw new Error('参数名称不能超过100个字符')
        }
        this.setDataValue('configName', configName)
      }
    },
    configKey: {
      field: 'config_key',
      type: STRING(100),
      defaultValue: '',
      comment: '参数键名',
      set(configKey) {
        if (['undefined', 'null', ''].includes('' + configKey)) {
          throw new Error('参数键名长度不能为空')
        }
        if (('' + configKey).length > 100) {
          throw new Error('参数键名长度不能超过100个字符')
        }
        this.setDataValue('configKey', configKey)
      }
    },
    configValue: {
      field: 'config_value',
      type: STRING(500),
      defaultValue: '',
      comment: '参数键值',
      set(configValue) {
        if (['undefined', 'null', ''].includes('' + configValue)) {
          throw new Error('参数键值不能为空')
        }
        if (('' + configValue).length > 500) {
          throw new Error('参数键值长度不能超过500个字符')
        }
        this.setDataValue('configValue', configValue)
      }
    },
    configType: { field: 'config_type', type: CHAR(1), defaultValue: 'N', comment: '系统内置（Y是 N否）' },
    createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
    createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
    updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
    updateTime: { field: 'update_time', type: DATE, comment: '更新时间' },
    remark: { field: 'remark', type: STRING(500), comment: '备注' }
  })
  return SysConfig
}
