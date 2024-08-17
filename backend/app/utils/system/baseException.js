const MessageUtils = require('./messageUtils.js')
/**
 * 基础异常
 *
 * @author ruoyi
 */
class BaseException extends Error {
  constructor(name, code, args, defaultMessage) {
    super() // 调用父类构造函数
    /**
     * 所属模块
     */
    this.name = name

    /**
     * 错误码
     */
    this.code = code
    /**
     * 错误码对应的参数
     */
    this.args = args
    /**
     * 错误消息
     */
    this.defaultMessage = defaultMessage
  }
  get message() {
    let message = null
    if (this.code && this.code.trim() !== '') {
      message = MessageUtils.message(this.code, this.args)
    }
    if (!message) {
      message = this.defaultMessage
    }
    return message.replace(/{(\d+)}/g, (match, p1) => {
      return typeof this.args[p1] !== 'undefined' ? this.args[p1] : match
    })
  }
}
module.exports = BaseException
