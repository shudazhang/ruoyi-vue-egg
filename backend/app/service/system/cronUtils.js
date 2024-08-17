const cron = require('node-cron')
const BaseService = require('./baseService.js')
class CronUtils extends BaseService {
  /**
   * 检查包名是否为白名单配置
   *
   * @param invokeTarget 目标字符串
   * @return 结果
   */
  whiteList(invokeTarget) {
    const packageName = invokeTarget.slice(0, invokeTarget.indexOf('(')).slice(0, invokeTarget.lastIndexOf('.'))
    return this.Constants.JOB_WHITELIST_STR.includes(packageName) && !this.Constants.JOB_ERROR_STR.includes(packageName)
  }
  /**
   * 清空定时任务
   */
  clear() {
    for (const jobKey in this.app.cornManager) {
      this.deleteJob(jobKey)
    }
  }
  /**
   * 生成任务键名
   *
   * @param jobId 任务对象ID
   * @return 任务键名
   */
  getJobKey(jobId, jobGroup) {
    return `${this.ScheduleConstants.TASK_CLASS_NAME}_${jobGroup}_${jobId}`
  }
  /**
   * 判断任务是否存在
   *
   * @param jobKey 任务名称
   * @return 结果
   */
  checkExists(jobKey) {
    return !!this.app.cornManager[jobKey]
  }
  /**
   * 获取新的Cron表达式
   *
   * @param cronExpression Cron表达式
   * @return 新的Cron表达式
   */
  getNewCronExpression(cronExpression) {
    // if (cronExpression.endsWith('?')) {
    //   cronExpression = cronExpression.substring(0, cronExpression.length - 1)
    // }
    cronExpression = cronExpression.replace(/\?/g, '*')
    return cronExpression
  }
  /**
   * 返回一个布尔值代表一个给定的Cron表达式的有效性
   *
   * @param cronExpression Cron表达式
   * @return boolean 表达式是否有效
   */
  isValid(cronExpression) {
    return cron.validate(this.getNewCronExpression(cronExpression))
  }
  /**
   * 创建定时任务
   *
   * @param job 调度信息 调度信息
   */
  createScheduleJob(job) {
    if (!this.app.cornManager) {
      this.app.cornManager = {}
    }
    const jobKey = this.getJobKey(job.jobId, job.jobGroup)
    const scheduleTask = cron.schedule(
      this.getNewCronExpression(job.cronExpression),
      async () => {
        await this.runTask(job)
      },
      {
        scheduled: job.status == this.ScheduleConstants.Status.NORMAL
      }
    )
    this.app.cornManager[jobKey] = scheduleTask
  }
  /**
   * 删除定时任务
   *
   * @param jobKey 任务名称
   */
  deleteJob(jobKey) {
    if (this.app.cornManager[jobKey]) {
      this.app.cornManager[jobKey].stop()
      delete this.app.cornManager[jobKey]
    }
  }
  /**
   * 恢复定时任务
   *
   * @param jobKey 任务名称
   */
  resumeJob(jobKey) {
    if (this.app.cornManager[jobKey]) {
      this.app.cornManager[jobKey].start()
    } else {
      throw new Error('任务不存在')
    }
  }
  /**
   * 暂停定时任务
   *
   * @param jobKey 任务名称
   */
  pauseJob(jobKey) {
    if (this.app.cornManager[jobKey]) {
      this.app.cornManager[jobKey].stop()
    } else {
      throw new Error('任务不存在')
    }
  }
  /**
   * 立即执行任务
   *
   * @param jobKey 任务名称
   */
  async triggerJob(jobKey, dataMap) {
    if (this.app.cornManager[jobKey]) {
      const job = dataMap[this.ScheduleConstants.TASK_PROPERTIES]
      await this.runTask(job)
    } else {
      throw new Error('任务不存在')
    }
  }
  /**
   * 执行任务
   *
   * @param job 调度信息
   */
  async runTask(job) {
    let jobMessage = `${job.jobName}`
    let status = ''
    let exceptionInfo = ''
    const startTime = new Date().getTime()
    try {
      const invokeTarget = job.invokeTarget
      const methodList = ('' + invokeTarget.slice(0, invokeTarget.indexOf('('))).split('.')
      const argList = ('' + invokeTarget.slice(invokeTarget.indexOf('(') + 1, invokeTarget.length - 1)).split(',')
      const testTaskMethod = methodList.reduce((obj, key) => obj[key], this)
      await testTaskMethod.apply(this, argList)
      status = this.Constants.SUCCESS
    } catch (error) {
      status = this.Constants.FAIL
      exceptionInfo += ` ${error.message}`
    }
    jobMessage += ` 总共耗时：${new Date().getTime() - startTime}`
    await this.ctx.service.system.sysJobLogService.addJobLog({
      jobName: job.jobName,
      jobGroup: job.jobGroup,
      invokeTarget: job.invokeTarget,
      jobMessage: jobMessage,
      status: status,
      exceptionInfo: exceptionInfo
    })
  }
}

module.exports = CronUtils
