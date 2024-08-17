/**
 * 媒体类型工具类
 *
 * @author ruoyi
 */
class MimeTypeUtils {
  static IMAGE_PNG = 'image/png'

  static IMAGE_JPG = 'image/jpg'

  static IMAGE_JPEG = 'image/jpeg'

  static IMAGE_BMP = 'image/bmp'

  static IMAGE_GIF = 'image/gif'

  static IMAGE_EXTENSION = ['bmp', 'gif', 'jpg', 'jpeg', 'png']

  static FLASH_EXTENSION = ['swf', 'flv']

  static MEDIA_EXTENSION = ['swf', 'flv', 'mp3', 'wav', 'wma', 'wmv', 'mid', 'avi', 'mpg', 'asf', 'rm', 'rmvb']

  static VIDEO_EXTENSION = ['mp4', 'avi', 'rmvb']

  static DEFAULT_ALLOWED_EXTENSION = [
    // 图片
    'bmp',
    'gif',
    'jpg',
    'jpeg',
    'png',
    // word excel powerpoint
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'html',
    'htm',
    'txt',
    // 压缩文件
    'rar',
    'zip',
    'gz',
    'bz2',
    // 视频格式
    'mp4',
    'avi',
    'rmvb',
    // pdf
    'pdf'
  ]

  static getExtension(prefix) {
    switch (prefix) {
      case this.IMAGE_PNG:
        return 'png'
      case this.IMAGE_JPG:
        return 'jpg'
      case this.IMAGE_JPEG:
        return 'jpeg'
      case this.IMAGE_BMP:
        return 'bmp'
      case this.IMAGE_GIF:
        return 'gif'
      default:
        return ''
    }
  }
}
module.exports = MimeTypeUtils