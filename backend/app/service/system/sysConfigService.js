const BaseService = require('./baseService.js')
class SysConfigService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.configMapper = this.ctx.service.system.mapper.sysConfigMapper
  }
  /**
   * 项目启动时，初始化参数到缓存
   */
  async init() {
    await this.loadingConfigCache()
  }
  /**
   * 查询参数配置信息
   *
   * @param configId 参数配置ID
   * @return 参数配置信息
   */
  selectConfigById(configId) {
    const config = {}
    config.configId = configId
    return this.configMapper.selectConfig(config)
  }
  /**
   * 根据键名查询参数配置信息
   *
   * @param configKey 参数key
   * @return 参数键值
   */
  async selectConfigByKey(configKey) {
    let configValue = this.Convert.toStr(await this.redisCache.getCacheObject(this.getCacheKey(configKey)))
    if (this.StringUtils.isNotEmpty(configValue)) {
      return configValue
    }

    const config = {}
    config.configKey = configKey
    const retConfig = await this.configMapper.selectConfig(config)
    if (this.StringUtils.isNotNull(retConfig)) {
      await this.redisCache.setCacheObject(this.getCacheKey(configKey), retConfig.configValue)
      return retConfig.configValue
    }
    return this.StringUtils.EMPTY
  }
  /**
   * 获取验证码开关
   *
   * @return true开启，false关闭
   */
  async selectCaptchaEnabled() {
    let captchaEnabled = await this.selectConfigByKey('sys.account.captchaEnabled')
    if (this.StringUtils.isEmpty(captchaEnabled)) {
      return true
    }
    return this.Convert.toBool(captchaEnabled)
  }
  /**
   * 查询参数配置列表
   *
   * @param config 参数配置信息
   * @return 参数配置集合
   */
  selectConfigList(config) {
    return this.configMapper.selectConfigList(config)
  }
  /**
   * 新增参数配置
   *
   * @param config 参数配置信息
   * @return 结果
   */
  async insertConfig(config) {
    const row = 1
    await this.configMapper.insertConfig(config)
    await this.redisCache.setCacheObject(this.getCacheKey(config.configKey), config.configValue)
    return row
  }
  /**
   * 修改参数配置
   *
   * @param config 参数配置信息
   * @return 结果
   */
  async updateConfig(config) {
    const temp = await this.configMapper.selectConfigById(config.configId)
    if (!this.StringUtils.equals(temp.configKey, config.configKey)) {
      await this.redisCache.deleteObject(this.getCacheKey(temp.configKey))
    }
    const row = 1
    await this.configMapper.updateConfig(config)
    await this.redisCache.setCacheObject(this.getCacheKey(config.configKey), config.configValue)
    return row
  }
  /**
   * 批量删除参数信息
   *
   * @param configIds 需要删除的参数ID
   */
  async deleteConfigByIds(configIds) {
    for (const configId of configIds) {
      const config = await this.selectConfigById(configId)
      if (this.StringUtils.equals(this.UserConstants.YES, config.configType)) {
        throw new this.ServiceException(`内置参数【${config.configKey}】不能删除`)
      }
      await this.configMapper.deleteConfigById(configId)
      await this.redisCache.deleteObject(this.getCacheKey(config.configKey))
    }
  }
  /**
   * 加载参数缓存数据
   */
  async loadingConfigCache() {
    const configList = await this.configMapper.selectConfigList({})
    for (const config of configList) {
      await this.redisCache.setCacheObject(this.getCacheKey(config.configKey), config.configValue)
    }
  }
  /**
   * 清空参数缓存数据
   */
  async clearConfigCache() {
    const keys = await this.redisCache.keys(this.CacheConstants.SYS_CONFIG_KEY + '*')
    await this.redisCache.deleteObjects(keys)
  }
  /**
   * 重置参数缓存数据
   */
  async resetConfigCache() {
    await this.clearConfigCache()
    await this.loadingConfigCache()
  }
  /**
   * 校验参数键名是否唯一
   *
   * @param config 参数配置信息
   * @return 结果
   */
  async checkConfigKeyUnique(config) {
    const configId = this.StringUtils.isNull(config.configId) ? -1 : config.configId
    const info = await this.configMapper.checkConfigKeyUnique(config.configKey)
    if (this.StringUtils.isNotNull(info) && info.configId != configId) {
      return this.UserConstants.NOT_UNIQUE
    }
    return this.UserConstants.UNIQUE
  }

  /**
   * 设置cache key
   *
   * @param configKey 参数键
   * @return 缓存键key
   */
  getCacheKey(configKey) {
    return this.CacheConstants.SYS_CONFIG_KEY + configKey
  }
}
module.exports = SysConfigService
