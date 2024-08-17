const HttpStatus = require('./httpStatus.js')
class AjaxResult {
  /** 状态码 */
  static CODE_TAG = 'code'
  /** 返回内容 */
  static MSG_TAG = 'msg'
  /** 数据对象 */
  static DATA_TAG = 'data'
  static success(msg, data) {
    const result = {
      [this.CODE_TAG]: HttpStatus.SUCCESS,
      [this.MSG_TAG]: msg || '操作成功'
    }
    if (data) {
      result[this.DATA_TAG] = data
    }
    return result
  }
  static error(msg, data) {
    const result = {
      [this.CODE_TAG]: HttpStatus.ERROR,
      [this.MSG_TAG]: msg || '操作失败'
    }
    if (data) {
      result[this.DATA_TAG] = data
    }
    return result
  }
  static warn(msg, data) {
    const result = {
      [this.CODE_TAG]: HttpStatus.WARN,
      [this.MSG_TAG]: msg || '操作失败'
    }
    if (data) {
      result[this.DATA_TAG] = data
    }
    return result
  }
}

module.exports = AjaxResult
