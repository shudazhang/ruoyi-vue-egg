// businessTypes.js
class BusinessType {
  /**
   * 其它
   */
  static OTHER = 0
  /**
   * 新增
   */
  static INSERT = 1
  /**
   * 修改
   */
  static UPDATE = 2
  /**
   * 删除
   */
  static DELETE = 3
  /**
   * 授权
   */
  static GRANT = 4
  /**
   * 导出
   */
  static EXPORT = 5
  /**
   * 导入
   */
  static IMPORT = 6
  /**
   * 强退
   */
  static FORCE = 7
  /**
   * 生成代码
   */
  static GENCODE = 8
  /**
   *  清空数据
   */
  static CLEAN = 9
}

module.exports = BusinessType
