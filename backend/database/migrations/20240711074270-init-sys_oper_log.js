'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DATE, STRING, INTEGER, BIGINT } = Sequelize
    await queryInterface.createTable('sys_oper_log', {
      operId: { field: 'oper_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '日志主键' },
      title: { field: 'title', type: STRING(50), defaultValue: '', comment: '模块标题' },
      businessType: { field: 'business_type', type: INTEGER(2), defaultValue: 0, comment: '业务类型（0其它 1新增 2修改 3删除）' },
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
      operTime: { field: 'oper_time', type: DATE, comment: '操作时间' },
      costTime: { field: 'cost_time', type: BIGINT(20), defaultValue: 0, comment: '消耗时间' }
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE sys_oper_log COMMENT = '操作日志记录';  
    `)
    await queryInterface.addIndex('sys_oper_log', ['business_type'], {
      name: 'idx_sys_oper_log_bt'
    })
    await queryInterface.addIndex('sys_oper_log', ['status'], {
      name: 'idx_sys_oper_log_s'
    })
    await queryInterface.addIndex('sys_oper_log', ['oper_time'], {
      name: 'idx_sys_oper_log_ot'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('sys_oper_log', 'idx_sys_oper_log_bt')
    await queryInterface.removeIndex('sys_oper_log', 'idx_sys_oper_log_s')
    await queryInterface.removeIndex('sys_oper_log', 'idx_sys_oper_log_ot')
    await queryInterface.dropTable('sys_oper_log')
  }
}
