const BaseService = require('./baseService.js')

class SysJobService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.jobMapper = this.ctx.service.system.mapper.sysJobMapper
    this.cronUtils = this.ctx.service.system.cronUtils
  }
  /**
   * 项目启动时，初始化定时器 主要是防止手动修改数据库导致未同步到定时任务处理（注：不能手动修改数据库ID和任务组名，否则会导致脏数据）
   */
  async init() {
    await this.cronUtils.clear()
    const jobList = await this.jobMapper.selectJobAll()
    for (const job of jobList) {
      this.cronUtils.createScheduleJob(job)
    }
  }
  /**
   * 获取quartz调度器的计划任务列表
   *
   * @param job 调度信息
   * @return
   */
  selectJobList(job) {
    return this.jobMapper.selectJobList(job)
  }
  /**
   * 通过调度任务ID查询调度信息
   *
   * @param jobId 调度任务ID
   * @return 调度任务对象信息
   */
  selectJobById(jobId) {
    return this.jobMapper.selectJobById(jobId)
  }
  /**
   * 暂停任务
   *
   * @param job 调度信息
   */
  async pauseJob(job) {
    const jobId = job.jobId
    const jobGroup = job.jobGroup
    job.status = this.ScheduleConstants.Status.PAUSE

    const rows = 1
    await this.jobMapper.updateJob(job)
    if (rows > 0) {
      this.cronUtils.pauseJob(this.cronUtils.getJobKey(jobId, jobGroup))
    }
    return rows
  }
  /**
   * 恢复任务
   *
   * @param job 调度信息
   */
  async resumeJob(job) {
    const jobId = job.jobId
    const jobGroup = job.jobGroup
    job.status = this.ScheduleConstants.Status.NORMAL
    const rows = 1
    await this.jobMapper.updateJob(job)
    if (rows > 0) {
      this.cronUtils.resumeJob(this.cronUtils.getJobKey(jobId, jobGroup))
    }
    return rows
  }
  /**
   * 删除任务后，所对应的trigger也将被删除
   *
   * @param job 调度信息
   */
  async deleteJob(job) {
    const jobId = job.jobId
    const jobGroup = job.jobGroup
    const rows = 1
    await this.jobMapper.deleteJobById(jobId)
    if (rows > 0) {
      this.cronUtils.deleteJob(this.cronUtils.getJobKey(jobId, jobGroup))
    }
    return rows
  }
  /**
   * 批量删除调度信息
   *
   * @param jobIds 需要删除的任务ID
   * @return 结果
   */
  async deleteJobByIds(jobIds) {
    for (const jobId of jobIds) {
      const job = await this.jobMapper.selectJobById(jobId)
      await this.deleteJob(job)
    }
  }
  /**
   * 任务调度状态修改
   *
   * @param job 调度信息
   */
  async changeStatus(job) {
    let rows = 0
    const status = job.status
    if (this.ScheduleConstants.Status.NORMAL == status) {
      rows = await this.resumeJob(job)
    } else if (this.ScheduleConstants.Status.PAUSE == status) {
      rows = await this.pauseJob(job)
    }
    return rows
  }
  /**
   * 立即运行任务
   *
   * @param job 调度信息
   */
  async run(job) {
    let result = false
    const jobId = job.jobId
    const jobGroup = job.jobGroup
    const properties = await this.selectJobById(job.jobId)
    // 参数
    const dataMap = {}
    dataMap[this.ScheduleConstants.TASK_PROPERTIES] = properties
    const jobKey = this.cronUtils.getJobKey(jobId, jobGroup)
    if (this.cronUtils.checkExists(jobKey)) {
      result = true
      this.cronUtils.triggerJob(jobKey, dataMap)
    }
    return true
  }
  /**
   * 新增任务
   *
   * @param job 调度信息 调度信息
   */
  async insertJob(job) {
    job.status = this.ScheduleConstants.Status.PAUSE
    const rows = 1
    job = await this.jobMapper.insertJob(job)
    if (rows > 0) {
      await this.cronUtils.createScheduleJob(job)
    }
    return rows
  }
  /**
   * 更新任务的时间表达式
   *
   * @param job 调度信息
   */
  async updateJob(job) {
    const properties = await this.selectJobById(job.jobId)
    const rows = 1
    await this.jobMapper.updateJob(job)
    if (rows > 0) {
      await this.updateSchedulerJob(job, properties.jobGroup)
    }
    return rows
  }
  /**
   * 更新任务
   *
   * @param job 任务对象
   * @param jobGroup 任务组名
   */
  updateSchedulerJob(job, jobGroup) {
    const jobId = job.jobId
    // 判断是否存在
    const jobKey = this.cronUtils.getJobKey(jobId, jobGroup)
    if (this.cronUtils.checkExists(jobKey)) {
      // 防止创建时存在数据问题 先移除，然后在执行创建操作
      this.cronUtils.deleteJob(jobKey)
    }
    this.cronUtils.createScheduleJob(job)
  }
}
module.exports = SysJobService
