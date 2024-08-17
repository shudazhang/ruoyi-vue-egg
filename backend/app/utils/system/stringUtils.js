/**
 * 字符串工具类
 *
 * @author ruoyi
 */
class StringUtils {
  /** 空字符串 */
  static EMPTY = ''
  /**
   * 替换字符串中的值
   *
   * @param text 原始字符串
   * @param searchList  搜索的数组[a,b,c]
   * @param replacementList  替换的数组[1,2,3]
   * @return text 返回值
   */
  static replaceEach(text, searchList, replacementList) {
    if (!text || !searchList.length || !replacementList.length || searchList.length !== replacementList.length) {
      return text
    }

    // 创建一个映射表，将搜索项与对应的替换项关联起来
    const map = searchList.reduce((acc, curr, index) => {
      acc[curr] = replacementList[index]
      return acc
    }, {})

    // 构建一个正则表达式，用于匹配所有需要替换的字符串
    const regex = new RegExp(searchList.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g')

    // 使用正则表达式进行全局替换
    return text.replace(regex, (matched) => map[matched])
  }
  /**
   * 获取参数不为空值
   *
   * @param value defaultValue 要判断的value
   * @return value 返回值
   */
  static nvl(value, defaultValue) {
    return value !== undefined && value !== null ? value : defaultValue
  }
  /**
   * * 判断一个Collection是否为空， 包含List，Set，Queue
   *
   * @param coll 要判断的Collection
   * @return true：为空 false：非空
   */
  static isEmpty(coll) {
    return coll === undefined || coll === null || coll.length === 0
  }
  /**
   * * 判断一个Collection是否非空，包含List，Set，Queue
   *
   * @param coll 要判断的Collection
   * @return true：非空 false：空
   */
  static isNotEmpty(coll) {
    return !this.isEmpty(coll)
  }
  /**
   * * 判断一个对象是否为空
   *
   * @param object Object
   * @return true：为空 false：非空
   */
  static isNull(object) {
    return object === undefined || object === null
  }
  /**
   * * 判断一个对象是否非空
   *
   * @param object Object
   * @return true：非空 false：空
   */
  static isNotNull(object) {
    return !this.isNull(object)
  }
  /**
   * 是否为http(s)://开头
   *
   * @param link 链接
   * @return 结果
   */
  static ishttp(link) {
    return link.startsWith('http://') || link.startsWith('https://')
  }
  /**
   * 判断一个字符串是否等于任意一个给定的字符串。
   *
   * 此静态方法接收一个字符串和一系列其他字符串参数，检查该字符串是否等于这些参数中的任意一个。
   * 它使用Array的includes方法来实现这一功能，提高了代码的可读性和效率。
   *
   * @param {string} string - 需要进行比较的目标字符串。
   * @param {...string} args - 一个或多个将与目标字符串进行比较的字符串参数。
   * @returns {boolean} 如果目标字符串等于任意一个参数字符串，则返回true；否则返回false。
   */
  static equalsAny(string, ...args) {
    return args.includes(string)
  }
  /**
   * 判断两个值是否相等
   *
   * 此静态方法接受两个参数，并返回一个布尔值，指示这两个参数是否相等
   * 使用的是宽松的相等性比较，即 `==`，这意味着它会进行类型转换来比较两个值
   *
   * @param {any} a - 第一个值，将被用于比较
   * @param {any} b - 第二个值，将被用于比较
   * @return {boolean} - 如果两个值相等（经过类型转换后），返回 `true`，否则返回 `false`
   */
  static equals(a, b) {
    return a == b
  }
  static containsAny(collection, ...array) {
    if (this.isEmpty(collection) || this.isEmpty(array)) {
      return false
    }
    return array.some((str) => collection.includes(str))
  }
  static substringAfter(str, separator) {
    if (this.isEmpty(str)) {
      return str
    } else if (separator == null) {
      return ''
    } else {
      const pos = str.indexOf(separator)
      return pos == -1 ? '' : str.substring(pos + separator.length)
    }
  }
  static substringAfterLast(str, separator) {
    if (this.isEmpty(str)) {
      return str
    } else {
      const pos = str.lastIndexOf(separator)
      return pos != -1 && pos != str.length - 1 ? str.substring(pos + 1) : ''
    }
  }
}

module.exports = StringUtils
