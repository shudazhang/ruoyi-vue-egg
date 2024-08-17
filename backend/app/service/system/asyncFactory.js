const BaseService = require('./baseService.js')
const useragent = require('useragent')

class AsyncFactory extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.logininforService = this.ctx.service.system.sysLogininforService
  }
  /**
   * 记录登录信息
   *
   * @param username 用户名
   * @param status 状态
   * @param message 消息
   * @param args 列表
   * @return 任务task
   */
  async recordLogininfor(username, status, message, ...args) {
    const userAgent = useragent.parse(this.ctx.request.headers['user-agent'])
    const ip = this.ctx.ip
    const address = await this.addressUtils.getRealAddressByIP(ip)
    // 打印信息到日志
    this.ctx.logger.info([ip, address, username, status, message, ...args].map((item) => `[${item}]`).join(''))
    // 获取客户端操作系统
    const os = userAgent.os.toString()
    // 获取客户端浏览器
    const browser = userAgent.toAgent()
    // 封装对象
    const logininfor = {}
    logininfor.userName = username
    logininfor.ipaddr = ip
    logininfor.loginLocation = address
    logininfor.browser = browser
    logininfor.os = os
    logininfor.msg = message
    // 日志状态
    if (this.StringUtils.equalsAny(status, this.Constants.LOGIN_SUCCESS, this.Constants.LOGOUT, this.Constants.REGISTER)) {
      logininfor.status = this.Constants.SUCCESS
    } else if (this.Constants.LOGIN_FAIL === status) {
      logininfor.status = this.Constants.FAIL
    }
    await this.logininforService.insertLogininfor(logininfor)
  }
}
module.exports = AsyncFactory
