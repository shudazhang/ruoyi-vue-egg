const BaseController = require('./baseController.js')
const ExcelJS = require('exceljs')
/**
 * 操作日志记录
 * 
 * @author ruoyi
 */
class SysOperlogController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.operLogService = this.ctx.service.system.sysOperLogService
  }
  async list() {
    try {
      const operLog = this.ctx.query
      const list = await this.operLogService.selectOperLogList(operLog)
      this.ctx.body = this.getDataTable(list)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async export() {
    try {
      const operLog = this.ctx.request.body
      const list = await this.operLogService.selectOperLogList(operLog)
      // 创建工作簿
      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('操作日志')

      // 添加表头
      sheet.columns = [
        { header: '操作序号', key: 'operId' },
        { header: '操作模块', key: 'title' },
        { header: '业务类型', key: 'businessType' },
        { header: '请求方法', key: 'method' },
        { header: '请求方式', key: 'requestMethod' },
        { header: '操作类别', key: 'operatorType' },
        { header: '操作人员', key: 'operName' },
        { header: '部门名称', key: 'deptName' },
        { header: '请求地址', key: 'operUrl' },
        { header: '操作地址', key: 'operIp' },
        { header: '操作地点', key: 'operLocation' },
        { header: '请求参数', key: 'operParam' },
        { header: '返回参数', key: 'jsonResult' },
        { header: '状态', key: 'status' },
        { header: '错误消息', key: 'errorMsg' },
        { header: '操作时间', key: 'operTime' },
        { header: '消耗时间', key: 'costTime' }
      ]

      // 添加数据
      list.rows.forEach((item) => {
        sheet.addRow(item)
      })

      // 定义响应的形式
      const fileName = 'sys_operlog.xlsx'
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
  async remove() {
    try {
      const operIds = this.ctx.params.operIds.split(',')
      this.ctx.body = this.toAjax(await this.operLogService.deleteOperLogByIds(operIds))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async clean() {
    try {
      await this.operLogService.cleanOperLog()
      this.ctx.body = this.success()
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}
module.exports = SysOperlogController
