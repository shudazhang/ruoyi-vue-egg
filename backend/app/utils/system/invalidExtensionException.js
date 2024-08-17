const FileUploadException = require('./fileUploadException.js')
/**
 * 文件上传 误异常类
 *
 * @author ruoyi
 */
class InvalidExtensionException extends FileUploadException {
  constructor(allowedExtension, extension, filename) {
    super('文件[' + filename + ']后缀[' + extension + ']不正确，请上传' + allowedExtension.join(',') + '格式')
    this.allowedExtension = allowedExtension
    this.extension = extension
    this.filename = filename
  }

  getAllowedExtension() {
    return this.allowedExtension
  }

  getExtension() {
    return this.extension
  }

  getFilename() {
    return this.filename
  }
}

class InvalidImageExtensionException extends InvalidExtensionException {
  constructor(allowedExtension, extension, filename) {
    super(allowedExtension, extension, filename)
  }
}

class InvalidFlashExtensionException extends InvalidExtensionException {
  constructor(allowedExtension, extension, filename) {
    super(allowedExtension, extension, filename)
  }
}

class InvalidMediaExtensionException extends InvalidExtensionException {
  constructor(allowedExtension, extension, filename) {
    super(allowedExtension, extension, filename)
  }
}

class InvalidVideoExtensionException extends InvalidExtensionException {
  constructor(allowedExtension, extension, filename) {
    super(allowedExtension, extension, filename)
  }
}

module.exports = {
  InvalidExtensionException,
  InvalidImageExtensionException,
  InvalidFlashExtensionException,
  InvalidMediaExtensionException,
  InvalidVideoExtensionException
}
