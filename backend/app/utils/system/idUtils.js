const { v4: uuidv4 } = require('uuid')
class IdUtils {
  /**
   * 简化的UUID，去掉了横线
   *
   * @return 简化的UUID，去掉了横线
   */
  static simpleUUID() {
    return uuidv4().replace(/[-]/g, '')
  }
  /**
   * 获取随机UUID，使用性能更好的ThreadLocalRandom生成UUID
   *
   * @return 随机UUID
   */
  static fastUUID() {
    return uuidv4()
  }
}
module.exports = IdUtils
