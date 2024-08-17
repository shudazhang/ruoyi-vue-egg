const { Controller } = require('egg')
const AjaxResult = require('../../utils/system/ajaxResult.js')
const RedisCache = require('../../utils/system/redisCache.js')
const IdUtils = require('../../utils/system/idUtils.js')
const CacheConstants = require('../../utils/system/cacheConstants.js')
const StringUtils = require('../../utils/system/stringUtils.js')
const Constants = require('../../utils/system/constants.js')
const MessageUtils = require('../../utils/system/messageUtils.js')
const UserConstants = require('../../utils/system/userConstants.js')
const HttpStatus = require('../../utils/system/httpStatus.js')
const MimeTypeUtils = require('../../utils/system/mimeTypeUtils.js')
const FileUploadUtils = require('../../utils/system/fileUploadUtils.js')
const FileUtils = require('../../utils/system/fileUtils.js')
const SqlUtil = require('../../utils/system/sqlUtils.js')
class BaseController extends Controller {
  constructor(ctx) {
    super(ctx)
    this.securityUtils = this.ctx.service.system.securityUtils
  }
  AjaxResult = AjaxResult
  redisCache = new RedisCache(this.app.redis)
  IdUtils = IdUtils
  CacheConstants = CacheConstants
  StringUtils = StringUtils
  Constants = Constants
  MessageUtils = MessageUtils
  UserConstants = UserConstants
  MimeTypeUtils = MimeTypeUtils
  fileUploadUtils = new FileUploadUtils(this.app.config.ruoYiConfig)
  FileUtils = FileUtils
  SqlUtil = SqlUtil
  /**
   * 响应请求分页数据
   */
  getDataTable({ rows, count }) {
    return {
      code: HttpStatus.SUCCESS,
      msg: '查询成功',
      rows: rows,
      total: count
    }
  }
  /**
   * 返回成功
   */
  success(data) {
    if (typeof data === 'string') {
      return AjaxResult.success(data)
    } else if (typeof data === 'object') {
      return AjaxResult.success(null, data)
    } else {
      return AjaxResult.success()
    }
  }
  /**
   * 返回失败消息
   */
  error(msg) {
    return AjaxResult.error(msg)
  }
  /**
   * 返回警告消息
   */
  warn(message) {
    return AjaxResult.warn(message)
  }
  /**
   * 响应返回结果
   *
   * @param rows 影响行数
   * @return 操作结果
   */
  toAjax() {
    return AjaxResult.success()
  }

  /**
   * 获取用户缓存信息
   */
  async getLoginUser() {
    return await this.securityUtils.getLoginUser()
  }
  /**
   * 获取登录用户id
   */
  async getUserId() {
    return (await this.getLoginUser()).userId
  }
  /**
   * 获取登录部门id
   */
  async getDeptId() {
    return (await this.getLoginUser()).deptId
  }
  /**
   * 获取登录用户名
   */
  async getUsername() {
    return (await this.getLoginUser()).user.userName
  }
}

module.exports = BaseController
