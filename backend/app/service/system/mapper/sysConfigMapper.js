const { Service } = require('egg')

class SysConfigMapper extends Service {
  /**
   * 查询参数配置信息
   *
   * @param config 参数配置信息
   * @return 参数配置信息
   */
  async selectConfig(config) {
    const params = {
      where: {}
    }
    if (config.configId) {
      params.where.configId = config.configId
    }
    if (config.configKey) {
      params.where.configKey = config.configKey
    }
    return this.app.model.System.SysConfig.findOne(params)
  }
  /**
   * 通过ID查询配置
   *
   * @param configId 参数ID
   * @return 参数配置信息
   */
  selectConfigById(configId) {
    return this.app.model.System.SysConfig.findOne({
      where: {
        configId
      }
    })
  }
  /**
   * 查询参数配置列表
   *
   * @param config 参数配置信息
   * @return 参数配置集合
   */
  async selectConfigList(config) {
    const params = {
      where: {}
    }

    if (config.pageNum && config.pageSize) {
      params.offset = parseInt(((config.pageNum || 1) - 1) * (config.pageSize || 10))
      params.limit = parseInt(config.pageSize || 10)
    }
    if (config.configName) {
      params.where.configName = {
        [this.app.Sequelize.Op.like]: `%${config.configName}%`
      }
    }
    if (config.configType) {
      params.where.configType = config.configType
    }
    if (config.configKey) {
      params.where.configKey = {
        [this.app.Sequelize.Op.like]: `%${config.configKey}%`
      }
    }
    if (config['params[beginTime]'] && config['params[endTime]']) {
      params.where.createTime = {
        [this.app.Sequelize.Op.between]: [new Date(config['params[beginTime]'] + ' 00:00:00').toISOString().slice(0, 10), new Date(config['params[endTime]'] + ' 23:59:59').toISOString().slice(0, 10)]
      }
    }
    if (config.params && config.params.beginTime && config.params.endTime) {
      params.where.createTime = {
        [this.app.Sequelize.Op.between]: [new Date(config.params.beginTime + ' 00:00:00').toISOString().slice(0, 10), new Date(config.params.endTime + ' 23:59:59').toISOString().slice(0, 10)]
      }
    }
    if (config.pageNum && config.pageSize) {
      return this.app.model.System.SysConfig.findAndCountAll(params)
    } else {
      return this.app.model.System.SysConfig.findAll(params)
    }
  }
  /**
   * 根据键名查询参数配置信息
   *
   * @param configKey 参数键名
   * @return 参数配置信息
   */
  checkConfigKeyUnique(configKey) {
    return this.app.model.System.SysConfig.findOne({
      where: {
        configKey
      }
    })
  }
  /**
   * 新增参数配置
   *
   * @param config 参数配置信息
   * @return 结果
   */
  insertConfig(config) {
    return this.app.model.System.SysConfig.create({ ...config, createTime: new Date() })
  }

  /**
   * 修改参数配置
   *
   * @param config 参数配置信息
   * @return 结果
   */
  updateConfig(config) {
    return this.app.model.System.SysConfig.update({ ...config, updateTime: new Date() }, { where: { configId: config.configId } })
  }
  /**
   * 删除参数配置
   *
   * @param configId 参数ID
   * @return 结果
   */
  deleteConfigById(configId) {
    return this.app.model.System.SysConfig.destroy({ where: { configId } })
  }
  /**
   * 批量删除参数信息
   *
   * @param configIds 需要删除的参数ID
   * @return 结果
   */
  deleteConfigByIds(configIds) {
    return this.app.model.System.SysConfig.destroy({ where: { configId: configIds } })
  }
}
module.exports = SysConfigMapper
