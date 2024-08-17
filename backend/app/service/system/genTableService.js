const BaseService = require('./baseService.js')
const velocity = require('velocity')
const path = require('path')
const archiver = require('archiver')
const fs = require('fs')
class GenTableService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.genTableMapper = this.ctx.service.system.mapper.genTableMapper
    this.genTableColumnMapper = this.ctx.service.system.mapper.genTableColumnMapper
    this.genUtils = this.ctx.service.system.genUtils
  }
  /**
   * 查询业务列表
   *
   * @param genTable 业务信息
   * @return 业务集合
   */
  selectGenTableList(genTable) {
    return this.genTableMapper.selectGenTableList(genTable)
  }
  /**
   * 查询据库列表
   *
   * @param genTable 业务信息
   * @return 数据库表集合
   */
  selectDbTableList(genTable) {
    return this.genTableMapper.selectDbTableList(genTable)
  }
  /**
   * 查询据库列表
   *
   * @param tableNames 表名称组
   * @return 数据库表集合
   */
  selectDbTableListByNames(tableNames) {
    return this.genTableMapper.selectDbTableListByNames(tableNames)
  }
  /**
   * 导入表结构
   *
   * @param tableList 导入表列表
   */
  async importGenTable(tableList, operName) {
    for (const table of tableList) {
      const tableName = table.tableName
      this.genUtils.initTable(table, operName)
      const row = 1
      const iTable = await this.genTableMapper.insertGenTable(table)
      table.tableId = iTable.tableId
      if (row > 0) {
        // 保存列信息
        const genTableColumns = await this.genTableColumnMapper.selectDbTableColumnsByName(tableName)
        for (const column of genTableColumns) {
          this.genUtils.initColumnField(column, table)
          await this.genTableColumnMapper.insertGenTableColumn(column)
        }
      }
    }
  }
  /**
   * 查询业务信息
   *
   * @param id 业务ID
   * @return 业务信息
   */
  async selectGenTableById(id) {
    const genTable = await this.genTableMapper.selectGenTableById(id)
    this.setTableFromOptions(genTable)
    return genTable
  }
  /**
   * 设置代码生成其他选项值
   *
   * @param genTable 设置后的生成对象
   */
  setTableFromOptions(genTable) {
    const paramsObj = JSON.parse(genTable.options)
    if (this.StringUtils.isNotNull(paramsObj)) {
      const treeCode = paramsObj[this.GenConstants.TREE_CODE]
      const treeParentCode = paramsObj[this.GenConstants.TREE_PARENT_CODE]
      const treeName = paramsObj[this.GenConstants.TREE_NAME]
      const parentMenuId = paramsObj[this.GenConstants.PARENT_MENU_ID]
      const parentMenuName = paramsObj[this.GenConstants.PARENT_MENU_NAME]

      genTable.treeCode = treeCode
      genTable.treeParentCode = treeParentCode
      genTable.treeName = treeName
      genTable.parentMenuId = parentMenuId
      genTable.parentMenuName = parentMenuName
    }
  }
  /**
   * 查询所有表信息
   *
   * @return 表信息集合
   */
  selectGenTableAll() {
    return this.genTableMapper.selectGenTableAll()
  }
  /**
   * 修改保存参数校验
   *
   * @param genTable 业务信息
   */
  validateEdit(genTable) {
    if (this.GenConstants.TPL_TREE == genTable.tplCategory) {
      const options = JSON.stringify(genTable.params)
      const paramsObj = JSON.parse(options)
      if (this.StringUtils.isEmpty(paramsObj[this.GenConstants.TREE_CODE])) {
        throw new this.ServiceException('树编码字段不能为空')
      } else if (this.StringUtils.isEmpty(paramsObj[this.GenConstants.TREE_PARENT_CODE])) {
        throw new this.ServiceException('树父编码字段不能为空')
      } else if (this.StringUtils.isEmpty(paramsObj[this.GenConstants.TREE_NAME])) {
        throw new this.ServiceException('树名称字段不能为空')
      } else if (this.GenConstants.TPL_SUB == genTable.tplCategory) {
        if (this.StringUtils.isEmpty(genTable.subTableName)) {
          throw new this.ServiceException('关联子表的表名不能为空')
        } else if (this.StringUtils.isEmpty(genTable.subTableFkName)) {
          throw new this.ServiceException('子表关联的外键名不能为空')
        }
      }
    }
  }
  /**
   * 修改业务
   *
   * @param genTable 业务信息
   * @return 结果
   */
  async updateGenTable(genTable) {
    const options = JSON.stringify(genTable.params)
    genTable.options = options
    const row = 1
    await this.genTableMapper.updateGenTable(genTable)
    if (row > 0) {
      for (const cenTableColumn of genTable.columns) {
        await this.genTableColumnMapper.updateGenTableColumn(cenTableColumn)
      }
    }
  }
  /**
   * 删除业务对象
   *
   * @param tableIds 需要删除的数据ID
   * @return 结果
   */
  async deleteGenTableByIds(tableIds) {
    await this.genTableMapper.deleteGenTableByIds(tableIds)
    await this.genTableColumnMapper.deleteGenTableColumnByIds(tableIds)
  }
  /**
   * 设置主子表信息
   *
   * @param table 业务表信息
   */
  async setSubTable(table) {
    const subTableName = table.subTableName
    if (this.StringUtils.isNotEmpty(subTableName)) {
      table.subTable = await this.genTableMapper.selectGenTableByName(subTableName)
    }
  }
  /**
   * 设置主键列信息
   *
   * @param table 业务表信息
   */
  setPkColumn(table) {
    for (const column of table.columns) {
      if (column.isPk == '1') {
        table.pkColumn = column
        break
      }
    }
    if (this.StringUtils.isNull(table.pkColumn)) {
      table.pkColumn(table.columns[0])
    }
    if (this.GenConstants.TPL_SUB == table.tplCategory) {
      for (const column of table.subTable.columns) {
        if (column.isPk == '1') {
          table.subTable.pkColumn = column
          break
        }
      }
      if (this.StringUtils.isNull(table.subTable.pkColumn)) {
        table.subTable.pkColumn = table.subTable.columns[0]
      }
    }
  }
  /**
   * 预览代码
   *
   * @param tableId 表编号
   * @return 预览数据列表
   */
  async previewCode(tableId) {
    const dataMap = {}
    // 查询表信息
    let table = await this.genTableMapper.selectGenTableById(tableId)
    table = JSON.parse(JSON.stringify(table));

    // 设置主子表信息
    await this.setSubTable(table)
    // 设置主键列信息
    this.setPkColumn(table)

    const context = this.VelocityUtils.prepareContext(table)
    // 获取模板列表
    const templates = this.VelocityUtils.getTemplateList(table.tplCategory, table.tplWebType)
    for (const template of templates) {
      const engine = new velocity.Engine({
        template: path.join(__dirname, '../../utils/system', template)
      })

      dataMap[template] = engine.render(context)
    }

    return dataMap
  }
  /**
   * 查询表信息并生成代码
   */
  async generatorCode2(tableName, zip) {
    // 查询表信息
    let table = await this.genTableMapper.selectGenTableByName(tableName)
    table = JSON.parse(JSON.stringify(table));
    // 设置主子表信息
    await this.setSubTable(table)
    // 设置主键列信息
    this.setPkColumn(table)

    const context = this.VelocityUtils.prepareContext(table)
    // 获取模板列表
    const templates = this.VelocityUtils.getTemplateList(table.tplCategory, table.tplWebType)

    for (const template of templates) {
      const engine = new velocity.Engine({
        template: path.join(__dirname, '../../utils/system', template)
      })
      
      const txt = engine.render(context)
      // 添加文件到归档
      zip.append(txt, { name: this.VelocityUtils.getFileName(template, table) })
    }
  }

  /**
   * 生成代码（下载方式）
   *
   * @param tableName 表名称
   * @return 数据
   */
  async downloadCode(tableName) {
    return new Promise(async (resolve, reject) => {
      // 创建一个输出流
      const fileFullPath = path.join(__dirname, `../../public/ruoyi_${new Date().getTime()}.zip`)
      const output = fs.createWriteStream(fileFullPath)
      const zip = archiver('zip', { zlib: { level: 9 } })

      // 将归档文件数据写入到输出文件
      output.on('close', () => {
        const result = fs.readFileSync(fileFullPath)
        fs.unlinkSync(fileFullPath)
        resolve(result)
      })

      // 监听归档完成事件
      zip.on('error', (err) => {
        throw err
      })

      // 管道流机制
      zip.pipe(output)

      await this.generatorCode2(tableName, zip)

      // 完成 ZIP 文件
      zip.finalize()
    })
  }
  /**
   * 查询表信息并生成代码
   */
  async generatorCode(tableName) {
    // 查询表信息
    let table = await this.genTableMapper.selectGenTableByName(tableName)
    table = JSON.parse(JSON.stringify(table));

    // 设置主子表信息
    await this.setSubTable(table)
    // 设置主键列信息
    this.setPkColumn(table)
    const context = this.VelocityUtils.prepareContext(table)

    // 获取模板列表
    const templates = this.VelocityUtils.getTemplateList(table.tplCategory, table.tplWebType)
    for (const template of templates) {
      if (!['sql.vm', 'api.js.vm', 'index.vue.vm', 'index-tree.vue.vm'].includes(template)) {
        const engine = new velocity.Engine({
          template: path.join(__dirname, '../../utils/system', template)
        })
        const txt = engine.render(context)
        const txtPath = this.getGenPath(table, template)
        console.log(txtPath, 'txtPath11111111')
        if (!fs.existsSync(path.parse(txtPath).dir)) {
          fs.mkdirSync(path.parse(txtPath).dir, { recursive: true })
        }
        fs.writeFileSync(txtPath, txt, 'utf8')
      }
    }
  }
  /**
   * 获取代码生成地址
   *
   * @param table 业务表信息
   * @param template 模板文件路径
   * @return 生成地址
   */
  getGenPath(table, template) {
    const genPath = table.genPath // 假设 `table.getGenPath()` 是一个方法，返回字符串
    if (genPath === '/') {
      // 获取当前工作目录
      const userDir = path.join(process.cwd(), '../')
      return userDir + '/' + this.VelocityUtils.getFileName(template, table)
    }
    return genPath + '/' + this.VelocityUtils.getFileName(template, table)
  }
  /**
   * 同步数据库
   *
   * @param tableName 表名称
   */
  async synchDb(tableName) {
    const table = await this.genTableMapper.selectGenTableByName(tableName)
    console.log(table, 'table')
    const tableColumns = table.columns
    const tableColumnMap = {}
    tableColumns.forEach(column => tableColumnMap[column.columnName] = column);

    const dbTableColumns = await this.genTableColumnMapper.selectDbTableColumnsByName(tableName)
    if (this.StringUtils.isEmpty(dbTableColumns)) {
      throw new ServiceException('同步数据失败，原表结构不存在')
    }
    const dbTableColumnNames = dbTableColumns.map((column) => column.columnName)

    dbTableColumns.forEach(async (column) => {
      this.genUtils.initColumnField(column, table)
      if (tableColumnMap[column.columnName]) {
        const prevColumn = tableColumnMap[column.columnName]
        column.columnId = prevColumn.columnId
        if (column.isList == '1') {
          // 如果是列表，继续保留查询方式/字典类型选项
          column.dictType = prevColumn.dictType
          column.queryType = prevColumn.queryType
        }
        if (this.StringUtils.isNotEmpty(prevColumn.isRequired) && !column.isPk == '1' && (column.isInsert == '1' || column.isEdit == '1') && (column.isUsableColumn || !column.isSuperColumn)) {
          // 如果是(新增/修改&非主键/非忽略及父属性)，继续保留必填/显示类型选项
          column.isRequired = prevColumn.isRequired
          column.htmlType = prevColumn.htmlType
        }
        await this.genTableColumnMapper.updateGenTableColumn(column)
      } else {
        await this.genTableColumnMapper.insertGenTableColumn(column)
      }
    })

    const delColumns = tableColumns.filter((column) => !dbTableColumnNames.includes(column.columnName))
    if (this.StringUtils.isNotEmpty(delColumns)) {
      await this.genTableColumnMapper.deleteGenTableColumns(delColumns)
    }
  }
  /**
   * 生成代码（下载方式）
   *
   * @param tableNames 表名称
   * @return 数据
   */
  async downloadCodes(tableNames) {
    return new Promise(async (resolve, reject) => {
      // 创建一个输出流
      const fileFullPath = path.join(__dirname, `../../public/ruoyi_${new Date().getTime()}.zip`)
      const output = fs.createWriteStream(fileFullPath)
      const zip = archiver('zip', { zlib: { level: 9 } })

      // 将归档文件数据写入到输出文件
      output.on('close', () => {
        const result = fs.readFileSync(fileFullPath)
        fs.unlinkSync(fileFullPath)
        resolve(result)
      })

      // 监听归档完成事件
      zip.on('error', (err) => {
        throw err
      })

      // 管道流机制
      zip.pipe(output)

      for (const tableName of tableNames) {
        await this.generatorCode2(tableName, zip)
      }
      // 完成 ZIP 文件
      zip.finalize()
    })
  }
  /**
   * 创建表
   *
   * @param sql 创建表语句
   * @return 结果
   */
  async createTable(sql) {
    await this.genTableMapper.createTable(sql)
    return true
  }
}

// 导出类
module.exports = GenTableService
