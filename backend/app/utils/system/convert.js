class Convert {
  /**
   * 转换为字符串<br>
   * 如果给定的值为null，或者转换失败，返回默认值<br>
   * 转换失败不会报错
   *
   * @param value 被转换的值
   * @param defaultValue 转换错误时的默认值
   * @return 结果
   */
  static toStr(value, defaultValue) {
    if (value === null || value === undefined) {
      return defaultValue
    }
    if (typeof value === 'string') {
      return value
    }
    return String(value)
  }
  /**
   * 转换为boolean<br>
   * String支持的值为：true、false、yes、ok、no，1,0 如果给定的值为空，或者转换失败，返回默认值<br>
   * 转换失败不会报错
   *
   * @param value 被转换的值
   * @param defaultValue 转换错误时的默认值
   * @return 结果
   */
  static toBool(value, defaultValue) {
    if (value === null || value === undefined) {
      return defaultValue
    }
    if (typeof value === 'boolean') {
      return value
    }
    const valueStr = Convert.toStr(value).trim().toLowerCase()
    return ['true', 'yes', 'ok', '1'].includes(valueStr)
  }
}

module.exports = Convert
