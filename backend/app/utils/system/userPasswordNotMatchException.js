const UserException = require('./userException.js')

/**
 * 用户密码不正确或不符合规范异常类
 *
 * @author ruoyi
 */
class UserPasswordNotMatchException extends UserException {
  constructor() {
    // 调用父类构造函数，传入特定的错误代码和空参数列表
    super('user.password.not.match', null)
  }
}
module.exports = UserPasswordNotMatchException
