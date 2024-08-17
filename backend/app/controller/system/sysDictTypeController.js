const BaseController = require('./baseController.js')
const ExcelJS = require('exceljs')
/**
 * 数据字典信息
 *
 * @author ruoyi
 */
class SysDictTypeController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.dictTypeService = this.ctx.service.system.sysDictTypeService
  }
  async list() {
    try {
      const dictType = this.ctx.query
      const list = await this.dictTypeService.selectDictTypeList(dictType)
      this.ctx.body = this.getDataTable(list)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async export() {
    try {
      const dictType = this.ctx.request.body
      const list = await this.dictTypeService.selectDictTypeList(dictType)
      // 创建工作簿
      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('字典类型')

      // 添加表头
      sheet.columns = [
        { header: '字典主键', key: 'dictId' },
        { header: '字典名称', key: 'dictName' },
        { header: '字典类型', key: 'dictType' },
        { header: '状态', key: 'status' }
      ]

      // 添加数据
      list.rows.forEach((item) => {
        item.status = item.status === '0' ? '正常' : '停用'
        sheet.addRow(item)
      })

      // 定义响应的形式
      const fileName = 'sys_dict_type.xlsx'
      this.ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      this.ctx.set('Content-Disposition', `attachment; filename=${encodeURIComponent(fileName)}`)

      // 将Excel文件流输出到HTTP响应
      // 使用 writeBuffer 方法并等待Promise完成
      this.ctx.body = await workbook.xlsx.writeBuffer()
      this.ctx.status = 200
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 查询字典类型详细
   */
  async getInfo() {
    try {
      const dictId = this.ctx.params.dictId
      this.ctx.body = this.success(await this.dictTypeService.selectDictTypeById(dictId))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 新增字典类型
   */
  async add() {
    try {
      const dict = this.ctx.request.body
      if (!(await this.dictTypeService.checkDictTypeUnique(dict))) {
        return (this.ctx.body = this.error("新增字典'" + dict.dictName + "'失败，字典类型已存在"))
      }
      dict.createBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.dictTypeService.insertDictType(dict))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 修改字典类型
   */
  async edit() {
    try {
      const dict = this.ctx.request.body
      if (!(await this.dictTypeService.checkDictTypeUnique(dict))) {
        return (this.ctx.body = this.error("修改字典'" + dict.dictName + "'失败，字典类型已存在"))
      }
      dict.updateBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.dictTypeService.updateDictType(dict))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 删除字典类型
   */
  async remove() {
    try {
      const dictIds = this.ctx.params.dictIds.split(',')
      await this.dictTypeService.deleteDictTypeByIds(dictIds)
      this.ctx.body = this.success()
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 刷新字典缓存
   */
  async refreshCache() {
    try {
      await this.dictTypeService.resetDictCache()
      this.ctx.body = this.success()
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 获取字典选择框列表
   */
  async optionselect() {
    try {
      const dictTypes = await this.dictTypeService.selectDictTypeAll()
      this.ctx.body = this.success(dictTypes)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}

module.exports = SysDictTypeController
