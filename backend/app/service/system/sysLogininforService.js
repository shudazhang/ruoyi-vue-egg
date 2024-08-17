const BaseService = require('./baseService.js')
class SysLogininforService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.logininforMapper = this.ctx.service.system.mapper.sysLogininforMapper
  }
  /**
   * 新增系统登录日志
   *
   * @param logininfor 访问日志对象
   */
  async insertLogininfor(logininfor) {
    await this.logininforMapper.insertLogininfor(logininfor)
  }
  /**
   * 查询系统登录日志集合
   *
   * @param logininfor 访问日志对象
   * @return 登录记录集合
   */
  selectLogininforList(logininfor) {
    return this.logininforMapper.selectLogininforList(logininfor)
  }
  /**
   * 批量删除系统登录日志
   *
   * @param infoIds 需要删除的登录日志ID
   * @return 结果
   */
  deleteLogininforByIds(infoIds) {
    return this.logininforMapper.deleteLogininforByIds(infoIds)
  }

  /**
   * 清空系统登录日志
   */
  async cleanLogininfor() {
    await this.logininforMapper.cleanLogininfor();
  }
}
module.exports = SysLogininforService
