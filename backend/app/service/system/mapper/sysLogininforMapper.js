const { Service } = require('egg')

class SysLogininforMapper extends Service {
  /**
   * 新增系统登录日志
   *
   * @param logininfor 访问日志对象
   */

  async insertLogininfor(logininfor) {
    return this.app.model.System.SysLogininfor.create({ ...logininfor, loginTime: new Date() })
  }
  /**
   * 查询系统登录日志集合
   *
   * @param logininfor 访问日志对象
   * @return 登录记录集合
   */
  selectLogininforList(logininfor) {
    const params = {
      where: {},
      order: [['infoId', 'DESC']]
    }
    if (logininfor.pageNum && logininfor.pageSize) {
      params.offset = parseInt(((logininfor.pageNum || 1) - 1) * (logininfor.pageSize || 10))
      params.limit = parseInt(logininfor.pageSize || 10)
    }
    if (logininfor.ipaddr) {
      params.where.ipaddr = {
        [this.app.Sequelize.Op.like]: `%${logininfor.ipaddr}%`
      }
    }
    if (!['undefined', 'null', ''].includes('' + logininfor.status)) {
      params.where.status = logininfor.status
    }

    if (logininfor.userName) {
      params.where.userName = {
        [this.app.Sequelize.Op.like]: `%${logininfor.userName}%`
      }
    }
    if (logininfor['params[beginTime]'] && logininfor['params[endTime]']) {
      params.where.operTime = {
        [this.app.Sequelize.Op.between]: [new Date(logininfor['params[beginTime]'] + ' 00:00:00').toISOString().slice(0, 10), new Date(logininfor['params[endTime]'] + ' 23:59:59').toISOString().slice(0, 10)]
      }
    }
    if (logininfor.params && logininfor.params.beginTime && logininfor.params.endTime) {
      params.where.operTime = {
        [this.app.Sequelize.Op.between]: [new Date(logininfor.params.beginTime + ' 00:00:00').toISOString().slice(0, 10), new Date(logininfor.params.endTime + ' 23:59:59').toISOString().slice(0, 10)]
      }
    }
    if (logininfor.pageNum && logininfor.pageSize) {
      return this.app.model.System.SysLogininfor.findAndCountAll(params)
    } else {
      return this.app.model.System.SysLogininfor.findAll(params)
    }
  }
  /**
   * 批量删除系统登录日志
   *
   * @param infoIds 需要删除的登录日志ID
   * @return 结果
   */
  deleteLogininforByIds(infoIds) {
    return this.app.model.System.SysLogininfor.destroy({
      where: {
        infoId: infoIds
      }
    })
  }
  /**
   * 清空系统登录日志
   *
   * @return 结果
   */
  cleanLogininfor() {
    return this.ctx.model.query('truncate table sys_logininfor', { type: this.ctx.model.QueryTypes.RAW })
  }
}
module.exports = SysLogininforMapper
