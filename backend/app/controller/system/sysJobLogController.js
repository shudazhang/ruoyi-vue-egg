const BaseController = require('./baseController.js')
const ExcelJS = require('exceljs')
/**
 * 调度日志操作处理
 *
 * @author ruoyi
 */
class SysJobLogController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.jobLogService = this.ctx.service.system.sysJobLogService
    this.cronUtils = this.ctx.service.system.cronUtils
  }
  /**
   * 查询定时任务调度日志列表
   */
  async list() {
    try {
      const sysJobLog = this.ctx.query
      const list = await this.jobLogService.selectJobLogList(sysJobLog)
      this.ctx.body = this.getDataTable(list)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 导出定时任务调度日志列表
   */
  async export() {
    try {
      const sysJobLog = this.ctx.request.body
      const list = await this.jobLogService.selectJobLogList(sysJobLog)
      // 创建工作簿
      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('定时任务')

      // 添加表头
      sheet.columns = [
        { header: '日志序号', key: 'jobLogId' },
        { header: '任务名称', key: 'jobName' },
        { header: '任务组名', key: 'jobGroup' },
        { header: '调用目标字符串', key: 'invokeTarget' },
        { header: '日志信息', key: 'jobMessage' },
        { header: '状态', key: 'status' },
        { header: '异常信息', key: 'exceptionInfo' }
      ]

      // 添加数据
      list.rows.forEach((item) => {
        item.status = item.status === '0' ? '正常' : '失败'
        sheet.addRow(item)
      })

      // 定义响应的形式
      const fileName = 'sys_job_log.xlsx'
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
   * 根据调度编号获取详细信息
   */
  async getInfo() {
    try {
      const jobLogId = this.ctx.params.jobLogId
      this.ctx.body = this.success(await this.jobLogService.selectJobLogById(jobLogId))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }

  /**
   * 删除定时任务调度日志
   */
  async remove() {
    try {
      const jobLogIds = this.ctx.params.jobLogIds.split(',')
      this.ctx.body = this.toAjax(await this.jobLogService.deleteJobLogByIds(jobLogIds))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 清空定时任务调度日志
   */
  async clean() {
    try {
      await this.jobLogService.cleanJobLog()
      this.ctx.body = this.success()
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}

module.exports = SysJobLogController
