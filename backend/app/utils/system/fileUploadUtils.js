const FileNameLengthLimitExceededException = require('./fileNameLengthLimitExceededException.js')
const FileSizeLimitExceededException = require('./fileSizeLimitExceededException.js')
const MimeTypeUtils = require('./mimeTypeUtils.js')
const InvalidExtensionException = require('./invalidExtensionException.js')
const moment = require('moment')
const fs = require('fs')
const path = require('path')
const Seq = require('./seq.js')
const Constants = require('./constants.js')

class FileUploadUtils {
  constructor(ruoYiConfig) {
    this.RuoYiConfig = ruoYiConfig
    /**
     * 默认大小 50M
     */
    this.DEFAULT_MAX_SIZE = 50 * 1024 * 1024
    /**
     * 默认的文件名最大长度 100
     */
    this.DEFAULT_FILE_NAME_LENGTH = 100
    /**
     * 默认上传的地址
     */
    this.defaultBaseDir = this.RuoYiConfig.profile
  }

  /**
   * 文件上传
   *
   * @param baseDir 相对应用的基目录
   * @param file 上传的文件
   * @param allowedExtension 上传文件类型
   * @return 返回上传成功的文件名
   * @throws FileSizeLimitExceededException 如果超出最大大小
   * @throws FileNameLengthLimitExceededException 文件名太长
   * @throws IOException 比如读写文件出错时
   * @throws InvalidExtensionException 文件校验异常
   */
  async upload(baseDir, file, allowedExtension) {
    if (!baseDir) {
      baseDir = this.defaultBaseDir
    }
    if (!allowedExtension) {
      allowedExtension = MimeTypeUtils.DEFAULT_ALLOWED_EXTENSION
    }
    const fileNamelength = file.filename.length
    if (fileNamelength > this.DEFAULT_FILE_NAME_LENGTH) {
      throw new FileNameLengthLimitExceededException(this.DEFAULT_FILE_NAME_LENGTH)
    }
    this.assertAllowed(file, allowedExtension)
    const fileName = this.extractFilename(file)
    const absPath = this.getAbsoluteFile(baseDir, fileName)
    fs.copyFileSync(file.filepath, absPath)
    fs.unlinkSync(file.filepath)
    return this.getPathFileName(baseDir, fileName)
  }
  /**
   * 文件大小校验
   *
   * @param file 上传的文件
   * @return
   * @throws FileSizeLimitExceededException 如果超出最大大小
   * @throws InvalidExtensionException
   */
  assertAllowed(file, allowedExtension) {
    const size = fs.statSync(file.filepath).size
    if (size > this.DEFAULT_MAX_SIZE) {
      throw new FileSizeLimitExceededException(this.DEFAULT_MAX_SIZE / 1024 / 1024)
    }
    const fileName = file.filename
    const extension = this.getExtension(file)
    if (allowedExtension != null && !this.isAllowedExtension(extension, allowedExtension)) {
      if (allowedExtension.join(',') == MimeTypeUtils.IMAGE_EXTENSION.join(',')) {
        throw new InvalidExtensionException.InvalidImageExtensionException(allowedExtension, extension, fileName)
      } else if (allowedExtension.join(',') == MimeTypeUtils.FLASH_EXTENSION.join(',')) {
        throw new InvalidExtensionException.InvalidFlashExtensionException(allowedExtension, extension, fileName)
      } else if (allowedExtension.join(',') == MimeTypeUtils.MEDIA_EXTENSION.join(',')) {
        throw new InvalidExtensionException.InvalidMediaExtensionException(allowedExtension, extension, fileName)
      } else if (allowedExtension.join(',') == MimeTypeUtils.VIDEO_EXTENSION.join(',')) {
        throw new InvalidExtensionException.InvalidVideoExtensionException(allowedExtension, extension, fileName)
      } else {
        throw new InvalidExtensionException.InvalidExtensionException(allowedExtension, extension, fileName)
      }
    }
  }
  /**
   * 判断MIME类型是否是允许的MIME类型
   *
   * @param extension
   * @param allowedExtension
   * @return
   */
  isAllowedExtension(extension, allowedExtension) {
    for (const str of allowedExtension) {
      if (('' + str).toLowerCase() == ('' + extension).toLowerCase()) {
        return true
      }
    }
    return false
  }
  /**
   * 编码文件名
   */
  extractFilename(file) {
    return `${moment().format('YYYY/MM/DD')}/${path.parse(file.filename).name}_${Seq.getId1(Seq.uploadSeqType)}.${this.getExtension(file)}`
  }
  getAbsoluteFile(uploadDir, fileName) {
    const filePath = path.join(uploadDir, fileName)
    const parentDir = path.dirname(filePath)
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true })
    }
    return filePath
  }
  getPathFileName(uploadDir, fileName) {
    const dirLastIndex = this.RuoYiConfig.profile.length + 1
    const currentDir = uploadDir.substring(dirLastIndex)
    return Constants.RESOURCE_PREFIX + '/' + currentDir + '/' + fileName
  }
  getExtension(file) {
    return path.parse(file.filename).ext.slice(1) || file.mime.split('/')[1]
  }
}
module.exports = FileUploadUtils
