const BaseController = require('./baseController.js')
/**
 * 缓存监控
 *
 * @author ruoyi
 */
class CacheController extends BaseController {
  constructor(ctx) {
    super(ctx)
  }
  async getInfo() {
    try {
      function parseLine(info) {
        let result = {}
        info.split('\n').map((line) => {
          const [name, value] = line.split(':')
          if (name) {
            result[name] = value
          }
        })
        return result
      }
      let info = await this.app.redis.send_command('info')
      info = parseLine(info)
      let commandStats = await this.app.redis.send_command('info', ['commandstats'])
      const pieList = []
      commandStats.split('\n').forEach((element) => {
        const key = element.split(':')[0]
        const property = element.split(':')[1]
        if (key && property) {
          const data = {}
          data.name = key.replace('cmdstat_', '')
          data.value = property.slice(property.indexOf('calls=') + 6, property.indexOf(',usec=')).replace(',', '')
          pieList.push(data)
        }
      })
      const dbSize = await this.app.redis.send_command('dbSize')
      const result = {}
      result.info = info
      result.dbSize = dbSize
      result.commandStats = pieList
      this.ctx.body = this.success(result)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async cache() {
    try {
      this.ctx.body = this.success([
        { cacheName: this.CacheConstants.LOGIN_TOKEN_KEY, remark: '用户信息', cacheKey: '', cacheValue: '' },
        { cacheName: this.CacheConstants.SYS_CONFIG_KEY, remark: '配置信息', cacheKey: '', cacheValue: '' },
        { cacheName: this.CacheConstants.SYS_DICT_KEY, remark: '数据字典', cacheKey: '', cacheValue: '' },
        { cacheName: this.CacheConstants.CAPTCHA_CODE_KEY, remark: '验证码', cacheKey: '', cacheValue: '' },
        { cacheName: this.CacheConstants.REPEAT_SUBMIT_KEY, remark: '防重提交', cacheKey: '', cacheValue: '' },
        { cacheName: this.CacheConstants.RATE_LIMIT_KEY, remark: '限流处理', cacheKey: '', cacheValue: '' },
        { cacheName: this.CacheConstants.PWD_ERR_CNT_KEY, remark: '密码错误次数', cacheKey: '', cacheValue: '' }
      ])
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async getCacheKeys() {
    try {
      const cacheName = this.ctx.params.cacheName
      const cacheKeys = await this.redisCache.keys(cacheName + '*')
      this.ctx.body = this.success(cacheKeys)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async getCacheValue() {
    try {
      const cacheName = this.ctx.params.cacheName
      const cacheKey = this.ctx.params.cacheKey
      const cacheValue = await this.redisCache.getCacheObject(cacheKey)
      const sysCache = { cacheName: cacheName, remark: '', cacheKey: cacheKey, cacheValue: cacheValue }
      this.ctx.body = this.success(sysCache)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async clearCacheName() {
    try {
      const cacheName = this.ctx.params.cacheName
      const cacheKeys = await this.redisCache.keys(cacheName + '*')
      if (cacheKeys.length > 0) {
        await this.redisCache.deleteObjects(cacheKeys)
      }
      this.ctx.body = this.success()
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async clearCacheKey() {
    try {
      const cacheKey = this.ctx.params.cacheKey
      await this.redisCache.deleteObject(cacheKey)
      this.ctx.body = this.success()
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async clearCacheAll() {
    try {
      const cacheKeys = await this.redisCache.keys('*')
      if (cacheKeys.length > 0) {
        await this.redisCache.deleteObjects(cacheKeys)
      }
      this.ctx.body = this.success()
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}
module.exports = CacheController
