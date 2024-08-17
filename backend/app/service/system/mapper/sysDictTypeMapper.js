const { Service } = require('egg')

class SysDictTypeMapper extends Service {
  /**
   * 根据条件分页查询字典类型
   *
   * @param dictType 字典类型信息
   * @return 字典类型集合信息
   */
  async selectDictTypeList(dictType) {
    const params = {
      where: {}
    }
    if (dictType.pageNum && dictType.pageSize) {
      params.offset = parseInt(((dictType.pageNum || 1) - 1) * (dictType.pageSize || 10))
      params.limit = parseInt(dictType.pageSize || 10)
    }
    if (dictType.dictName) {
      params.where.dictName = {
        [this.app.Sequelize.Op.like]: `%${dictType.dictName}%`
      }
    }
    if (!['undefined', 'null', ''].includes('' + dictType.status)) {
      params.where.status = dictType.status
    }
    if (dictType.dictType) {
      params.where.dictType = {
        [this.app.Sequelize.Op.like]: `%${dictType.dictType}%`
      }
    }
    if (dictType['params[beginTime]'] && dictType['params[endTime]']) {
      params.where.createTime = {
        [this.app.Sequelize.Op.between]: [new Date(dictType['params[beginTime]'] + ' 00:00:00').toISOString().slice(0, 10), new Date(dictType['params[endTime]'] + ' 23:59:59').toISOString().slice(0, 10)]
      }
    }
    if (dictType.params && dictType.params.beginTime && dictType.params.endTime) {
      params.where.createTime = {
        [this.app.Sequelize.Op.between]: [new Date(dictType.params.beginTime + ' 00:00:00').toISOString().slice(0, 10), new Date(dictType.params.endTime + ' 23:59:59').toISOString().slice(0, 10)]
      }
    }
    if (dictType.pageNum && dictType.pageSize) {
      return this.app.model.System.SysDictType.findAndCountAll(params)
    } else {
      return this.app.model.System.SysDictType.findAll(params)
    }
  }
  /**
   * 根据所有字典类型
   *
   * @return 字典类型集合信息
   */
  async selectDictTypeAll() {
    return this.app.model.System.SysDictType.findAll()
  }
  /**
   * 根据字典类型ID查询信息
   *
   * @param dictId 字典类型ID
   * @return 字典类型
   */
  async selectDictTypeById(dictId) {
    return this.app.model.System.SysDictType.findOne({
      where: {
        dictId: dictId
      }
    })
  }
  /**
   * 根据字典类型查询信息
   *
   * @param dictType 字典类型
   * @return 字典类型
   */
  selectDictTypeByType(dictType) {
    return this.app.model.System.SysDictType.findOne({
      where: {
        dictType: dictType
      }
    })
  }
  /**
   * 通过字典ID删除字典信息
   *
   * @param dictId 字典ID
   * @return 结果
   */
  deleteDictTypeById(dictId) {
    return this.app.model.System.SysDictType.destroy({
      where: {
        dictId: dictId
      }
    })
  }
  /**
   * 批量删除字典类型信息
   *
   * @param dictIds 需要删除的字典ID
   * @return 结果
   */
  deleteDictTypeByIds(dictIds) {
    return this.app.model.System.SysDictType.destroy({
      where: {
        dictId: dictIds
      }
    })
  }
  /**
   * 新增字典类型信息
   *
   * @param dictType 字典类型信息
   * @return 结果
   */
  insertDictType(dictType) {
    return this.app.model.System.SysDictType.create({ ...dictType, createTime: new Date() })
  }
  /**
   * 修改字典类型信息
   *
   * @param dictType 字典类型信息
   * @return 结果
   */
  updateDictType(dictType) {
    return this.app.model.System.SysDictType.update(
      { ...dictType, updateTime: new Date() },
      {
        where: {
          dictId: dictType.dictId
        }
      }
    )
  }
  /**
   * 校验字典类型称是否唯一
   *
   * @param dictType 字典类型
   * @return 结果
   */
  checkDictTypeUnique(dictType) {
    return this.app.model.System.SysDictType.findOne({
      where: {
        dictType: dictType
      }
    })
  }
}
module.exports = SysDictTypeMapper
