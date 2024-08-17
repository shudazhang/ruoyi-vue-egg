/**
 * 业务异常
 *
 * @author ruoyi
 */
class ServiceException extends Error {
  constructor(message, code) {
    super(message) // 调用父类构造函数
    this.message = message
    this.code = code
  }
}
module.exports = ServiceException
