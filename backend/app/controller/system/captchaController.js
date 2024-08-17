const BaseController = require('./baseController.js')
const svgCaptcha = require('svg-captcha')
/**
 * 验证码操作处理
 *
 * @author ruoyi
 */
class CaptchaController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.configService = this.ctx.service.system.sysConfigService
    this.RuoYiConfig = this.app.config.ruoYiConfig
  }
  /**
   * 生成验证码
   */
  async getCode() {
    try {
      const ajax = this.AjaxResult.success()
      const captchaEnabled = await this.configService.selectCaptchaEnabled()
      ajax.captchaEnabled = captchaEnabled
      if (!captchaEnabled) {
        return (this.ctx.body = ajax)
      }
      // 保存验证码信息
      const uuid = this.IdUtils.simpleUUID()
      const verifyKey = this.CacheConstants.CAPTCHA_CODE_KEY + uuid

      let code, image

      // 生成验证码
      const captchaType = this.RuoYiConfig.captchaType
      if ('math' === captchaType) {
        const captcha = svgCaptcha.createMathExpr({
          mathMin: 1,
          mathMax: 9,
          mathOperator: '+-',
          background: '#ccc',
          color: true
        })
        code = captcha.text
        image = captcha.data
      } else if ('char' === captchaType) {
        const captcha = svgCaptcha.create({
          background: '#ccc',
          color: true
        })
        code = captcha.text
        image = captcha.data
      }
      await this.redisCache.setCacheObjectWithTimeout(verifyKey, code, this.Constants.CAPTCHA_EXPIRATION * 60)
      ajax.uuid = uuid
      ajax.img = Buffer.from(image).toString('base64')
      this.ctx.body = ajax
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}

module.exports = CaptchaController
