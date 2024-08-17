const BaseController = require('./baseController.js')
/**
 * 公告 信息操作处理
 * 
 * @author ruoyi
 */
class SysNoticeController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.noticeService = this.ctx.service.system.sysNoticeService
  }
  /**
   * 获取通知公告列表
   */
  async list() {
    try {
      const notice = this.ctx.query
      const list = await this.noticeService.selectNoticeList(notice)
      this.ctx.body = this.getDataTable(list)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }

  /**
   * 根据通知公告编号获取详细信息
   */
  async getInfo() {
    try {
      const noticeId = this.ctx.params.noticeId
      this.ctx.body = this.success(await this.noticeService.selectNoticeById(noticeId))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }

  /**
   * 新增通知公告
   */
  async add() {
    try {
      const notice = this.ctx.request.body
      notice.createBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.noticeService.insertNotice(notice))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 修改通知公告
   */
  async edit() {
    try {
      const notice = this.ctx.request.body
      notice.updateBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.noticeService.updateNotice(notice))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 删除通知公告
   */
  async remove() {
    try {
      const noticeIds = this.ctx.params.noticeIds.split(',')
      this.ctx.body = this.toAjax(await this.noticeService.deleteNoticeByIds(noticeIds))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}

module.exports = SysNoticeController
