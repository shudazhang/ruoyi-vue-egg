const UserException = require('./userException.js')
/**
 * 用户不存在异常类
 * 
 * @author ruoyi
 */
class UserNotExistsException extends UserException {
  constructor() {
    // 调用父类构造函数，传入特定的错误代码和空参数列表
    super('user.not.exists', null)
  }
}
module.exports = UserNotExistsException
