const FileException = require('./fileException.js')
/**
 * 文件名大小限制异常类
 *
 * @author ruoyi
 */
class FileSizeLimitExceededException extends FileException {
  constructor(defaultMaxSize) {
    super('upload.exceed.maxSize', [defaultMaxSize])
  }
}
module.exports = FileSizeLimitExceededException
