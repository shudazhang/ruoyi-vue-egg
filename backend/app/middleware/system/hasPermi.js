const HttpStatus = require('../../utils/system/httpStatus.js')

module.exports = (permission) => {
  return async function (ctx, next) {
    // 从请求头中获取JWT令牌
    try {
      let isHasPermi = await ctx.service.system.securityUtils.hasPermi(permission)
      if (isHasPermi) {
        ctx.activeUser = { permission }
        await next()
      } else {
        return (ctx.body = { code: HttpStatus.FORBIDDEN, msg: '没有权限，请联系管理员授权' })
      }
    } catch (err) {
      return (ctx.body = { code: HttpStatus.FORBIDDEN, msg: '没有权限，请联系管理员授权' })
    }
  }
}
