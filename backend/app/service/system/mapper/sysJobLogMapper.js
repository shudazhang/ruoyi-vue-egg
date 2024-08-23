const { Service } = require('egg')

class SysJobLogMapper extends Service {
  /**
   * 获取quartz调度器日志的计划任务
   *
   * @param jobLog 调度日志信息
   * @return 调度任务日志集合
   */
  selectJobLogList(jobLog) {
    const params = {
      where: {}
    }

    if (!['undefined', 'null', ''].includes('' + jobLog.pageNum) && !['undefined', 'null', ''].includes('' + jobLog.pageSize)) {
      params.offset = parseInt(((jobLog.pageNum || 1) - 1) * (jobLog.pageSize || 10))
      params.limit = parseInt(jobLog.pageSize || 10)
    }
    if (!['undefined', 'null', ''].includes('' + jobLog.jobName)) {
      params.where.jobName = {
        [this.app.Sequelize.Op.like]: `%${jobLog.jobName}%`
      }
    }
    if (!['undefined', 'null', ''].includes('' + jobLog.jobGroup)) {
      params.where.jobGroup = jobLog.jobGroup
    }
    if (!['undefined', 'null', ''].includes('' + jobLog.status)) {
      params.where.status = jobLog.status
    }
    if (!['undefined', 'null', ''].includes('' + jobLog.invokeTarget)) {
      params.where.invokeTarget = {
        [this.app.Sequelize.Op.like]: `%${jobLog.invokeTarget}%`
      }
    }
    if (jobLog['params[beginTime]'] && jobLog['params[endTime]']) {
      params.where.createTime = {
        [this.app.Sequelize.Op.between]: [new Date(jobLog['params[beginTime]'] + ' 00:00:00').toISOString().slice(0, 10), new Date(jobLog['params[endTime]'] + ' 23:59:59').toISOString().slice(0, 10)]
      }
    }
    if (jobLog.params && jobLog.params.beginTime && jobLog.params.endTime) {
      params.where.createTime = {
        [this.app.Sequelize.Op.between]: [new Date(jobLog.params.beginTime + ' 00:00:00').toISOString().slice(0, 10), new Date(jobLog.params.endTime + ' 23:59:59').toISOString().slice(0, 10)]
      }
    }
    if (!['undefined', 'null', ''].includes('' + jobLog.pageNum) && !['undefined', 'null', ''].includes('' + jobLog.pageSize)) {
      return this.app.model.System.SysJobLog.findAndCountAll(params)
    } else {
      return this.app.model.System.SysJobLog.findAll(params)
    }
  }

  /**
   * 查询所有调度任务日志
   *
   * @return 调度任务日志列表
   */
  selectJobLogAll() {
    return this.app.model.System.SysJobLog.findAll()
  }

  /**
   * 通过调度任务日志ID查询调度信息
   *
   * @param jobLogId 调度任务日志ID
   * @return 调度任务日志对象信息
   */
  selectJobLogById(jobLogId) {
    return this.app.model.System.SysJobLog.findOne({
      where: {
        jobLogId
      }
    })
  }

  /**
   * 新增任务日志
   *
   * @param jobLog 调度日志信息
   * @return 结果
   */
  insertJobLog(jobLog) {
    return this.app.model.System.SysJobLog.create({ ...jobLog, createTime: new Date() })
  }

  /**
   * 批量删除调度日志信息
   *
   * @param logIds 需要删除的数据ID
   * @return 结果
   */
  deleteJobLogByIds(logIds) {
    return this.app.model.System.SysJobLog.destroy({
      where: {
        jobLogId: logIds
      }
    })
  }

  /**
   * 删除任务日志
   *
   * @param jobId 调度日志ID
   * @return 结果
   */
  deleteJobLogById(jobId) {
    return this.app.model.System.SysJobLog.destroy({
      where: {
        jobId
      }
    })
  }

  /**
   * 清空任务日志
   */
  cleanJobLog() {
    return this.ctx.model.query('truncate table sys_job_log', { type: this.ctx.model.QueryTypes.RAW })
  }
}
module.exports = SysJobLogMapper
