const UserException = require('./userException.js')
/**
 * 验证码错误异常类
 *
 * @author ruoyi
 */
class CaptchaException extends UserException {
  constructor() {
    // 调用父类构造函数，传入特定的错误代码和空参数列表
    super('user.jcaptcha.error', null)
  }
}
module.exports = CaptchaException
