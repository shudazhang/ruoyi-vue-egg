'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DATE, STRING, BIGINT, CHAR } = Sequelize
    await queryInterface.createTable('sys_job_log', {
      jobLogId: { field: 'job_log_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '任务日志ID' },
      jobName: { field: 'job_name', type: STRING(64), allowNull: false, comment: '任务名称' },
      jobGroup: { field: 'job_group', type: STRING(64), allowNull: false, comment: '任务组名' },
      invokeTarget: { field: 'invoke_target', type: STRING(500), allowNull: false, comment: '调用目标字符串' },
      jobMessage: { field: 'job_message', type: STRING(500), comment: '日志信息' },
      status: { field: 'status', type: CHAR(1), defaultValue: '0', comment: '执行状态（0正常 1失败）' },
      exceptionInfo: { field: 'exception_info', type: STRING(2000), defaultValue: '', comment: '异常信息' },
      createTime: { field: 'create_time', type: DATE, comment: '创建时间' }
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE sys_job_log COMMENT = '定时任务调度日志表';  
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sys_job_log')
  }
}
