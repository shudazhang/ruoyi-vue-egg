'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DATE, STRING, BIGINT, CHAR } = Sequelize
    await queryInterface.createTable('sys_job', {
      jobId: { field: 'job_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '任务ID' },
      jobName: { field: 'job_name', type: STRING(64), primaryKey: true, allowNull: false, defaultValue: '', comment: '任务名称' },
      jobGroup: { field: 'job_group', type: STRING(64), primaryKey: true, allowNull: false, defaultValue: 'DEFAULT', comment: '任务组名' },
      invokeTarget: { field: 'invoke_target', type: STRING(500), allowNull: false, comment: '调用目标字符串' },
      cronExpression: { field: 'cron_expression', type: STRING(255), defaultValue: '', comment: 'cron执行表达式' },
      misfirePolicy: { field: 'misfire_policy', type: STRING(20), defaultValue: '3', comment: '计划执行错误策略（1立即执行 2执行一次 3放弃执行）' },
      concurrent: { field: 'concurrent', type: CHAR(1), defaultValue: '1', comment: '是否并发执行（0允许 1禁止）' },
      status: { field: 'status', type: CHAR(1), defaultValue: '0', comment: '状态（0正常 1暂停' },
      createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
      createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
      updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
      updateTime: { field: 'update_time', type: DATE, comment: '更新时间' },
      remark: { field: 'remark', type: STRING(500), defaultValue: '', comment: '备注信息' }
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE sys_job COMMENT = '定时任务调度表';  
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sys_job')
  }
}
