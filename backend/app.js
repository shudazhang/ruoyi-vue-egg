class AppBootHook {
  constructor(app) {
    this.app = app
  }
  async didReady() {
    // 应用已启动完毕
    this.app.cronManager = {}; //
    const ctx = await this.app.createAnonymousContext()
    await ctx.service.system.sysConfigService.init()
    await ctx.service.system.sysDictTypeService.init()
    await ctx.service.system.sysJobService.init()
  }
}
module.exports = AppBootHook
