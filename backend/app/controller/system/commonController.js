const BaseController = require('./baseController.js')
const fs = require('fs')
/**
 * 通用请求处理
 *
 * @author ruoyi
 */
class CommonController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.RuoYiConfig = this.app.config.ruoYiConfig
    this.FILE_DELIMETER = ','
  }
  /**
   * 通用下载请求
   *
   * @param fileName 文件名称
   * @param delete 是否删除
   */
  async fileDownload() {
    try {
      const fileName = this.ctx.query.fileName
      const isDelete = this.ctx.query.delete

      if (!this.FileUtils.checkAllowDownload(fileName)) {
        throw new Error(`文件名称(${fileName})非法，不允许下载。 `)
      }
      const realFileName = Date.now() + fileName.substring(fileName.indexOf('_') + 1)
      const filePath = this.RuoYiConfig.downloadPath + fileName

      this.ctx.set('Content-Type', '"application/octet-stream')
      this.ctx.set('Content-Disposition', `attachment; filename=${encodeURIComponent(realFileName)}`)

      // 将Excel文件流输出到HTTP响应
      // 使用 writeBuffer 方法并等待Promise完成
      this.ctx.status = 200
      this.ctx.body = fs.createReadStream(filePath)
      if (isDelete == 'true') {
        fs.unlinkSync(filePath)
      }
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 通用上传请求（单个）
   */
  async uploadFile() {
    try {
      const file = this.ctx.request.files[0]
      // 上传文件路径
      const filePath = this.RuoYiConfig.uploadPath
      // 上传并返回新文件名称
      const fileName = await this.fileUploadUtils.upload(filePath, file)
      const url = `http://${this.ctx.request.host}` + fileName
      const ajax = this.AjaxResult.success()
      ajax.url = url
      ajax.fileName = fileName
      ajax.newFileName = this.FileUtils.getName(fileName)
      ajax.originalFilename = this.FileUtils.getName(file.filename)
      this.ctx.body = ajax
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 通用上传请求（多个）
   */
  async uploadFiles() {
    try {
      // 上传文件路径
      const filePath = this.RuoYiConfig.uploadPath
      const urls = []
      const fileNames = []
      const newFileNames = []
      const originalFilenames = []
      const files = this.ctx.request.files
      for (const file of files) {
        // 上传并返回新文件名称
        const fileName = await this.fileUploadUtils.upload(filePath, file)
        const url = `http://${this.ctx.request.host}` + fileName
        urls.push(url)
        fileNames.push(fileName)
        newFileNames.push(this.FileUtils.getName(fileName))
        originalFilenames.push(this.FileUtils.getName(file.filename))
      }
      const ajax = this.AjaxResult.success()
      ajax.urls = urls.join(this.FILE_DELIMETER)
      ajax.fileNames = fileNames.join(this.FILE_DELIMETER)
      ajax.newFileNames = newFileNames.join(this.FILE_DELIMETER)
      ajax.originalFilenames = originalFilenames.join(this.FILE_DELIMETER)
      this.ctx.body = ajax
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 本地资源通用下载
   */
  resourceDownload() {
    try {
      const resource = this.ctx.query.resource
      if (!this.FileUtils.checkAllowDownload(resource)) {
        throw new Error(`资源文件(${resource})非法，不允许下载。 `)
      }
      // 本地资源路径
      const localPath = this.RuoYiConfig.profile
      // 数据库资源地址
      const downloadPath = localPath + this.StringUtils.substringAfter(resource, this.Constants.RESOURCE_PREFIX)
      // 下载名称
      const downloadName = this.StringUtils.substringAfterLast(downloadPath, '/')
      this.ctx.set('Content-Type', '"application/octet-stream')
      this.ctx.set('Content-Disposition', `attachment; filename=${encodeURIComponent(downloadName)}`)
      // 将Excel文件流输出到HTTP响应
      // 使用 writeBuffer 方法并等待Promise完成
      this.ctx.status = 200
      this.ctx.body = fs.createReadStream(downloadPath)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}

module.exports = CommonController
