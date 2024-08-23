const { Service } = require('egg')

class SysOperLogMapper extends Service {
  /**
   * 新增操作日志
   *
   * @param operLog 操作日志对象
   */
  async insertOperlog(operLog) {
    return this.app.model.System.SysOperLog.create({ ...operLog, operTime: new Date() })
  }
  /**
   * 查询系统操作日志集合
   *
   * @param operLog 操作日志对象
   * @return 操作日志集合
   */
  selectOperLogList(operLog) {
    const params = {
      where: {},
      order: [['operId', 'DESC']]
    }
    if (!['undefined', 'null', ''].includes('' + operLog.pageNum) && !['undefined', 'null', ''].includes('' + operLog.pageSize)) {
      params.offset = parseInt(((operLog.pageNum || 1) - 1) * (operLog.pageSize || 10))
      params.limit = parseInt(operLog.pageSize || 10)
    }
    if (!['undefined', 'null', ''].includes('' + operLog.operIp)) {
      params.where.operIp = {
        [this.app.Sequelize.Op.like]: `%${operLog.operIp}%`
      }
    }
    if (!['undefined', 'null', ''].includes('' + operLog.title)) {
      params.where.title = {
        [this.app.Sequelize.Op.like]: `%${operLog.title}%`
      }
    }
    if (!['undefined', 'null', ''].includes('' + operLog.businessType)) {
      params.where.businessType = operLog.businessType
    }
    if (!['undefined', 'null', ''].includes('' + operLog.businessTypes)) {
      params.where.businessType = operLog.businessTypes
    }
    if (!['undefined', 'null', ''].includes('' + operLog.status)) {
      params.where.status = operLog.status
    }
    if (!['undefined', 'null', ''].includes('' + operLog.operName)) {
      params.where.operName = {
        [this.app.Sequelize.Op.like]: `%${operLog.operName}%`
      }
    }
    if (operLog['params[beginTime]'] && operLog['params[endTime]']) {
      params.where.operTime = {
        [this.app.Sequelize.Op.between]: [new Date(operLog['params[beginTime]'] + ' 00:00:00').toISOString().slice(0, 10), new Date(operLog['params[endTime]'] + ' 23:59:59').toISOString().slice(0, 10)]
      }
    }
    if (operLog.params && operLog.params.beginTime && operLog.params.endTime) {
      params.where.operTime = {
        [this.app.Sequelize.Op.between]: [new Date(operLog.params.beginTime + ' 00:00:00').toISOString().slice(0, 10), new Date(operLog.params.endTime + ' 23:59:59').toISOString().slice(0, 10)]
      }
    }
    if (!['undefined', 'null', ''].includes('' + operLog.pageNum) && !['undefined', 'null', ''].includes('' + operLog.pageSize)) {
      return this.app.model.System.SysOperLog.findAndCountAll(params)
    } else {
      return this.app.model.System.SysOperLog.findAll(params)
    }
  }
  /**
   * 批量删除系统操作日志
   *
   * @param operIds 需要删除的操作日志ID
   * @return 结果
   */
  deleteOperLogByIds(operIds) {
    return this.app.model.System.SysOperLog.destroy({
      where: {
        operId: operIds
      }
    })
  }
  /**
   * 查询操作日志详细
   *
   * @param operId 操作ID
   * @return 操作日志对象
   */
  selectOperLogById(operId) {
    return this.app.model.System.SysOperLog.findOne({
      where: {
        operId: operId
      }
    })
  }
  /**
   * 清空操作日志
   */
  cleanOperLog() {
    return this.ctx.model.query('truncate table sys_oper_log', { type: this.ctx.model.QueryTypes.RAW })
  }
}
module.exports = SysOperLogMapper
