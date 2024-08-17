const BaseController = require('./baseController.js')
const ExcelJS = require('exceljs')
/**
 * 系统访问记录
 * 
 * @author ruoyi
 */
class SysLogininforController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.logininforService = this.ctx.service.system.sysLogininforService
    this.passwordService = this.ctx.service.system.sysPasswordService
  }
  async list() {
    try {
      const logininfor = this.ctx.query
      const list = await this.logininforService.selectLogininforList(logininfor)
      this.ctx.body = this.getDataTable(list)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async export() {
    try {
      const logininfor = this.ctx.request.body
      const list = await this.logininforService.selectLogininforList(logininfor)
      // 创建工作簿
      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('登录日志')

      // 添加表头
      sheet.columns = [
        { header: '序号', key: 'infoId' },
        { header: '用户账号', key: 'userName' },
        { header: '登录状态', key: 'status' },
        { header: '登录地址', key: 'ipaddr' },
        { header: '登录地点', key: 'loginLocation' },
        { header: '浏览器', key: 'browser' },
        { header: '操作系统', key: 'os' },
        { header: '提示消息', key: 'msg' },
        { header: '访问时间', key: 'loginTime' }
      ]

      // 添加数据
      list.rows.forEach((item) => {
        item.status = item.status === '0' ? '成功' : '失败'
        sheet.addRow(item)
      })

      // 定义响应的形式
      const fileName = 'sys_logininfor.xlsx'
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
      const infoIds = this.ctx.params.infoIds.split(',')
      this.ctx.body = this.toAjax(await this.logininforService.deleteLogininforByIds(infoIds))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async clean() {
    try {
      await this.logininforService.cleanLogininfor()
      this.ctx.body = this.success()
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async unlock() {
    try {
      const userName = this.ctx.params.userName
      await this.passwordService.clearLoginRecordCache(userName)
      this.ctx.body = this.success()
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}
module.exports = SysLogininforController
