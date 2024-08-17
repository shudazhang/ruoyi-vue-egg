const { Service } = require('egg')

class SysDictDataMapper extends Service {
  /**
   * 根据条件分页查询字典数据
   *
   * @param dictData 字典数据信息
   * @return 字典数据集合信息
   */
  async selectDictDataList(dictData) {
    const params = {
      where: {},
      order: [['dictSort', 'ASC']]
    }
    if (dictData.pageNum && dictData.pageSize) {
      params.offset = parseInt(((dictData.pageNum || 1) - 1) * (dictData.pageSize || 10))
      params.limit = parseInt(dictData.pageSize || 10)
    }
    if (dictData.dictType) {
      params.where.dictType = dictData.dictType
    }
    if (dictData.dictLabel) {
      params.where.dictLabel = {
        [this.app.Sequelize.Op.like]: `%${dictData.dictLabel}%`
      }
    }
    if (!['undefined', 'null', ''].includes('' + dictData.status)) {
      params.where.status = dictData.status
    }
    if (dictData.pageNum && dictData.pageSize) {
      return this.app.model.System.SysDictData.findAndCountAll(params)
    } else {
      return this.app.model.System.SysDictData.findAll(params)
    }
  }
  /**
   * 根据字典类型查询字典数据
   *
   * @param dictType 字典类型
   * @return 字典数据集合信息
   */
  selectDictDataByType(dictType) {
    return this.app.model.System.SysDictData.findAll({
      where: {
        dictType: dictType,
        status: '0'
      },
      order: [['dictSort', 'ASC']]
    })
  }
  /**
   * 根据字典类型和字典键值查询字典数据信息
   *
   * @param dictType 字典类型
   * @param dictValue 字典键值
   * @return 字典标签
   */
  async selectDictLabel(dictType, dictValue) {
    const dictData = await this.app.model.System.SysDictData.findOne({
      where: {
        dictType: dictType,
        dictValue: dictValue
      }
    })
    return dictData.dictLabel
  }
  /**
   * 根据字典数据ID查询信息
   *
   * @param dictCode 字典数据ID
   * @return 字典数据
   */
  selectDictDataById(dictCode) {
    return this.app.model.System.SysDictData.findOne({
      where: {
        dictCode: dictCode
      }
    })
  }
  /**
   * 查询字典数据
   *
   * @param dictType 字典类型
   * @return 字典数据
   */
  countDictDataByType(dictType) {
    return this.app.model.System.SysDictData.count({
      where: {
        dictType: dictType
      }
    })
  }
  /**
   * 通过字典ID删除字典数据信息
   *
   * @param dictCode 字典数据ID
   * @return 结果
   */
  deleteDictDataById(dictCode) {
    return this.app.model.System.SysDictData.destroy({
      where: {
        dictCode: dictCode
      }
    })
  }
  /**
   * 批量删除字典数据信息
   *
   * @param dictCodes 需要删除的字典数据ID
   * @return 结果
   */
  deleteDictDataByIds(dictCodes) {
    return this.app.model.System.SysDictData.destroy({
      where: {
        dictCode: dictCodes
      }
    })
  }
  /**
   * 新增字典数据信息
   *
   * @param dictData 字典数据信息
   * @return 结果
   */
  insertDictData(dictData) {
    return this.app.model.System.SysDictData.create({ ...dictData, createTime: new Date() })
  }
  /**
   * 修改字典数据信息
   *
   * @param dictData 字典数据信息
   * @return 结果
   */
  updateDictData(dictData) {
    return this.app.model.System.SysDictData.update({ ...dictData, updateTime: new Date() }, { where: { dictCode: dictData.dictCode } })
  }
  /**
   * 同步修改字典类型
   *
   * @param oldDictType 旧字典类型
   * @param newDictType 新旧字典类型
   * @return 结果
   */
  updateDictDataType(oldDictType, newDictType) {
    return this.app.model.System.SysDictData.update({ dictType: newDictType }, { where: { dictType: oldDictType } })
  }
}
module.exports = SysDictDataMapper
