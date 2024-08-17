const HttpStatus = require('../../utils/system/httpStatus.js')

module.exports = () => {
  return async function (ctx, next) {
    // 从请求头中获取JWT令牌
    try {
      let user = await ctx.service.system.securityUtils.getLoginUser()
      if (user && user.userId) {
        await ctx.service.system.tokenService.verifyToken(user);
        await next()
      } else {
        return (ctx.body = { code: HttpStatus.UNAUTHORIZED, msg: '认证失败，无法访问系统资源' })
      }
    } catch (err) {
      return (ctx.body = { code: HttpStatus.UNAUTHORIZED, msg: '认证失败，无法访问系统资源' })
    }
  }
}
