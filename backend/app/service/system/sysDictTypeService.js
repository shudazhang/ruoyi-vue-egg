const BaseService = require('./baseService.js')
class SysDictTypeService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.dictDataMapper = this.ctx.service.system.mapper.sysDictDataMapper
    this.dictUtils = this.ctx.service.system.dictUtils
    this.dictTypeMapper = this.ctx.service.system.mapper.sysDictTypeMapper
  }
  /**
   * 项目启动时，初始化字典到缓存
   */
  async init() {
    await this.loadingDictCache()
  }
  /**
   * 根据条件分页查询字典类型
   *
   * @param dictType 字典类型信息
   * @return 字典类型集合信息
   */
  selectDictTypeList(dictType) {
    return this.dictTypeMapper.selectDictTypeList(dictType)
  }
  /**
   * 根据所有字典类型
   *
   * @return 字典类型集合信息
   */
  async selectDictTypeAll() {
    return this.dictTypeMapper.selectDictTypeAll()
  }
  /**
   * 根据字典类型查询字典数据
   *
   * @param dictType 字典类型
   * @return 字典数据集合信息
   */
  async selectDictDataByType(dictType) {
    let dictDatas = await this.dictUtils.getDictCache(dictType)
    if (this.StringUtils.isNotEmpty(dictDatas)) {
      return dictDatas
    }
    dictDatas = await this.dictDataMapper.selectDictDataByType(dictType)
    if (this.StringUtils.isNotEmpty(dictDatas)) {
      await this.dictUtils.setDictCache(dictType, dictDatas)
      return dictDatas
    }
    return null
  }
  /**
   * 根据字典类型ID查询信息
   *
   * @param dictId 字典类型ID
   * @return 字典类型
   */
  async selectDictTypeById(dictId) {
    return this.dictTypeMapper.selectDictTypeById(dictId)
  }
  /**
   * 根据字典类型查询信息
   *
   * @param dictType 字典类型
   * @return 字典类型
   */
  async selectDictTypeByType(dictType) {
    return this.dictTypeMapper.selectDictTypeByType(dictType)
  }

  /**
   * 批量删除字典类型信息
   *
   * @param dictIds 需要删除的字典ID
   */
  async deleteDictTypeByIds(dictIds) {
    for (const dictId of dictIds) {
      const dictType = await this.selectDictTypeById(dictId)
      if ((await this.dictDataMapper.countDictDataByType(dictType.dictType)) > 0) {
        throw new this.ServiceException(dictType.dictName + '已分配,不能删除')
      }
      this.dictTypeMapper.deleteDictTypeById(dictId)
      this.dictUtils.removeDictCache(dictType.dictType)
    }
  }

  /**
   * 加载字典缓存数据
   */
  async loadingDictCache() {
    const dictData = {}
    dictData.status = '0'
    const dictDataMap = await this.dictDataMapper.selectDictDataList(dictData)
    const entrySet = {}
    dictDataMap.forEach((element) => {
      if (!entrySet[element.dictType]) {
        entrySet[element.dictType] = []
      }
      entrySet[element.dictType].push(element)
    })
    for (const entry in entrySet) {
      await this.dictUtils.setDictCache(entry, entrySet[entry])
    }
  }

  /**
   * 清空字典缓存数据
   */
  async clearDictCache() {
    await this.dictUtils.clearDictCache()
  }

  /**
   * 重置字典缓存数据
   */
  async resetDictCache() {
    await this.clearDictCache()
    await this.loadingDictCache()
  }

  /**
   * 新增保存字典类型信息
   *
   * @param dict 字典类型信息
   * @return 结果
   */
  async insertDictType(dict) {
    const row = 1
    await this.dictTypeMapper.insertDictType(dict)
    await this.dictUtils.setDictCache(dict.dictType, null)
    return row
  }
  /**
   * 修改保存字典类型信息
   *
   * @param dict 字典类型信息
   * @return 结果
   */
  async updateDictType(dict) {
    const oldDict = await this.dictTypeMapper.selectDictTypeById(dict.dictId)
    await this.dictDataMapper.updateDictDataType(oldDict.dictType, dict.dictType)
    const row = 1
    await this.dictTypeMapper.updateDictType(dict)
    const dictDatas = await this.dictDataMapper.selectDictDataByType(dict.dictType)
    await this.dictUtils.setDictCache(dict.dictType, dictDatas)
    return row
  }

  /**
   * 校验字典类型称是否唯一
   *
   * @param dict 字典类型
   * @return 结果
   */
  async checkDictTypeUnique(dict) {
    const dictId = this.StringUtils.isNull(dict.dictId) ? -1 : dict.dictId
    const dictType = await this.dictTypeMapper.checkDictTypeUnique(dict.dictType)
    if (this.StringUtils.isNotNull(dictType) && dictType.dictId != dictId) {
      return this.UserConstants.NOT_UNIQUE
    }
    return this.UserConstants.UNIQUE
  }
}
module.exports = SysDictTypeService
