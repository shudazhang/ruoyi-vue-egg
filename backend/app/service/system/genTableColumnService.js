const BaseService = require('./baseService.js')
class GenTableColumnService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.genTableColumnMapper = this.ctx.service.system.mapper.genTableColumnMapper
  }
  /**
     * 查询业务字段列表
     * 
     * @param tableId 业务字段编号
     * @return 业务字段集合
     */
  selectGenTableColumnListByTableId(tableId){
    return this.genTableColumnMapper.selectGenTableColumnListByTableId(tableId);
  }
}

// 导出类
module.exports = GenTableColumnService
