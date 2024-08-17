'use strict'
const moment = require('moment')
module.exports = (app) => {
  const { DATE, STRING, INTEGER, BIGINT } = app.Sequelize
  const SysOperLog = app.model.define('sys_oper_log', {
    operId: { field: 'oper_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '日志主键' },
    title: { field: 'title', type: STRING(50), defaultValue: '', comment: '模块标题' },
    businessType: { field: 'business_type', type: INTEGER(2), defaultValue: 0, comment: '业务类型（0=其它,1=新增,2=修改,3=删除,4=授权,5=导出,6=导入,7=强退,8=生成代码,9=清空数据）' },
    method: { field: 'method', type: STRING(200), defaultValue: '', comment: '方法名称' },
    requestMethod: { field: 'request_method', type: STRING(10), defaultValue: '', comment: '请求方式' },
    operatorType: { field: 'operator_type', type: INTEGER(1), defaultValue: 0, comment: '操作类别（0其它 1后台用户 2手机端用户）' },
    operName: { field: 'oper_name', type: STRING(50), defaultValue: '', comment: '操作人员' },
    deptName: { field: 'dept_name', type: STRING(50), defaultValue: '', comment: '部门名称' },
    operUrl: { field: 'oper_url', type: STRING(255), defaultValue: '', comment: '请求URL' },
    operIp: { field: 'oper_ip', type: STRING(128), defaultValue: '', comment: '主机地址' },
    operLocation: { field: 'oper_location', type: STRING(255), defaultValue: '', comment: '操作地点' },
    operParam: { field: 'oper_param', type: STRING(2000), defaultValue: '', comment: '请求参数' },
    jsonResult: { field: 'json_result', type: STRING(2000), defaultValue: '', comment: '返回参数' },
    status: { field: 'status', type: INTEGER(1), defaultValue: 0, comment: '操作状态（0正常 1异常）' },
    errorMsg: { field: 'error_msg', type: STRING(2000), defaultValue: '', comment: '错误消息' },
    operTime: {
      field: 'oper_time',
      type: DATE,
      comment: '操作时间',
      get() {
        return moment(this.getDataValue('operTime')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    costTime: { field: 'cost_time', type: BIGINT(20), defaultValue: 0, comment: '消耗时间' }
  })
  return SysOperLog
}
