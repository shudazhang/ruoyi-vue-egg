const GenConstants = require('./genConstants.js')
class VelocityUtils {
  // 项目空间路径
  static PROJECT_PATH = 'backend/app'

  // mybatis空间路径
  static MYBATIS_PATH = 'main/resources/mapper'

  // 默认上级菜单，系统工具
  static DEFAULT_PARENT_MENU_ID = '3'

  /**
   * 设置模板变量信息
   *
   * @param {GenTable} genTable - 业务表对象
   * @return {Object} 模板上下文
   */
  static prepareContext(genTable) {
    const moduleName = genTable.moduleName
    const businessName = genTable.businessName
    const packageName = genTable.packageName
    const tplCategory = genTable.tplCategory
    const functionName = genTable.functionName

    const velocityContext = {}
    velocityContext.tplCategory = genTable.tplCategory
    velocityContext.tableName = genTable.tableName
    velocityContext.functionName = functionName || '【请填写功能名称】'
    velocityContext.ClassName = genTable.className
    velocityContext.className = this.uncapitalize(genTable.className)
    velocityContext.moduleName = genTable.moduleName
    velocityContext.BusinessName = this.capitalize(businessName)
    velocityContext.businessName = businessName
    velocityContext.basePackage = this.getPackagePrefix(packageName)
    velocityContext.packageName = packageName
    velocityContext.author = genTable.functionAuthor
    velocityContext.datetime = this.getCurrentDate()
    velocityContext.pkColumn = genTable.pkColumn
    velocityContext.importList = this.getImportList(genTable)
    velocityContext.permissionPrefix = this.getPermissionPrefix(moduleName, businessName)
    velocityContext.columns = genTable.columns
    velocityContext.table = genTable
    velocityContext.dicts = this.getDicts(genTable)

    this.setMenuVelocityContext(velocityContext, genTable)
    if (GenConstants.TPL_TREE === tplCategory) {
      this.setTreeVelocityContext(velocityContext, genTable)
    }
    if (GenConstants.TPL_SUB === tplCategory) {
      this.setSubVelocityContext(velocityContext, genTable)
    }

    velocityContext.ModuleName = this.capitalize(velocityContext.moduleName)
    velocityContext.pkColumn.capJavaField = this.capitalize(velocityContext.pkColumn.javaField)
    velocityContext.table.crud = velocityContext.table.tplCategory != null && GenConstants.TPL_CRUD == velocityContext.table.tplCategory
    velocityContext.table.sub = velocityContext.table.tplCategory != null && GenConstants.TPL_SUB == velocityContext.table.tplCategory
    velocityContext.table.tree = velocityContext.table.tplCategory != null && GenConstants.TPL_TREE == velocityContext.table.tplCategory
    velocityContext.table.isSuperColumn = (javaField) => {
      return velocityContext.table.tplCategory != null && GenConstants.TPL_TREE == velocityContext.table.tplCategory ? [...GenConstants.TREE_ENTITY, ...GenConstants.BASE_ENTITY].some((item) => ('' + item).toLocaleLowerCase() == ('' + javaField).toLocaleLowerCase()) : GenConstants.BASE_ENTITY.some((item) => ('' + item).toLocaleLowerCase() == ('' + javaField).toLocaleLowerCase())
    }

    velocityContext.columns.forEach((column) => {
      column.query = column.isQuery == '1'
      column.increment = column.isIncrement == '1'
      column.pk = column.isPk == '1'
      column.list = column.isList == '1'
      column.insert = column.isInsert == '1'
      column.edit = column.isEdit == '1'
      column.required = column.isRequired == '1'
      column.eggJavaType = this.getEggJaveType(column.columnType)
      column.usableColumn = ['parentId', 'orderNum', 'remark'].some((item) => ('' + item).toLocaleLowerCase() == ('' + column.javaField).toLocaleLowerCase())
      column.superColumn = ['createBy', 'createTime', 'updateBy', 'updateTime', 'remark', 'parentName', 'parentId', 'orderNum', 'ancestors'].some((item) => ('' + item).toLocaleLowerCase() == ('' + column.javaField).toLocaleLowerCase())
    })
    return velocityContext
  }
  static getEggJaveType(columnType) {
    let result = columnType
    result = result.replace('bigint', 'INTEGER')
    result = result.replace('varchar', 'STRING')
    result = result.replace('longblob', 'BLOB')
    result = result.replace('datetime', 'DATE')
    result = result.replace('tinyint', 'TINYINT')
    result = result.replace('int', 'INTEGER')
    result = result.replace('char', 'CHAR')
    return result
  }
  /**
   * 设置菜单模板上下文
   *
   * @param {Object} context - 模板上下文
   * @param {GenTable} genTable - 业务表对象
   */
  static setMenuVelocityContext(context, genTable) {
    const options = genTable.options
    const paramsObj = JSON.parse(options)
    context.parentMenuId = this.getParentMenuId(paramsObj)
  }

  /**
   * 设置树形结构模板上下文
   *
   * @param {Object} context - 模板上下文
   * @param {GenTable} genTable - 业务表对象
   */
  static setTreeVelocityContext(context, genTable) {
    const options = genTable.options
    const paramsObj = JSON.parse(options)
    context.treeCode = this.getTreecode(paramsObj)
    context.treeParentCode = this.getTreeParentCode(paramsObj)
    context.treeName = this.getTreeName(paramsObj)
    context.expandColumn = this.getExpandColumn(genTable)
    if (paramsObj && paramsObj.hasOwnProperty(GenConstants.TREE_PARENT_CODE)) {
      context.tree_parent_code = paramsObj[GenConstants.TREE_PARENT_CODE]
    }
    if (paramsObj && paramsObj.hasOwnProperty(GenConstants.TREE_NAME)) {
      context.tree_name = paramsObj[GenConstants.TREE_NAME]
    }
  }

  /**
   * 设置子表模板上下文
   *
   * @param {Object} context - 模板上下文
   * @param {GenTable} genTable - 业务表对象
   */
  static setSubVelocityContext(context, genTable) {
    const subTable = genTable.subTable
    const subTableName = genTable.subTableName
    const subTableFkName = genTable.subTableFkName
    const subClassName = subTable.className
    const subTableFkClassName = this.convertToCamelCase(subTableFkName)

    context.subTable = subTable
    context.subTableName = subTableName
    context.subTableFkName = subTableFkName
    context.subTableFkClassName = subTableFkClassName
    context.subTableFkclassName = this.uncapitalize(subTableFkClassName)
    context.subClassName = subClassName
    context.subclassName = this.uncapitalize(subClassName)
    context.subImportList = this.getImportList(subTable)
  }

  /**
   * 获取模板信息
   *
   * @param {string} tplCategory - 生成的模板类别
   * @param {string} tplWebType - 前端类型
   * @return {Array<string>} 模板列表
   */
  static getTemplateList(tplCategory, tplWebType) {
    let useWebType = 'vm/vue'
    if ('element-plus' === tplWebType) {
      useWebType = 'vm/vue/v3'
    }
    const templates = ['vm/java/model.js.vm', 'vm/java/mapper.js.vm', 'vm/java/service.js.vm', 'vm/java/router1.js.vm', 'vm/java/controller.js.vm', 'vm/sql/sql.vm', 'vm/js/api.js.vm']
    if (GenConstants.TPL_CRUD === tplCategory) {
      templates.push(`${useWebType}/index.vue.vm`)
    } else if (GenConstants.TPL_TREE === tplCategory) {
      templates.push(`${useWebType}/index-tree.vue.vm`)
    } else if (GenConstants.TPL_SUB === tplCategory) {
      templates.push(`${useWebType}/index.vue.vm`)
      templates.push('vm/java/sub-model.js.vm')
    }
    return templates
  }

  /**
   * 获取文件名
   *
   * @param {string} template - 模板文件名
   * @param {GenTable} genTable - 业务表对象
   * @return {string} 文件名
   */
  static getFileName(template, genTable) {
    // 文件名称
    let fileName = ''
    // 包路径
    const packageName = genTable.packageName
    // 模块名
    const moduleName = genTable.moduleName
    // 大写类名
    const className = genTable.className
    // 业务名称
    const businessName = genTable.businessName
    const classNameCamel = this.uncapitalize(className)

    const javaPath = `${this.PROJECT_PATH}`
    const mybatisPath = `${this.MYBATIS_PATH}/${moduleName}`
    const vuePath = 'frontend/src'

    if (template.includes('model.js.vm')) {
      fileName = `${javaPath}/model/${moduleName}/${classNameCamel}.js`
    } else if (template.includes('sub-model.js.vm') && GenConstants.TPL_SUB === genTable.tplCategory) {
      fileName = `${javaPath}/domain/${genTable.subTable.className}.java`
    } else if (template.includes('mapper.js.vm')) {
      fileName = `${javaPath}/service/${moduleName}/mapper/${classNameCamel}Mapper.js`
    } else if (template.includes('service.js.vm')) {
      fileName = `${javaPath}/service/${moduleName}/${classNameCamel}Service.js`
    } else if (template.includes('router1.js.vm')) {
      fileName = `${javaPath}/router1.js`
    } else if (template.includes('controller.js.vm')) {
      fileName = `${javaPath}/controller/${moduleName}/${classNameCamel}Controller.js`
    } else if (template.includes('mapper.xml.vm')) {
      fileName = `${mybatisPath}/${classNameCamel}Mapper.xml`
    } else if (template.includes('sql.vm')) {
      fileName = `${classNameCamel}.sql`
    } else if (template.includes('api.js.vm')) {
      fileName = `${vuePath}/api/${moduleName}/${businessName}.js`
    } else if (template.includes('index.vue.vm')) {
      fileName = `${vuePath}/views/${moduleName}/${businessName}/index.vue`
    } else if (template.includes('index-tree.vue.vm')) {
      fileName = `${vuePath}/views/${moduleName}/${businessName}/index.vue`
    }
    return fileName
  }

  /**
   * 获取包前缀
   *
   * @param {string} packageName - 包名称
   * @return {string} 包前缀名称
   */
  static getPackagePrefix(packageName) {
    const lastIndex = packageName.lastIndexOf('.')
    return packageName.slice(0, lastIndex)
  }

  /**
   * 根据列类型获取导入包
   *
   * @param {GenTable} genTable - 业务表对象
   * @return {Set<string>} 导入包列表
   */
  static getImportList(genTable) {
    const columns = genTable.columns
    const subGenTable = genTable.subTable
    const importList = new Set()

    if (subGenTable) {
      importList.add('java.util.List')
    }
    for (const column of columns) {
      if (!column.isSuperColumn && 'DATE' === column.javaType) {
        importList.add('java.util.Date')
        importList.add('com.fasterxml.jackson.annotation.JsonFormat')
        break
      } else if ('BLOB' === column.javaType) {
        importList.add('org.springframework.web.multipart.MultipartFile')
      } else if (column.isSuperColumn) {
        importList.add('com.ruoyi.common.core.domain.entity.SysUser')
        importList.add('com.ruoyi.common.core.domain.entity.SysDept')
        importList.add('com.ruoyi.common.core.domain.entity.SysRole')
      }
    }
    return Array.from(importList)
  }

  /**
   * 获取权限字符串
   *
   * @param {string} moduleName - 模块名
   * @param {string} businessName - 业务名称
   * @return {string} 权限前缀
   */
  static getPermissionPrefix(moduleName, businessName) {
    return `${moduleName}:${businessName}`
  }

  /**
   * 获取字典选择框列表
   *
   * @param {GenTable} genTable - 业务表对象
   * @return {Array} 字典列表
   */
  static getDicts(genTable) {
    const columns = genTable.columns
    const dicts = []
    this.addDicts(dicts, columns, genTable)
    if (genTable.subTable) {
      const subColumns = genTable.subTable.columns
      this.addDicts(dicts, subColumns, genTable)
    }
    return dicts.join(',')
  }

  /**
   * 添加字典列表
   *
   * @param dicts 字典列表
   * @param columns 列集合
   */
  static addDicts(dicts, columns, genTable) {
    for (const column of columns) {
      const javaField = column.javaField
      const isSuperColumn = genTable.tplCategory != null && GenConstants.TPL_TREE == genTable.tplCategory ? [...GenConstants.TREE_ENTITY, ...GenConstants.BASE_ENTITY].some((item) => ('' + item).toLocaleLowerCase() == ('' + javaField).toLocaleLowerCase()) : GenConstants.BASE_ENTITY.some((item) => ('' + item).toLocaleLowerCase() == ('' + javaField).toLocaleLowerCase())
      if (!isSuperColumn && column.dictType && [GenConstants.HTML_SELECT, GenConstants.HTML_RADIO, GenConstants.HTML_CHECKBOX].includes(column.htmlType)) {
        dicts.push("'" + column.dictType + "'")
      }
   

    }
  }

  /**
   * 获取当前日期
   *
   * @return {string} 当前日期字符串
   */
  static getCurrentDate() {
    const date = new Date()
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
  }

  /**
   * 首字母大写
   *
   * @param {string} str - 字符串
   * @return {string} 转换后的字符串
   */
  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  /**
   * 首字母小写
   *
   * @param {string} str - 字符串
   * @return {string} 转换后的字符串
   */
  static uncapitalize(str) {
    return str.charAt(0).toLowerCase() + str.slice(1)
  }

  /**
   * 将下划线转换为驼峰命名法
   *
   * @param {string} str - 字符串
   * @return {string} 转换后的字符串
   */
  static convertToCamelCase(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
  }

  /**
   * 获取父菜单ID
   *
   * @param {Object} paramsObj - 参数对象
   * @return {string} 父菜单ID
   */
  static getParentMenuId(paramsObj) {
    return paramsObj && paramsObj.hasOwnProperty('parentMenuId') ? paramsObj.parentMenuId : this.DEFAULT_PARENT_MENU_ID
  }

  /**
   * 获取树形结构的code字段
   *
   * @param {Object} paramsObj - 参数对象
   * @return {string} code字段
   */
  static getTreecode(paramsObj) {
    return paramsObj && paramsObj.hasOwnProperty('treeCode') ? paramsObj.treeCode : 'id'
  }

  /**
   * 获取树形结构的parentCode字段
   *
   * @param {Object} paramsObj - 参数对象
   * @return {string} parentCode字段
   */
  static getTreeParentCode(paramsObj) {
    return paramsObj && paramsObj.hasOwnProperty('treeParentCode') ? paramsObj.treeParentCode : 'parentId'
  }

  /**
   * 获取树形结构的name字段
   *
   * @param {Object} paramsObj - 参数对象
   * @return {string} name字段
   */
  static getTreeName(paramsObj) {
    return paramsObj && paramsObj.hasOwnProperty('treeName') ? paramsObj.treeName : 'name'
  }

  /**
   * 获取展开列
   *
   * @param {GenTable} genTable - 业务表对象
   * @return {string} 展开列
   */
  static getExpandColumn(genTable) {
    const options = genTable.options
    const paramsObj = JSON.parse(options)
    return paramsObj && paramsObj.hasOwnProperty('expandColumn') ? paramsObj.expandColumn : null
  }
}

module.exports = VelocityUtils
