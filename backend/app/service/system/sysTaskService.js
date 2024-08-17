const BaseService = require('./baseService.js')

class SysTaskService extends BaseService {
  constructor(ctx) {
    super(ctx)
  }
  /**
   * 测试
   * 调用方法(无参): ctx.service.system.sysTaskService.testTask()
   * 调用方法(有参): ctx.service.system.sysTaskService.testTask(11,22,33)
   * @param a1
   * @param a2
   * @param a3
   */
  testTask(a1, a2, a3) {
    console.info('测试定时任务传参:', a1, a2, a3)
  }
}
module.exports = SysTaskService
