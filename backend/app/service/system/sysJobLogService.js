const BaseService = require('./baseService.js')
class SysJobLogService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.jobLogMapper = this.ctx.service.system.mapper.sysJobLogMapper
  }
  /**
   * 获取quartz调度器日志的计划任务
   *
   * @param jobLog 调度日志信息
   * @return 调度任务日志集合
   */
  selectJobLogList(jobLog) {
    return this.jobLogMapper.selectJobLogList(jobLog)
  }

  /**
   * 通过调度任务日志ID查询调度信息
   *
   * @param jobLogId 调度任务日志ID
   * @return 调度任务日志对象信息
   */
  selectJobLogById(jobLogId) {
    return this.jobLogMapper.selectJobLogById(jobLogId)
  }

  /**
   * 新增任务日志
   *
   * @param jobLog 调度日志信息
   */
  async addJobLog(jobLog) {
    await this.jobLogMapper.insertJobLog(jobLog)
  }

  /**
   * 批量删除调度日志信息
   *
   * @param logIds 需要删除的数据ID
   * @return 结果
   */
  deleteJobLogByIds(logIds) {
    return this.jobLogMapper.deleteJobLogByIds(logIds)
  }

  /**
   * 删除任务日志
   *
   * @param jobId 调度日志ID
   */
  deleteJobLogById(jobId) {
    return this.jobLogMapper.deleteJobLogById(jobId)
  }

  /**
   * 清空任务日志
   */
  async cleanJobLog() {
    await this.jobLogMapper.cleanJobLog()
  }
}
module.exports = SysJobLogService
