const { Service } = require('egg')

class SysNoticeMapper extends Service {
  /**
   * 查询公告信息
   *
   * @param noticeId 公告ID
   * @return 公告信息
   */
  selectNoticeById(noticeId) {
    return this.app.model.System.SysNotice.findOne({
      where: {
        noticeId: noticeId
      }
    })
  }
  /**
   * 查询公告列表
   *
   * @param notice 公告信息
   * @return 公告集合
   */
  selectNoticeList(notice) {
    const params = {
      where: {}
    }

    if (!['undefined', 'null', ''].includes('' + notice.pageNum) && !['undefined', 'null', ''].includes('' + notice.pageSize)) {
      params.offset = parseInt(((notice.pageNum || 1) - 1) * (notice.pageSize || 10))
      params.limit = parseInt(notice.pageSize || 10)
    }
    if (!['undefined', 'null', ''].includes('' + notice.noticeTitle)) {
      params.where.noticeTitle = {
        [this.app.Sequelize.Op.like]: `%${notice.noticeTitle}%`
      }
    }
    if (!['undefined', 'null', ''].includes('' + notice.noticeType)) {
      params.where.noticeType = notice.noticeType
    }
    if (!['undefined', 'null', ''].includes('' + notice.createBy)) {
      params.where.createBy = {
        [this.app.Sequelize.Op.like]: `%${notice.createBy}%`
      }
    }

    if (!['undefined', 'null', ''].includes('' + notice.pageNum) && !['undefined', 'null', ''].includes('' + notice.pageSize)) {
      return this.app.model.System.SysNotice.findAndCountAll(params)
    } else {
      return this.app.model.System.SysNotice.findAll(params)
    }
  }

  /**
   * 新增公告
   *
   * @param notice 公告信息
   * @return 结果
   */
  insertNotice(notice) {
    return this.app.model.System.SysNotice.create({ ...notice, createTime: new Date() })
  }
  /**
   * 修改公告
   *
   * @param notice 公告信息
   * @return 结果
   */
  updateNotice(notice) {
    return this.app.model.System.SysNotice.update(
      { ...notice, updateTime: new Date() },
      {
        where: {
          noticeId: notice.noticeId
        }
      }
    )
  }
  /**
   * 批量删除公告
   *
   * @param noticeId 公告ID
   * @return 结果
   */
  deleteNoticeById(noticeId) {
    return this.app.model.System.SysNotice.destroy({
      where: {
        noticeId: noticeId
      }
    })
  }
  /**
   * 批量删除公告信息
   *
   * @param noticeIds 需要删除的公告ID
   * @return 结果
   */
  deleteNoticeByIds(noticeIds) {
    return this.app.model.System.SysNotice.destroy({
      where: {
        noticeId: noticeIds
      }
    })
  }
}
module.exports = SysNoticeMapper
