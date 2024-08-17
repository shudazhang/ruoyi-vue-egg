const BaseService = require('./baseService.js')
class SysNoticeService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.noticeMapper = this.ctx.service.system.mapper.sysNoticeMapper
  }
  /**
   * 查询公告信息
   *
   * @param noticeId 公告ID
   * @return 公告信息
   */
  selectNoticeById(noticeId) {
    return this.noticeMapper.selectNoticeById(noticeId)
  }
  /**
   * 查询公告列表
   *
   * @param notice 公告信息
   * @return 公告集合
   */
  selectNoticeList(notice) {
    return this.noticeMapper.selectNoticeList(notice)
  }

  /**
   * 新增公告
   *
   * @param notice 公告信息
   * @return 结果
   */
  insertNotice(notice) {
    return this.noticeMapper.insertNotice(notice)
  }
  /**
   * 修改公告
   *
   * @param notice 公告信息
   * @return 结果
   */
  updateNotice(notice) {
    return this.noticeMapper.updateNotice(notice)
  }
  /**
   * 删除公告对象
   *
   * @param noticeId 公告ID
   * @return 结果
   */
  deleteNoticeById(noticeId) {
    return this.noticeMapper.deleteNoticeById(noticeId)
  }
  /**
   * 批量删除公告信息
   *
   * @param noticeIds 需要删除的公告ID
   * @return 结果
   */
  deleteNoticeByIds(noticeIds) {
    return this.noticeMapper.deleteNoticeByIds(noticeIds)
  }
}
module.exports = SysNoticeService
