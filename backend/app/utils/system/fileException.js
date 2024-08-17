const BaseException = require('./baseException.js')
/**
 * 文件信息异常类
 * 
 * @author ruoyi
 */
class FileException extends BaseException {
  constructor(code, args) {
    // 调用基类构造函数，传递模块名称 "user"，错误代码，参数数组和默认消息（null）
    super('file', code, args)
  }
}
module.exports = FileException
