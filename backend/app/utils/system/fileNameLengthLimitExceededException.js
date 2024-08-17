const FileException = require('./fileException.js')
/**
 * 文件名称超长限制异常类
 *
 * @author ruoyi
 */
class FileNameLengthLimitExceededException extends FileException {
  constructor(defaultFileNameLength) {
    // 调用父类构造函数，传入特定的错误代码和空参数列表
    super('upload.filename.exceed.length', [defaultFileNameLength])
  }
}
module.exports = FileNameLengthLimitExceededException
