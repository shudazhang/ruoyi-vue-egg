class RedisCache {
  constructor(redis) {
    this.redis = redis
  }
  /**
   * 缓存基本的对象，Integer、String、实体类等
   *
   * @param key 缓存的键值
   * @param value 缓存的值
   */
  async setCacheObject(key, value) {
    this.redis.set(key, value)
  }
  /**
   * 缓存基本的对象，Integer、String、实体类等
   *
   * @param key 缓存的键值
   * @param value 缓存的值
   * @param timeout 时间
   * @param timeUnit 时间颗粒度
   */
  async setCacheObjectWithTimeout(key, value, timeout) {
    this.redis.set(key, value, 'EX', timeout)
  }
  /**
   * 判断 key是否存在
   *
   * @param key 键
   * @return true 存在 false不存在
   */
  async hasKey(key) {
    return (await this.redis.exists(key)) === 1
  }
  /**
   * 获得缓存的基本对象。
   *
   * @param key 缓存键值
   * @return 缓存键值对应的数据
   */
  async getCacheObject(key) {
    return this.redis.get(key)
  }
  /**
   * 删除单个对象
   *
   * @param key
   */
  async deleteObject(key) {
    return this.redis.del(key)
  }
  /**
   * 删除集合对象
   *
   * @param collection 多个对象
   * @return
   */
  async deleteObjects(keys) {
    return this.redis.del(...keys)
  }
  /**
   * 获得缓存的基本对象列表
   *
   * @param pattern 字符串前缀
   * @return 对象列表
   */
  async keys(pattern) {
    return this.redis.keys(pattern)
  }
}
module.exports = RedisCache
