const BaseService = require('./baseService.js')
class sysOperLogService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.operLogMapper = this.ctx.service.system.mapper.sysOperLogMapper
  }
  /**
   * 新增操作日志
   *
   * @param operLog 操作日志对象
   */
  async insertOperlog(operLog) {
    await this.operLogMapper.insertOperlog(operLog)
  }
  /**
   * 查询系统操作日志集合
   *
   * @param operLog 操作日志对象
   * @return 操作日志集合
   */
  selectOperLogList(operLog) {
    return this.operLogMapper.selectOperLogList(operLog)
  }
  /**
   * 批量删除系统操作日志
   *
   * @param operIds 需要删除的操作日志ID
   * @return 结果
   */
  deleteOperLogByIds(operIds) {
    return this.operLogMapper.deleteOperLogByIds(operIds)
  }
  /**
   * 查询操作日志详细
   *
   * @param operId 操作ID
   * @return 操作日志对象
   */
  selectOperLogById(operId) {
    return this.operLogMapper.selectOperLogById(operId)
  }
  /**
   * 清空操作日志
   */
  async cleanOperLog() {
    await this.operLogMapper.cleanOperLog()
  }
}
module.exports = sysOperLogService
