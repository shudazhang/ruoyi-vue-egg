const BaseController = require('./baseController.js')
const ExcelJS = require('exceljs')
/**
 * 参数配置 信息操作处理
 * 
 * @author ruoyi
 */
class SysConfigController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.configService = this.ctx.service.system.sysConfigService
  }
  /**
   * 获取参数配置列表
   */
  async list() {
    try {
      const config = this.ctx.query
      const list = await this.configService.selectConfigList(config)
      this.ctx.body = this.getDataTable(list)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async export() {
    try {
      const config = this.ctx.request.body
      const list = await this.configService.selectConfigList(config)
      // 创建工作簿
      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('参数数据')

      // 添加表头
      sheet.columns = [
        { header: '参数主键', key: 'configId' },
        { header: '参数名称', key: 'configName' },
        { header: '参数键名', key: 'configKey' },
        { header: '参数键值', key: 'configValue' },
        { header: '系统内置', key: 'configType' }
      ]

      // 添加数据
      list.rows.forEach((item) => {
        item.configType = item.configType === 'Y' ? '是' : '否'
        sheet.addRow(item)
      })

      // 定义响应的形式
      const fileName = 'sys_config.xlsx'
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
   * 根据参数编号获取详细信息
   */
  async getInfo() {
    try {
      const configId = this.ctx.params.configId
      this.ctx.body = this.success(await this.configService.selectConfigById(configId))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 根据参数键名查询参数值
   */
  async getConfigKey() {
    try {
      const configKey = this.ctx.params.configKey
      this.ctx.body = this.success(await this.configService.selectConfigByKey(configKey))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 新增字典类型
   */
  async add() {
    try {
      const config = this.ctx.request.body
      if (!(await this.configService.checkConfigKeyUnique(config))) {
        return (this.ctx.body = this.error("新增参数'" + config.configName + "'失败，参数键名已存在"))
      }
      config.createBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.configService.insertConfig(config))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 修改参数配置
   */
  async edit() {
    try {
      const config = this.ctx.request.body
      if (!(await this.configService.checkConfigKeyUnique(config))) {
        return (this.ctx.body = this.error("修改参数'" + config.configName + "'失败，参数键名已存在"))
      }
      config.updateBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.configService.updateConfig(config))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 删除参数配置
   */
  async remove() {
    try {
      const configIds = this.ctx.params.configIds.split(',')
      await this.configService.deleteConfigByIds(configIds)
      this.ctx.body = this.success()
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 刷新参数缓存
   */
  async refreshCache() {
    try {
      await this.configService.resetConfigCache()
      this.ctx.body = this.success()
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}
module.exports = SysConfigController
