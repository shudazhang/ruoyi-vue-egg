/**
 * SQL 操作工具类
 */
class SqlUtil {
  /**
   * 定义常用的 SQL 关键字
   */
  static SQL_REGEX = 'and |extractvalue|updatexml|exec |insert |select |delete |update |drop |count |chr |mid |master |truncate |char |declare |or |+|user()'

  /**
   * 仅支持字母、数字、下划线、空格、逗号、小数点（支持多个字段排序）
   */
  static SQL_PATTERN = '[a-zA-Z0-9_\\ \\,\\.]+'

  /**
   * 限制 orderBy 最大长度
   */
  static ORDER_BY_MAX_LENGTH = 500
  static isCreateTableStatement(sqlStatement) {
    // 假设 sqlStatement 是一个字符串
    // 使用正则表达式检查是否包含 "CREATE TABLE" 字符串
    return /create\s+table/i.test(sqlStatement)
  }
  static parseStatements(sql, dbType) {
    // 根据 dbType 解析 SQL 语句
    // 这里只是一个示例实现
    if (dbType === 'mysql') {
      // 假设这是一个简单的 SQL 语句解析逻辑
      return sql.split(';').filter((statement) => statement.trim() !== '')
    }
    throw new Error(`Unsupported database type: ${dbType}`)
  }
  /**
   * 检查字符，防止注入绕过
   * @param {string} value - 待检查的值
   * @returns {string} - 检查后的值
   */
  static escapeOrderBySql(value) {
    if (this.isNonEmpty(value) && !this.isValidOrderBySql(value)) {
      throw new Error('参数不符合规范，不能进行查询')
    }
    if (value.length > this.ORDER_BY_MAX_LENGTH) {
      throw new Error('参数已超过最大限制，不能进行查询')
    }
    return value
  }

  /**
   * 验证 order by 语法是否符合规范
   * @param {string} value - 待验证的值
   * @returns {boolean} - 是否符合规范
   */
  static isValidOrderBySql(value) {
    return value.match(new RegExp(this.SQL_PATTERN)) !== null
  }

  /**
   * SQL 关键字检查
   * @param {string} value - 待检查的值
   */
  static filterKeyword(value) {
    if (this.isEmpty(value)) {
      return
    }
    const sqlKeywords = this.SQL_REGEX.split('|')
    for (const sqlKeyword of sqlKeywords) {
      if (this.indexOfIgnoreCase(value, sqlKeyword) > -1) {
        throw new Error('参数存在 SQL 注入风险')
      }
    }
  }

  /**
   * 判断字符串是否非空
   * @param {string} str - 字符串
   * @returns {boolean} - 是否非空
   */
  static isNonEmpty(str) {
    return typeof str === 'string' && str.trim().length > 0
  }

  /**
   * 判断字符串是否为空
   * @param {string} str - 字符串
   * @returns {boolean} - 是否为空
   */
  static isEmpty(str) {
    return !this.isNonEmpty(str)
  }

  /**
   * 查找字符串中子字符串的位置（忽略大小写）
   * @param {string} str - 主字符串
   * @param {string} searchStr - 子字符串
   * @returns {number} - 子字符串的位置
   */
  static indexOfIgnoreCase(str, searchStr) {
    if (str.toLowerCase().includes(searchStr.toLowerCase())) {
      return str.toLowerCase().indexOf(searchStr.toLowerCase())
    }
    return -1
  }
}
module.exports = SqlUtil
