const MimeTypeUtils = require('./mimeTypeUtils.js')
const FileTypeUtils = require('./fileTypeUtils.js')
class FileUtils {
  /**
   * 获取文件名称 /profile/upload/2022/04/16/ruoyi.png -- ruoyi.png
   *
   * @param fileName 路径名称
   * @return 没有文件路径的名称
   */
  static getName(fileName) {
    if (fileName == null) {
      return null
    }
    const lastUnixPos = fileName.lastIndexOf('/')
    const lastWindowsPos = fileName.lastIndexOf('\\')
    const index = Math.max(lastUnixPos, lastWindowsPos)
    return fileName.substring(index + 1)
  }
  /**
   * 检查文件是否可下载
   *
   * @param resource 需要下载的文件
   * @return true 正常 false 非法
   */
  static checkAllowDownload(resource) {
    // 禁止目录上跳级别
    if (resource.includes('..')) {
      return false
    }

    // 检查允许下载的文件规则
    if (MimeTypeUtils.DEFAULT_ALLOWED_EXTENSION.includes(FileTypeUtils.getFileType(resource))) {
      return true
    }

    // 不在允许下载的文件规则
    return false
  }
}

module.exports = FileUtils
