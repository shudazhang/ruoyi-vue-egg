const BaseService = require('./baseService.js')
class GenUtils extends BaseService {
  constructor(ctx) {
    super(ctx)
  }
  /**
   * 初始化表信息
   */
  initTable(genTable, operName) {
    genTable.className = this.convertClassName(genTable.tableName)
    genTable.packageName = 'com.ruoyi.system'
    genTable.moduleName = this.getModuleName(genTable.packageName)
    genTable.businessName = this.getBusinessName(genTable.tableName)
    genTable.functionName = this.replaceText(genTable.tableComment)
    genTable.functionAuthor = 'ruoyi'
    genTable.createBy = operName
  }
  /**
   * 表名转换成Java类名
   *
   * @param tableName 表名称
   * @return 类名
   */
  convertClassName(tableName) {
    return tableName
      .split('_')
      .map((word, index) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }
  /**
   * 获取模块名
   *
   * @param packageName 包名
   * @return 模块名
   */
  getModuleName(packageName) {
    const lastIndex = packageName.lastIndexOf('.')
    const nameLength = packageName.length
    return packageName.substring(lastIndex + 1, nameLength)
  }
  /**
   * 获取业务名
   *
   * @param tableName 表名
   * @return 业务名
   */
  getBusinessName(tableName) {
    const lastIndex = tableName.lastIndexOf('_')
    const nameLength = tableName.length
    return tableName.substring(lastIndex + 1, nameLength)
  }
  /**
   * 关键字替换
   *
   * @param text 需要被替换的名字
   * @return 替换后的名字
   */
  replaceText(text) {
    return text.replace(/(?:表|若依)/g, '')
  }
  /**
   * 获取数据库类型字段
   *
   * @param columnType 列类型
   * @return 截取后的列类型
   */
  getDbType(columnType) {
    const index = columnType.indexOf('(')
    if (index > 0) {
      return columnType.substring(0, index)
    } else {
      return columnType
    }
  }
  toCamelCase(columnName) {
    return columnName
      .split('_')
      .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
      .join('')
  }
  /**
   * 获取字段长度
   *
   * @param columnType 列类型
   * @return 截取后的列类型
   */
  getColumnLength(columnType) {
    const index = columnType.indexOf('(')
    if (index > 0) {
      const match = columnType.match(/\((\d+)\)/)
      if (match) {
        return parseInt(match[1], 10)
      }
    }
    return 0
  }
  splitColumnType(columnType) {
    const match = columnType.match(/\(([^)]+)\)/)
    if (match) {
      const innerContent = match[1]
      return innerContent.split(',')
    }
    return []
  }
  endsWithIgnoreCase(str, suffix) {
    return str.toLowerCase().endsWith(suffix.toLowerCase())
  }
  /**
   * 初始化列属性字段
   */
  initColumnField(column, table) {
    const dataType = this.getDbType(column.columnType)
    const columnName = column.columnName
    column.tableId = table.tableId
    column.createBy = table.createBy
    // 设置java字段名
    column.javaField = this.toCamelCase(columnName)
    // 设置默认类型
    column.javaType = this.GenConstants.TYPE_STRING
    column.queryType = this.GenConstants.QUERY_EQ

    if (this.GenConstants.COLUMNTYPE_STR.includes(dataType) || this.GenConstants.COLUMNTYPE_TEXT.includes(dataType)) {
      // 字符串长度超过500设置为文本域
      const columnLength = this.getColumnLength(column.columnType)
      const htmlType = columnLength >= 500 || this.GenConstants.COLUMNTYPE_TEXT.includes(dataType) ? this.GenConstants.HTML_TEXTAREA : this.GenConstants.HTML_INPUT
      column.htmlType = htmlType
    } else if (this.GenConstants.COLUMNTYPE_TIME.includes(dataType)) {
      column.javaType = this.GenConstants.TYPE_DATE
      column.htmlType = this.GenConstants.HTML_DATETIME
    } else if (this.GenConstants.COLUMNTYPE_NUMBER.includes(dataType)) {
      column.htmlType = this.GenConstants.HTML_INPUT

      // 如果是浮点型 统一用BigDecimal
      const str = this.splitColumnType(column.columnType)
      if (str != null && str.length == 2 && parseInt(str[1]) > 0) {
        column.javaType = this.GenConstants.TYPE_BIGDECIMAL
      }
      // 如果是整形
      else if (str != null && str.length == 1 && parseInt(str[0]) <= 10) {
        column.javaType = this.GenConstants.TYPE_INTEGER
      }
      // 长整形
      else {
        column.javaType = this.GenConstants.TYPE_LONG
      }
    }

    // 插入字段（默认所有字段都需要插入）
    column.isInsert = this.GenConstants.REQUIRE
    // 编辑字段
    if (!this.GenConstants.COLUMNNAME_NOT_EDIT.includes(columnName) && column.isPk == '0') {
      column.isEdit = this.GenConstants.REQUIRE
    }
    // 列表字段
    if (!this.GenConstants.COLUMNNAME_NOT_LIST.includes(columnName) && column.isPk == '0') {
      column.isList = this.GenConstants.REQUIRE
    }
    // 查询字段
    if (!this.GenConstants.COLUMNNAME_NOT_QUERY.includes(columnName) && column.isPk == '0') {
      column.isQuery = this.GenConstants.REQUIRE
    }

    // 查询字段类型
    if (this.endsWithIgnoreCase(columnName, 'name')) {
      column.queryType = this.GenConstants.QUERY_LIKE
    }
    // 状态字段设置单选框
    if (this.endsWithIgnoreCase(columnName, 'status')) {
      column.htmlType = this.GenConstants.HTML_RADIO
    }
    // 类型&性别字段设置下拉框
    else if (this.endsWithIgnoreCase(columnName, 'type') || this.endsWithIgnoreCase(columnName, 'sex')) {
      column.htmlType = this.GenConstants.HTML_SELECT
    }
    // 图片字段设置图片上传控件
    else if (this.endsWithIgnoreCase(columnName, 'image')) {
      column.htmlType = this.GenConstants.HTML_IMAGE_UPLOAD
    }
    // 文件字段设置文件上传控件
    else if (this.endsWithIgnoreCase(columnName, 'file')) {
      column.htmlType = this.GenConstants.HTML_FILE_UPLOAD
    }
    // 内容字段设置富文本控件
    else if (this.endsWithIgnoreCase(columnName, 'content')) {
      column.htmlType = this.GenConstants.HTML_EDITOR
    }

    column.isUsableColumn = ['parentId', 'orderNum', 'remark'].some((item) => ('' + item).toLocaleLowerCase() == ('' + column.javaField).toLocaleLowerCase())
    column.isSuperColumn = ['createBy', 'createTime', 'updateBy', 'updateTime', 'remark', 'parentName', 'parentId', 'orderNum', 'ancestors'].some((item) => ('' + item).toLocaleLowerCase() == ('' + column.javaField).toLocaleLowerCase())
  }
}
module.exports = GenUtils
