const BaseController = require('./baseController.js')
/**
 * 注册验证
 *
 * @author ruoyi
 */
class SysRegisterController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.configService = this.ctx.service.system.sysConfigService
    this.registerService = this.ctx.service.system.sysRegisterService
  }
  async register() {
    try {
      const user = this.ctx.request.body
      if (!('true' == (await this.configService.selectConfigByKey('sys.account.registerUser')))) {
        return (this.ctx.body = this.error('当前系统没有开启注册功能！'))
      }
      const msg = await this.registerService.register(user)
      return this.StringUtils.isEmpty(msg) ? (this.ctx.body = this.success()) : (this.ctx.body = this.error(msg))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}

module.exports = SysRegisterController
