const BaseController = require('./baseController.js')

const ExcelJS = require('exceljs')
/**
 * 调度任务信息操作处理
 *
 * @author ruoyi
 */
class SysJobController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.jobService = this.ctx.service.system.sysJobService
    this.cronUtils = this.ctx.service.system.cronUtils
  }
  /**
   * 查询定时任务列表
   */
  async list() {
    try {
      const sysJob = this.ctx.query
      const list = await this.jobService.selectJobList(sysJob)
      this.ctx.body = this.getDataTable(list)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 导出定时任务列表
   */
  async export() {
    try {
      const sysJob = this.ctx.request.body
      const list = await this.jobService.selectJobList(sysJob)
      // 创建工作簿
      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('定时任务')

      // 添加表头
      sheet.columns = [
        { header: '任务序号', key: 'jobId' },
        { header: '任务名称', key: 'jobName' },
        { header: '任务组名', key: 'jobGroup' },
        { header: '调用目标字符串', key: 'invokeTarget' },
        { header: '执行表达式', key: 'cronExpression' },
        { header: '计划策略', key: 'misfirePolicy' },
        { header: '并发执行', key: 'concurrent' },
        { header: '状态', key: 'status' }
      ]

      // 添加数据
      list.rows.forEach((item) => {
        item.status = item.status === '0' ? '正常' : '暂停'
        item.concurrent = item.concurrent === '0' ? '允许' : '禁止'
        item.misfirePolicy = item.misfirePolicy == '0' ? '默认' : item.misfirePolicy == '1' ? '立即触发执行' : item.misfirePolicy == '2' ? '触发一次执行' : item.misfirePolicy == '3' ? '不触发立即执行' : ''
        sheet.addRow(item)
      })

      // 定义响应的形式
      const fileName = 'sys_dict_type.xlsx'
      this.ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      this.ctx.set('Content-Disposition', `attachment; filename=${encodeURIComponent(fileName)}`)

      // 将Excel文件流输出到HTTP响应
      // 使用 writeBuffer 方法并等待Promise完成
      this.ctx.body = await workbook.xlsx.writeBuffer()
      this.ctx.status = 200
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 获取定时任务详细信息
   */
  async getInfo() {
    try {
      const jobId = this.ctx.params.jobId
      this.ctx.body = this.success(await this.jobService.selectJobById(jobId))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 新增定时任务
   */
  async add() {
    try {
      const job = this.ctx.request.body
      if (!this.cronUtils.isValid(job.cronExpression)) {
        return (this.ctx.body = this.error("新增任务'" + job.jobName + "'失败，Cron表达式不正确"))
      } else if (('' + job.invokeTarget).toLocaleLowerCase().includes(('' + this.Constants.LOOKUP_RMI).toLocaleLowerCase())) {
        return (this.ctx.body = this.error("新增任务'" + job.jobName + "'失败，目标字符串不允许'rmi'调用"))
      } else if (('' + job.invokeTarget).toLocaleLowerCase().includes(('' + this.Constants.LOOKUP_LDAP).toLocaleLowerCase()) || ('' + job.invokeTarget).toLocaleLowerCase().includes(('' + this.Constants.LOOKUP_LDAPS).toLocaleLowerCase())) {
        return (this.ctx.body = this.error("新增任务'" + job.jobName + "'失败，目标字符串不允许'ldap(s)'调用"))
      } else if (('' + job.invokeTarget).toLocaleLowerCase().includes(('' + this.Constants.HTTP).toLocaleLowerCase()) || ('' + job.invokeTarget).toLocaleLowerCase().includes(('' + this.Constants.HTTPS).toLocaleLowerCase())) {
        return (this.ctx.body = this.error("新增任务'" + job.jobName + "'失败，目标字符串不允许'http(s)'调用"))
      } else if (this.Constants.JOB_ERROR_STR.includes(job.invokeTarget)) {
        return (this.ctx.body = this.error("新增任务'" + job.jobName + "'失败，目标字符串存在违规"))
      } else if (!this.cronUtils.whiteList(job.invokeTarget)) {
        return (this.ctx.body = this.error("新增任务'" + job.jobName + "'失败，目标字符串不在白名单内"))
      }
      job.createBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.jobService.insertJob(job))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 修改定时任务
   */
  async edit() {
    try {
      const job = this.ctx.request.body

      if (!this.cronUtils.isValid(job.cronExpression)) {
        return (this.ctx.body = this.error("修改任务'" + job.jobName + "'失败，Cron表达式不正确"))
      } else if (('' + job.invokeTarget).toLocaleLowerCase().includes(('' + this.Constants.LOOKUP_RMI).toLocaleLowerCase())) {
        return (this.ctx.body = this.error("修改任务'" + job.jobName + "'失败，目标字符串不允许'rmi'调用"))
      } else if (('' + job.invokeTarget).toLocaleLowerCase().includes(('' + this.Constants.LOOKUP_LDAP).toLocaleLowerCase()) || ('' + job.invokeTarget).toLocaleLowerCase().includes(('' + this.Constants.LOOKUP_LDAPS).toLocaleLowerCase())) {
        return (this.ctx.body = this.error("修改任务'" + job.jobName + "'失败，目标字符串不允许'ldap(s)'调用"))
      } else if (('' + job.invokeTarget).toLocaleLowerCase().includes(('' + this.Constants.HTTP).toLocaleLowerCase()) || ('' + job.invokeTarget).toLocaleLowerCase().includes(('' + this.Constants.HTTPS).toLocaleLowerCase())) {
        return (this.ctx.body = this.error("修改任务'" + job.jobName + "'失败，目标字符串不允许'http(s)'调用"))
      } else if (this.Constants.JOB_ERROR_STR.includes(job.invokeTarget)) {
        return (this.ctx.body = this.error("修改任务'" + job.jobName + "'失败，目标字符串存在违规"))
      } else if (!this.cronUtils.whiteList(job.invokeTarget)) {
        return (this.ctx.body = this.error("修改任务'" + job.jobName + "'失败，目标字符串不在白名单内"))
      }
      job.updateBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.jobService.updateJob(job))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 定时任务状态修改
   */
  async changeStatus() {
    try {
      const job = this.ctx.request.body
      let newJob = await this.jobService.selectJobById(job.jobId)
      newJob = newJob.dataValues
      newJob.status = job.status
      this.ctx.body = this.toAjax(await this.jobService.changeStatus(newJob))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 定时任务立即执行一次
   */
  async run() {
    try {
      const job = this.ctx.request.body
      const result = await this.jobService.run(job)
      result ? (this.ctx.body = this.success()) : (this.ctx.body = this.error('任务不存在或已过期！'))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 删除定时任务
   */
  async remove() {
    try {
      const jobIds = this.ctx.params.jobIds.split(',')
      await this.jobService.deleteJobByIds(jobIds)
      this.ctx.body = this.success()
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}

module.exports = SysJobController
