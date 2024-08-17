module.exports = (title, businessType, method) => {
  return async function (ctx, next) {
    const startTime = new Date().getTime()
    const loginUser = await ctx.service.system.securityUtils.getLoginUser()
    await next()
    try {
      await ctx.service.system.sysOperLogService.insertOperlog({
        title: title,
        businessType: businessType,
        method: method,
        requestMethod: ctx.request.method,
        operatorType: loginUser.os && loginUser.os.toLowerCase().includes('windows') ? 1 : 0,
        operName: loginUser.user.userName,
        deptName: loginUser.user.dept.deptName,
        operUrl: ctx.url,
        operIp: loginUser.ipaddr,
        operLocation: loginUser.loginLocation,
        operParam: JSON.stringify(ctx.request.body).slice(0, 500),
        jsonResult: ctx.body.code ? JSON.stringify(ctx.body).slice(0, 500) : '',
        status: ctx.body.code ? (ctx.body.code === 200 ? 0 : 1) : ctx.status === 200 ? 0 : 1,
        errorMsg: ctx.body.code ? (ctx.body.code === 200 ? '' : ctx.body.msg) : '',
        costTime: new Date().getTime() - startTime
      })
    } catch (err) {
    }
  }
}
