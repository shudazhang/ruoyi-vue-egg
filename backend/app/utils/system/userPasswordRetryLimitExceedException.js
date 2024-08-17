const UserException = require('./userException.js')
/**
 * 用户错误最大次数异常类
 * 
 * @author ruoyi
 */
class UserPasswordRetryLimitExceedException extends UserException {
  constructor(retryLimitCount, lockTime) {
    // 调用父类构造函数，传入特定的错误代码和空参数列表
    super('user.password.retry.limit.exceed', [retryLimitCount, lockTime])
  }
}
module.exports = UserPasswordRetryLimitExceedException
