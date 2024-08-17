const BaseController = require('./baseController.js')

/**
 * 首页
 *
 * @author ruoyi
 */
class SysIndexController extends BaseController {
  constructor(ctx) {
    super(ctx)
    /** 系统基础配置 */
    this.ruoyiConfig = this.app.config.ruoYiConfig
  }
  /**
   * 访问首页，提示语
   */
  async index() {
    try {
      this.ctx.body = `欢迎使用${this.ruoYiConfig.name}后台管理框架，当前版本：v${this.ruoYiConfig.version}，请通过前端地址访问。`
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}

module.exports = SysIndexController
