const BaseController = require('./baseController.js')
/**
 * 代码生成 操作处理
 *
 * @author ruoyi
 */
class GenController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.genTableService = this.ctx.service.system.genTableService
    this.genTableColumnService = this.ctx.service.system.genTableColumnService
  }
  /**
   * 查询代码生成列表
   */
  async genList() {
    try {
      const genTable = this.ctx.query
      const list = await this.genTableService.selectGenTableList(genTable)
      this.ctx.body = this.getDataTable(list)
    } catch (error) {
      console.log(error)
    }
  }
  /**
   * 修改代码生成业务
   */
  async getInfo() {
    try {
      const tableId = this.ctx.params.tableId
      const table = await this.genTableService.selectGenTableById(tableId)
      const tables = await this.genTableService.selectGenTableAll()
      const list = await this.genTableColumnService.selectGenTableColumnListByTableId(tableId)
      const map = {}
      map.info = table
      map.rows = list
      map.tables = tables
      this.ctx.body = this.success(map)
    } catch (error) {
      console.log(error)
    }
  }
  /**
   * 修改代码生成业务
   */
  async dataList() {
    try {
      const genTable = this.ctx.query
      const list = await this.genTableService.selectDbTableList(genTable)
      this.ctx.body = this.getDataTable(list)
    } catch (error) {
      console.log(error)
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 查询数据表字段列表
   */
  async columnList() {
    try {
      const tableId = this.ctx.params.tableId
      const dataInfo = {}
      const list = await this.genTableColumnService.selectGenTableColumnListByTableId(tableId)
      dataInfo.rows = list
      dataInfo.total = list.length
      this.ctx.body = dataInfo
    } catch (error) {
      console.log(error)
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 导入表结构（保存）
   */
  async importTableSave() {
    try {
      const tableNames = this.ctx.query.tables.split(',')
      // 查询表信息
      const tableList = await this.genTableService.selectDbTableListByNames(tableNames)
      await this.genTableService.importGenTable(tableList, await this.securityUtils.getUsername())
      this.ctx.body = this.success()
    } catch (error) {
      console.log(error)
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 创建表结构（保存）
   */
  async createTableSave() {
    try {
      const sql = this.ctx.query.sql
      this.SqlUtil.filterKeyword(sql)
      const sqlStatements = this.SqlUtil.parseStatements(sql, 'mysql')
      const tableNames = []
      for (const sqlStatement of sqlStatements) {
        if (this.SqlUtil.isCreateTableStatement(sqlStatement)) {
          if (await this.genTableService.createTable(sqlStatement)) {
            const tableName = sqlStatement.match(/create\s+table\s+`?(\w+)`?\s+\(/i);
            tableNames.push(tableName)
          }
        }
      }
      const tableList = await this.genTableService.selectDbTableListByNames(tableNames)
      const operName = await this.securityUtils.getUsername()
      await this.genTableService.importGenTable(tableList, operName)
      this.ctx.body = this.AjaxResult.success()
    } catch (error) {
      console.log(error)
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 修改保存代码生成业务
   */
  async editSave() {
    try {
      const genTable = this.ctx.request.body
      await this.genTableService.validateEdit(genTable)
      await this.genTableService.updateGenTable(genTable)
      this.ctx.body = this.success()
    } catch (error) {
      console.log(error)
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 删除代码生成
   */
  async remove() {
    try {
      const tableIds = this.ctx.params.tableIds.split(',')
      await this.genTableService.deleteGenTableByIds(tableIds)
      this.ctx.body = this.success()
    } catch (error) {
      console.log(error)
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 预览代码
   */
  async preview() {
    try {
      const tableId = this.ctx.params.tableId
      const dataMap = await this.genTableService.previewCode(tableId)
      this.ctx.body = this.success(dataMap)
    } catch (error) {
      console.log(error)
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 生成代码（下载方式）
   */
  async download() {
    try {
      const tableName = this.ctx.params.tableName
      const data = await this.genTableService.downloadCode(tableName)
      // 设置响应头
      this.ctx.set('Content-Type', 'application/octet-stream')
      this.ctx.set('Content-Disposition', `attachment; filename=${encodeURIComponent('ruoyi.zip')}`)
      this.ctx.body = data
      this.ctx.status = 200
    } catch (error) {
      console.log(error)
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 生成代码（自定义路径）
   */
  async genCode() {
    try {
      const tableName = this.ctx.params.tableName
      await this.genTableService.generatorCode(tableName)
      this.ctx.body = this.success()
    } catch (error) {
      console.log(error)
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 同步数据库
   */
  async synchDb() {
    try {
      const tableName = this.ctx.params.tableName
      await this.genTableService.synchDb(tableName)
      this.ctx.body = this.success()
    } catch (error) {
      console.log(error)
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 批量生成代码
   */
  async batchGenCode() {
    try {
      const tables = this.ctx.query.tables
      const tableNames = tables.split(',')
      const data = await this.genTableService.downloadCodes(tableNames)
      // 设置响应头
      this.ctx.set('Content-Type', 'application/octet-stream')
      this.ctx.set('Content-Disposition', `attachment; filename=${encodeURIComponent('ruoyi.zip')}`)
      this.ctx.body = data
      this.ctx.status = 200
    } catch (error) {
      console.log(error)
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}

module.exports = GenController
