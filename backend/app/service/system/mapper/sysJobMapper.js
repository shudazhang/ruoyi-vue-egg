const { Service } = require('egg')

class SysJobMapper extends Service {
  /**
   * 查询调度任务日志集合
   *
   * @param job 调度信息
   * @return 操作日志集合
   */
  async selectJobList(job) {
    const params = {
      where: {}
    }
    if (job.pageNum && job.pageSize) {
      params.offset = parseInt(((job.pageNum || 1) - 1) * (job.pageSize || 10))
      params.limit = parseInt(job.pageSize || 10)
    }

    if (job.jobName) {
      params.where.jobName = {
        [this.app.Sequelize.Op.like]: `%${job.jobName}%`
      }
    }
    if (job.jobGroup) {
      params.where.jobGroup = job.jobGroup
    }
    if (!['undefined', 'null', ''].includes('' + job.status)) {
      params.where.status = job.status
    }
    if (job.invokeTarget) {
      params.where.invokeTarget = {
        [this.app.Sequelize.Op.like]: `%${job.invokeTarget}%`
      }
    }
    if (job.pageNum && job.pageSize) {
      return this.app.model.System.SysJob.findAndCountAll(params)
    } else {
      return this.app.model.System.SysJob.findAll(params)
    }
  }
  /**
   * 查询所有调度任务
   *
   * @return 调度任务列表
   */
  selectJobAll() {
    return this.app.model.System.SysJob.findAll()
  }
  /**
   * 通过调度ID查询调度任务信息
   *
   * @param jobId 调度ID
   * @return 角色对象信息
   */
  async selectJobById(jobId) {
    return this.app.model.System.SysJob.findOne({
      where: {
        jobId: jobId
      }
    })
  }
  /**
   * 通过调度ID删除调度任务信息
   *
   * @param jobId 调度ID
   * @return 结果
   */
  deleteJobById(jobId) {
    return this.app.model.System.SysJob.destroy({
      where: {
        jobId: jobId
      }
    })
  }
  /**
   * 修改调度任务信息
   *
   * @param job 调度任务信息
   * @return 结果
   */
  updateJob(job) {
    return this.app.model.System.SysJob.update(
      { ...job, updateTime: new Date() },
      {
        where: {
          jobId: job.jobId
        }
      }
    )
  }
  /**
   * 新增调度任务信息
   *
   * @param job 调度任务信息
   * @return 结果
   */
  insertJob(job) {
    return this.app.model.System.SysJob.create({ ...job, createTime: new Date() })
  }
}
module.exports = SysJobMapper
