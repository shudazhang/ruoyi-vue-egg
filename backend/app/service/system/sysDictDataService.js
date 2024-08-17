const BaseService = require('./baseService.js')
class SysDictDataService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.dictDataMapper = this.ctx.service.system.mapper.sysDictDataMapper
    this.dictUtils = this.ctx.service.system.dictUtils
    this.dictTypeMapper = this.ctx.service.system.mapper.sysDictTypeMapper
  }
  /**
   * 根据条件分页查询字典数据
   *
   * @param dictData 字典数据信息
   * @return 字典数据集合信息
   */
  selectDictDataList(dictData) {
    return this.dictDataMapper.selectDictDataList(dictData)
  }
  /**
   * 根据字典类型和字典键值查询字典数据信息
   *
   * @param dictType 字典类型
   * @param dictValue 字典键值
   * @return 字典标签
   */
  selectDictLabel(dictType, dictValue) {
    return this.dictDataMapper.selectDictLabel(dictType, dictValue)
  }

  /**
   * 根据字典数据ID查询信息
   *
   * @param dictCode 字典数据ID
   * @return 字典数据
   */
  selectDictDataById(dictCode) {
    return this.dictDataMapper.selectDictDataById(dictCode)
  }
  /**
   * 批量删除字典数据信息
   *
   * @param dictCodes 需要删除的字典数据ID
   */
  async deleteDictDataByIds(dictCodes) {
    for (const dictCode of dictCodes) {
      const data = await this.selectDictDataById(dictCode)
      await this.dictDataMapper.deleteDictDataById(dictCode)
      const dictDatas = await this.dictDataMapper.selectDictDataByType(data.dictType)
      await this.dictUtils.setDictCache(data.dictType, dictDatas)
    }
  }
  /**
   * 新增保存字典数据信息
   *
   * @param data 字典数据信息
   * @return 结果
   */
  async insertDictData(data) {
    const row = 1
    await this.dictDataMapper.insertDictData(data)
    const dictDatas = await this.dictDataMapper.selectDictDataByType(data.dictType)
    await this.dictUtils.setDictCache(data.dictType, dictDatas)
    return row
  }
  /**
   * 修改保存字典数据信息
   *
   * @param data 字典数据信息
   * @return 结果
   */
  async updateDictData(data) {
    const row = 1
    await this.dictDataMapper.updateDictData(data)
    const dictDatas = await this.dictDataMapper.selectDictDataByType(data.dictType)
    await this.dictUtils.setDictCache(data.dictType, dictDatas)
    return row
  }
}
module.exports = SysDictDataService
