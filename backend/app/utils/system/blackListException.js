const UserException = require('./userException.js')
/**
 * 黑名单IP异常类
 *
 * @author ruoyi
 */
class BlackListException extends UserException {
  constructor() {
    // 调用父类构造函数，传入特定的错误代码和空参数列表
    super('login.blocked', null)
  }
}
module.exports = BlackListException
