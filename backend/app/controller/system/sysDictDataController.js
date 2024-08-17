const BaseController = require('./baseController.js')
const ExcelJS = require('exceljs')
/**
 * 数据字典信息
 *
 * @author ruoyi
 */
class SysDictDataController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.dictTypeService = this.ctx.service.system.sysDictTypeService
    this.dictDataService = this.ctx.service.system.sysDictDataService
  }
  async list() {
    try {
      const dictData = this.ctx.query
      const list = await this.dictDataService.selectDictDataList(dictData)
      this.ctx.body = this.getDataTable(list)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async export() {
    try {
      const dictData = this.ctx.request.body
      const list = await this.dictDataService.selectDictDataList(dictData)
      // 创建工作簿
      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('字典数据')

      // 添加表头
      sheet.columns = [
        { header: '字典编码', key: 'dictCode' },
        { header: '字典排序', key: 'dictSort' },
        { header: '字典标签', key: 'dictLabel' },
        { header: '字典键值', key: 'dictValue' },
        { header: '字典类型', key: 'dictType' },
        { header: '是否默认', key: 'isDefault' },
        { header: '状态', key: 'status' }
      ]

      // 添加数据
      list.rows.forEach((item) => {
        item.status = item.status === '0' ? '正常' : '停用'
        item.isDefault = item.isDefault === 'Y' ? '是' : '否'
        sheet.addRow(item)
      })

      // 定义响应的形式
      const fileName = 'sys_dict_data.xlsx'
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
   * 查询字典数据详细
   */
  async getInfo() {
    try {
      const dictCode = this.ctx.params.dictCode
      this.ctx.body = this.success(await this.dictDataService.selectDictDataById(dictCode))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 根据字典类型查询字典数据信息
   */
  async dictType() {
    try {
      const dictType = this.ctx.params.dictType
      let data = await this.dictTypeService.selectDictDataByType(dictType)
      if (this.StringUtils.isNull(data)) {
        data = []
      }
      this.ctx.body = this.success(data)
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
      dict.createBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.dictDataService.insertDictData(dict))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 修改保存字典类型
   */
  async edit() {
    try {
      const dict = this.ctx.request.body
      dict.updateBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.dictDataService.updateDictData(dict))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 删除字典类型
   */
  async remove() {
    try {
      const dictCodes = this.ctx.params.dictCodes.split(',')
      await this.dictDataService.deleteDictDataByIds(dictCodes)
      this.ctx.body = this.success()
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}

module.exports = SysDictDataController
