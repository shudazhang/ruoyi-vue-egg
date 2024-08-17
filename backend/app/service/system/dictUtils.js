const BaseService = require('./baseService.js')
class DictUtils extends BaseService {
  constructor(ctx) {
    super(ctx)
  }
  SEPARATOR = ','
  /**
   * 设置字典缓存
   *
   * @param key 参数键
   * @param dictDatas 字典数据列表
   */
  async setDictCache(key, dictDatas) {
    await this.redisCache.setCacheObject(this.getCacheKey(key), JSON.stringify(dictDatas))
  }
  /**
   * 获取字典缓存
   *
   * @param key 参数键
   * @return dictDatas 字典数据列表
   */
  async getDictCache(key) {
    const arrayCache = await this.redisCache.getCacheObject(this.getCacheKey(key))
    if (this.StringUtils.isNotNull(arrayCache)) {
      return JSON.parse(arrayCache)
    }
    return null
  }
  /**
   * 根据字典类型和字典值获取字典标签
   *
   * @param dictType 字典类型
   * @param dictValue 字典值
   * @return 字典标签
   */
  getDictLabel(dictType, dictValue) {
    if (this.StringUtils.isEmpty(dictValue)) {
      return ''
    }
    return this.getDictLabelWithSeparator(dictType, dictValue, this.SEPARATOR)
  }
  /**
   * 根据字典类型和字典标签获取字典值
   *
   * @param dictType 字典类型
   * @param dictLabel 字典标签
   * @return 字典值
   */
  getDictValue(dictType, dictLabel) {
    if (this.StringUtils.isEmpty(dictLabel)) {
      return ''
    }
    return this.getDictValueWithSeparator(dictType, dictLabel, this.SEPARATOR)
  }
  // 根据字典类型和字典值获取字典标签
  getDictLabelWithSeparator(dictType, dictValue, separator) {
    let propertyString = ''
    const datas = this.getDictCache(dictType)
    if (this.StringUtils.isNull(datas)) {
      return ''
    }
    if (this.StringUtils.containsAny(separator, dictValue)) {
      for (const dict of datas) {
        for (const value of dictValue.split(separator)) {
          if (value === dict.dictValue) {
            propertyString += dict.dictLabel + separator
            break
          }
        }
      }
    } else {
      for (const dict of datas) {
        if (dictValue === dict.dictValue) {
          return dict.dictLabel
        }
      }
    }
    return propertyString.replace(new RegExp(`${separator}+$`, 'g'), '')
  }
  // 根据字典类型和字典标签获取字典值
  getDictValueWithSeparator(dictType, dictLabel, separator) {
    let propertyString = ''
    const datas = this.getDictCache(dictType)
    if (this.StringUtils.isNull(datas)) {
      return ''
    }
    if (this.StringUtils.containsAny(separator, dictLabel)) {
      for (const dict of datas) {
        for (const label of dictLabel.split(separator)) {
          if (label === dict.dictLabel) {
            propertyString += dict.dictValue + separator
            break
          }
        }
      }
    } else {
      for (const dict of datas) {
        if (dictLabel === dict.dictLabel) {
          return dict.dictValue
        }
      }
    }
    return propertyString.replace(new RegExp(`${separator}+$`, 'g'), '')
  }

  // 根据字典类型获取字典所有值
  async getDictValues(dictType) {
    let propertyString = ''
    const datas = await this.getDictCache(dictType)
    if (!datas) {
      return ''
    }
    for (const dict of datas) {
      propertyString += dict.dictValue + this.SEPARATOR
    }
    return propertyString.replace(new RegExp(`${this.SEPARATOR}+$`, 'g'), '')
  }

  // 根据字典类型获取字典所有标签
  async getDictLabels(dictType) {
    let propertyString = ''
    const datas = await this.getDictCache(dictType)
    if (!datas) {
      return ''
    }
    for (const dict of datas) {
      propertyString += dict.dictLabel + this.SEPARATOR
    }
    return propertyString.replace(new RegExp(`${this.SEPARATOR}+$`, 'g'), '')
  }
  // 删除指定字典缓存
  async removeDictCache(key) {
    try {
      await this.redisCache.deleteObject(this.getCacheKey(key))
    } catch (error) {
      console.error('Error removing cache:', error)
    }
  }
  // 清空字典缓存
  async clearDictCache() {
    try {
      const keys = await this.redisCache.keys(this.CacheConstants.SYS_DICT_KEY + '*')
      if (keys.length > 0) {
        await this.redisCache.deleteObjects(keys)
      }
    } catch (error) {
      console.error('Error clearing cache:', error)
    }
  }
  /**
   * 设置cache key
   *
   * @param configKey 参数键
   * @return 缓存键key
   */
  getCacheKey(configKey) {
    return this.CacheConstants.SYS_DICT_KEY + configKey
  }
}
module.exports = DictUtils
