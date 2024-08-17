'use strict'
const moment = require('moment')
module.exports = (app) => {
  const { DATE, STRING, BIGINT, CHAR } = app.Sequelize
  const SysLogininfor = app.model.define('sys_logininfor', {
    infoId: { field: 'info_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '访问ID' },
    userName: { field: 'user_name', type: STRING(50), defaultValue: '', comment: '用户账号' },
    ipaddr: { field: 'ipaddr', type: STRING(128), defaultValue: '', comment: '登录IP地址' },
    loginLocation: { field: 'login_location', type: STRING(255), defaultValue: '', comment: '登录地点' },
    browser: { field: 'browser', type: STRING(50), defaultValue: '', comment: '浏览器类型' },
    os: { field: 'os', type: STRING(50), defaultValue: '', comment: '操作系统' },
    status: { field: 'status', type: CHAR(1), defaultValue: '0', comment: '登录状态（0成功 1失败）' },
    msg: { field: 'msg', type: STRING(255), defaultValue: '', comment: '提示消息' },
    loginTime: {
      field: 'login_time',
      type: DATE,
      comment: '访问时间',
      get() {
        return moment(this.getDataValue('loginTime')).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  })
  return SysLogininfor
}
