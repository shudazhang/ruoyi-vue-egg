const BusinessType = require('./utils/system/businessType.js')
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app
  const jwtAuth = app.middleware.system.jwtAuth
  const hasPermi = app.middleware.system.hasPermi
  const log = app.middleware.system.log
  const hasRole = app.middleware.system.hasRole

  router.get('/', controller.system.sysIndexController.index)

  router.get('/captchaImage', controller.system.captchaController.getCode)
  router.post('/login', controller.system.sysLoginController.login)
  router.get('/getInfo', jwtAuth(), controller.system.sysLoginController.getInfo)
  router.get('/getRouters', jwtAuth(), controller.system.sysLoginController.getRouters)
  router.post('/logout', controller.system.sysLoginController.onLogoutSuccess)

  router.post('/register', controller.system.sysRegisterController.register)

  router.get('/system/dict/type/list', jwtAuth(), hasPermi('system:dict:list'), controller.system.sysDictTypeController.list)
  router.post('/system/dict/type/export', jwtAuth(), hasPermi('system:dict:export'), log('字典类型', BusinessType.EXPORT, 'controller.system.sysDictTypeController.export'), controller.system.sysDictTypeController.export)
  router.get('/system/dict/type/optionselect', jwtAuth(), controller.system.sysDictTypeController.optionselect)
  router.get('/system/dict/type/:dictId', jwtAuth(), hasPermi('system:dict:query'), controller.system.sysDictTypeController.getInfo)
  router.post('/system/dict/type', jwtAuth(), hasPermi('system:dict:add'), log('字典类型', BusinessType.INSERT, 'controller.system.sysDictTypeController.add'), controller.system.sysDictTypeController.add)
  router.put('/system/dict/type', jwtAuth(), hasPermi('system:dict:edit'), log('字典类型', BusinessType.UPDATE, 'controller.system.sysDictTypeController.edit'), controller.system.sysDictTypeController.edit)
  router.delete('/system/dict/type/refreshCache', jwtAuth(), hasPermi('system:dict:remove'), log('字典类型', BusinessType.CLEAN, 'controller.system.sysDictTypeController.refreshCache'), controller.system.sysDictTypeController.refreshCache)
  router.delete('/system/dict/type/:dictIds', jwtAuth(), hasPermi('system:dict:remove'), log('字典类型', BusinessType.DELETE, 'controller.system.sysDictTypeController.remove'), controller.system.sysDictTypeController.remove)

  router.get('/system/dict/data/list', jwtAuth(), hasPermi('system:dict:list'), controller.system.sysDictDataController.list)
  router.post('/system/dict/data/export', jwtAuth(), hasPermi('system:dict:export'), log('字典数据', BusinessType.EXPORT, 'controller.system.sysDictDataController.export'), controller.system.sysDictDataController.export)
  router.get('/system/dict/data/type/:dictType', jwtAuth(), controller.system.sysDictDataController.dictType)
  router.get('/system/dict/data/:dictCode', jwtAuth(), hasPermi('system:dict:query'), controller.system.sysDictDataController.getInfo)
  router.post('/system/dict/data', jwtAuth(), hasPermi('system:dict:add'), log('字典数据', BusinessType.INSERT, 'controller.system.sysDictDataController.add'), controller.system.sysDictDataController.add)
  router.put('/system/dict/data', jwtAuth(), hasPermi('system:dict:edit'), log('字典数据', BusinessType.UPDATE, 'controller.system.sysDictDataController.edit'), controller.system.sysDictDataController.edit)
  router.delete('/system/dict/data/:dictCodes', jwtAuth(), hasPermi('system:dict:remove'), log('字典数据', BusinessType.DELETE, 'controller.system.sysDictDataController.remove'), controller.system.sysDictDataController.remove)

  router.get('/system/config/list', jwtAuth(), hasPermi('system:config:list'), controller.system.sysConfigController.list)
  router.post('/system/config/export', jwtAuth(), hasPermi('system:config:export'), log('参数管理', BusinessType.EXPORT, 'controller.system.sysConfigController.export'), controller.system.sysConfigController.export)
  router.get('/system/config/configKey/:configKey', jwtAuth(), controller.system.sysConfigController.getConfigKey)
  router.get('/system/config/:configId', jwtAuth(), hasPermi('system:config:query'), controller.system.sysConfigController.getInfo)
  router.post('/system/config', jwtAuth(), hasPermi('system:config:add'), log('参数管理', BusinessType.INSERT, 'controller.system.sysConfigController.add'), controller.system.sysConfigController.add)
  router.put('/system/config', jwtAuth(), hasPermi('system:config:edit'), log('参数管理', BusinessType.UPDATE, 'controller.system.sysConfigController.edit'), controller.system.sysConfigController.edit)
  router.delete('/system/config/refreshCache', jwtAuth(), hasPermi('system:config:remove'), log('参数管理', BusinessType.CLEAN, 'controller.system.sysConfigController.refreshCache'), controller.system.sysConfigController.refreshCache)
  router.delete('/system/config/:configIds', jwtAuth(), hasPermi('system:config:remove'), log('参数管理', BusinessType.DELETE, 'controller.system.sysConfigController.remove'), controller.system.sysConfigController.remove)

  router.get('/system/notice/list', jwtAuth(), hasPermi('system:notice:list'), controller.system.sysNoticeController.list)
  router.get('/system/notice/:noticeId', jwtAuth(), hasPermi('system:notice:query'), controller.system.sysNoticeController.getInfo)
  router.post('/system/notice', jwtAuth(), hasPermi('system:notice:add'), log('通知公告', BusinessType.INSERT, 'controller.system.sysNoticeController.add'), controller.system.sysNoticeController.add)
  router.put('/system/notice', jwtAuth(), hasPermi('system:notice:edit'), log('通知公告', BusinessType.UPDATE, 'controller.system.sysNoticeController.edit'), controller.system.sysNoticeController.edit)
  router.delete('/system/notice/:noticeIds', jwtAuth(), hasPermi('system:notice:remove'), log('通知公告', BusinessType.DELETE, 'controller.system.sysNoticeController.remove'), controller.system.sysNoticeController.remove)

  router.get('/system/post/list', jwtAuth(), hasPermi('system:post:list'), controller.system.sysPostController.list)
  router.post('/system/post/export', jwtAuth(), hasPermi('system:post:export'), log('岗位管理', BusinessType.EXPORT, 'controller.system.sysPostController.export'), controller.system.sysPostController.export)
  router.get('/system/post/optionselect', jwtAuth(), controller.system.sysPostController.optionselect)
  router.get('/system/post/:postId', jwtAuth(), hasPermi('system:post:query'), controller.system.sysPostController.getInfo)
  router.post('/system/post', jwtAuth(), hasPermi('system:post:add'), log('岗位管理', BusinessType.INSERT, 'controller.system.sysPostController.add'), controller.system.sysPostController.add)
  router.put('/system/post', jwtAuth(), hasPermi('system:post:edit'), log('岗位管理', BusinessType.UPDATE, 'controller.system.sysPostController.edit'), controller.system.sysPostController.edit)
  router.delete('/system/post/:postIds', jwtAuth(), hasPermi('system:post:remove'), log('岗位管理', BusinessType.DELETE, 'controller.system.sysPostController.remove'), controller.system.sysPostController.remove)

  router.get('/system/dept/list', jwtAuth(), hasPermi('system:dept:list'), controller.system.sysDeptController.list)
  router.get('/system/dept/list/exclude/:deptId', jwtAuth(), hasPermi('system:dept:list'), controller.system.sysDeptController.excludeChild)
  router.get('/system/dept/:deptId', jwtAuth(), hasPermi('system:dept:query'), controller.system.sysDeptController.getInfo)
  router.post('/system/dept', jwtAuth(), hasPermi('system:dept:add'), log('部门管理', BusinessType.INSERT, 'controller.system.sysDeptController.add'), controller.system.sysDeptController.add)
  router.put('/system/dept', jwtAuth(), hasPermi('system:dept:edit'), log('部门管理', BusinessType.UPDATE, 'controller.system.sysDeptController.edit'), controller.system.sysDeptController.edit)
  router.delete('/system/dept/:deptId', jwtAuth(), hasPermi('system:dept:remove'), log('部门管理', BusinessType.DELETE, 'controller.system.sysDeptController.remove'), controller.system.sysDeptController.remove)

  router.get('/system/menu/list', jwtAuth(), hasPermi('system:menu:list'), controller.system.sysMenuController.list)
  router.get('/system/menu/treeselect', jwtAuth(), controller.system.sysMenuController.treeselect)
  router.get('/system/menu/roleMenuTreeselect/:roleId', jwtAuth(), controller.system.sysMenuController.roleMenuTreeselect)
  router.get('/system/menu/:menuId', jwtAuth(), hasPermi('system:menu:query'), controller.system.sysMenuController.getInfo)
  router.post('/system/menu', jwtAuth(), hasPermi('system:menu:add'), log('菜单管理', BusinessType.INSERT, 'controller.system.sysMenuController.add'), controller.system.sysMenuController.add)
  router.put('/system/menu', jwtAuth(), hasPermi('system:menu:edit'), log('菜单管理', BusinessType.UPDATE, 'controller.system.sysMenuController.edit'), controller.system.sysMenuController.edit)
  router.delete('/system/menu/:menuId', jwtAuth(), hasPermi('system:menu:remove'), log('菜单管理', BusinessType.DELETE, 'controller.system.sysMenuController.remove'), controller.system.sysMenuController.remove)

  router.get('/system/role/list', jwtAuth(), hasPermi('system:role:list'), controller.system.sysRoleController.list)
  router.post('/system/role/export', jwtAuth(), hasPermi('system:role:export'), log('角色管理', BusinessType.EXPORT, 'controller.system.sysRoleController.export'), controller.system.sysRoleController.export)
  router.get('/system/role/optionselect', jwtAuth(), hasPermi('system:role:query'), controller.system.sysRoleController.optionselect)
  router.get('/system/role/authUser/allocatedList', jwtAuth(), hasPermi('system:role:list'), controller.system.sysRoleController.allocatedList)
  router.get('/system/role/authUser/unallocatedList', jwtAuth(), hasPermi('system:role:list'), controller.system.sysRoleController.unallocatedList)
  router.put('/system/role/authUser/cancel', jwtAuth(), hasPermi('system:role:edit'), log('角色管理', BusinessType.GRANT, 'controller.system.sysRoleController.cancelAuthUser'), controller.system.sysRoleController.cancelAuthUser)
  router.put('/system/role/authUser/cancelAll', jwtAuth(), hasPermi('system:role:edit'), log('角色管理', BusinessType.GRANT, 'controller.system.sysRoleController.cancelAuthUserAll'), controller.system.sysRoleController.cancelAuthUserAll)
  router.put('/system/role/authUser/selectAll', jwtAuth(), hasPermi('system:role:edit'), log('角色管理', BusinessType.GRANT, 'controller.system.sysRoleController.selectAuthUserAll'), controller.system.sysRoleController.selectAuthUserAll)
  router.get('/system/role/:roleId', jwtAuth(), hasPermi('system:role:query'), controller.system.sysRoleController.getInfo)
  router.post('/system/role', jwtAuth(), hasPermi('system:role:add'), log('角色管理', BusinessType.INSERT, 'controller.system.sysRoleController.add'), controller.system.sysRoleController.add)
  router.put('/system/role', jwtAuth(), hasPermi('system:role:edit'), log('角色管理', BusinessType.UPDATE, 'controller.system.sysRoleController.edit'), controller.system.sysRoleController.edit)
  router.put('/system/role/dataScope', jwtAuth(), hasPermi('system:role:edit'), log('角色管理', BusinessType.UPDATE, 'controller.system.sysRoleController.dataScope'), controller.system.sysRoleController.dataScope)
  router.put('/system/role/changeStatus', jwtAuth(), hasPermi('system:role:edit'), log('角色管理', BusinessType.UPDATE, 'controller.system.sysRoleController.changeStatus'), controller.system.sysRoleController.changeStatus)
  router.get('/system/role/deptTree/:roleId', jwtAuth(), hasPermi('system:role:query'), controller.system.sysRoleController.deptTree)
  router.delete('/system/role/:roleIds', jwtAuth(), hasPermi('system:role:remove'), log('角色管理', BusinessType.DELETE, 'controller.system.sysRoleController.remove'), controller.system.sysRoleController.remove)

  router.get('/system/user/profile', jwtAuth(), controller.system.sysProfileController.profile)
  router.put('/system/user/profile', jwtAuth(), log('个人信息', BusinessType.UPDATE, 'controller.system.sysProfileController.updateProfile'), controller.system.sysProfileController.updateProfile)
  router.put('/system/user/profile/updatePwd', jwtAuth(), log('个人信息', BusinessType.UPDATE, 'controller.system.sysProfileController.updatePwd'), controller.system.sysProfileController.updatePwd)
  router.post('/system/user/profile/avatar', jwtAuth(), log('用户头像', BusinessType.UPDATE, 'controller.system.sysProfileController.avatar'), controller.system.sysProfileController.avatar) // 未完成

  router.get('/system/user/list', jwtAuth(), hasPermi('system:user:list'), controller.system.sysUserController.list)
  router.post('/system/user/export', jwtAuth(), hasPermi('system:user:export'), log('用户管理', BusinessType.EXPORT, 'controller.system.sysUserController.export'), controller.system.sysUserController.export)
  router.post('/system/user/importData', jwtAuth(), hasPermi('system:user:import'), log('用户管理', BusinessType.IMPORT, 'controller.system.sysUserController.importData'), controller.system.sysUserController.importData)
  router.post('/system/user/importTemplate', jwtAuth(), controller.system.sysUserController.importTemplate)
  router.get('/system/user/', jwtAuth(), hasPermi('system:user:query'), controller.system.sysUserController.getInfo)
  router.post('/system/user', jwtAuth(), hasPermi('system:user:add'), log('用户管理', BusinessType.INSERT, 'controller.system.sysUserController.add'), controller.system.sysUserController.add)
  router.put('/system/user', jwtAuth(), hasPermi('system:user:edit'), log('用户管理', BusinessType.UPDATE, 'controller.system.sysUserController.edit'), controller.system.sysUserController.edit)
  router.delete('/system/user/:userIds', jwtAuth(), hasPermi('system:user:remove'), log('用户管理', BusinessType.DELETE, 'controller.system.sysUserController.remove'), controller.system.sysUserController.remove)
  router.put('/system/user/resetPwd', jwtAuth(), hasPermi('system:user:resetPwd'), log('用户管理', BusinessType.UPDATE, 'controller.system.sysUserController.resetPwd'), controller.system.sysUserController.resetPwd)
  router.put('/system/user/changeStatus', jwtAuth(), hasPermi('system:user:edit'), log('用户管理', BusinessType.UPDATE, 'controller.system.sysUserController.changeStatus'), controller.system.sysUserController.changeStatus)
  router.get('/system/user/authRole/:userId', jwtAuth(), hasPermi('system:user:query'), controller.system.sysUserController.authRole)
  router.put('/system/user/authRole', jwtAuth(), hasPermi('system:user:edit'), log('用户管理', BusinessType.GRANT, 'controller.system.sysUserController.insertAuthRole'), controller.system.sysUserController.insertAuthRole)
  router.get('/system/user/deptTree', jwtAuth(), hasPermi('system:user:list'), controller.system.sysUserController.deptTree)
  router.get('/system/user/:userId', jwtAuth(), hasPermi('system:user:query'), controller.system.sysUserController.getInfo)

  router.get('/monitor/operlog/list', jwtAuth(), hasPermi('monitor:operlog:list'), controller.system.sysOperlogController.list)
  router.post('/monitor/operlog/export', jwtAuth(), hasPermi('monitor:operlog:export'), log('操作日志', BusinessType.EXPORT, 'controller.system.sysOperlogController.export'), controller.system.sysOperlogController.export)
  router.delete('/monitor/operlog/clean', jwtAuth(), hasPermi('monitor:operlog:remove'), log('操作日志', BusinessType.CLEAN, 'controller.system.sysOperlogController.clean'), controller.system.sysOperlogController.clean)
  router.delete('/monitor/operlog/:operIds', jwtAuth(), hasPermi('monitor:operlog:remove'), log('操作日志', BusinessType.DELETE, 'controller.system.sysOperlogController.remove'), controller.system.sysOperlogController.remove)

  router.get('/monitor/logininfor/list', jwtAuth(), hasPermi('monitor:logininfor:list'), controller.system.sysLogininforController.list)
  router.post('/monitor/logininfor/export', jwtAuth(), hasPermi('monitor:logininfor:export'), log('登录日志', BusinessType.EXPORT, 'controller.system.sysLogininforController.export'), controller.system.sysLogininforController.export)
  router.delete('/monitor/logininfor/clean', jwtAuth(), hasPermi('monitor:logininfor:remove'), log('登录日志', BusinessType.CLEAN, 'controller.system.sysLogininforController.clean'), controller.system.sysLogininforController.clean)
  router.delete('/monitor/logininfor/:infoIds', jwtAuth(), hasPermi('monitor:logininfor:remove'), log('登录日志', BusinessType.DELETE, 'controller.system.sysLogininforController.remove'), controller.system.sysLogininforController.remove)
  router.get('/monitor/logininfor/unlock/:userName', jwtAuth(), hasPermi('monitor:logininfor:unlock'), log('账户解锁', BusinessType.OTHER, 'controller.system.sysLogininforController.unlock'), controller.system.sysLogininforController.unlock)

  router.get('/monitor/online/list', jwtAuth(), hasPermi('monitor:online:list'), controller.system.sysUserOnlineController.list)
  router.delete('/monitor/online/:tokenId', jwtAuth(), hasPermi('monitor:online:forceLogout'), log('在线用户', BusinessType.FORCE, 'controller.system.sysUserOnlineController.forceLogout'), controller.system.sysUserOnlineController.forceLogout)

  router.get('/monitor/server', jwtAuth(), hasPermi('monitor:server:list'), controller.system.serverController.getInfo)

  router.get('/monitor/cache', jwtAuth(), hasPermi('monitor:cache:list'), controller.system.cacheController.getInfo)
  router.get('/monitor/cache/getNames', jwtAuth(), hasPermi('monitor:cache:list'), controller.system.cacheController.cache)
  router.get('/monitor/cache/getKeys/:cacheName', jwtAuth(), hasPermi('monitor:cache:list'), controller.system.cacheController.getCacheKeys)
  router.get('/monitor/cache/getValue/:cacheName/:cacheKey', jwtAuth(), hasPermi('monitor:cache:list'), controller.system.cacheController.getCacheValue)
  router.delete('/monitor/cache/clearCacheName/:cacheName', jwtAuth(), hasPermi('monitor:cache:list'), controller.system.cacheController.clearCacheName)
  router.delete('/monitor/cache/clearCacheKey/:cacheKey', jwtAuth(), hasPermi('monitor:cache:list'), controller.system.cacheController.clearCacheKey)
  router.delete('/monitor/cache/clearCacheAll', jwtAuth(), hasPermi('monitor:cache:list'), controller.system.cacheController.clearCacheAll)

  router.post('/common/upload', jwtAuth(), controller.system.commonController.uploadFile)
  router.post('/common/uploads', jwtAuth(), controller.system.commonController.uploadFiles)
  router.get('/common/download', jwtAuth(), controller.system.commonController.fileDownload)
  router.get('/common/download/resource', jwtAuth(), controller.system.commonController.resourceDownload)

  router.get('/monitor/job/list', jwtAuth(), hasPermi('monitor:job:list'), controller.system.sysJobController.list)
  router.post('/monitor/job/export', jwtAuth(), hasPermi('monitor:job:export'), log('定时任务', BusinessType.EXPORT, 'controller.system.sysJobController.export'), controller.system.sysJobController.export)
  router.get('/monitor/job/:jobId', jwtAuth(), hasPermi('monitor:job:query'), controller.system.sysJobController.getInfo)
  router.post('/monitor/job', jwtAuth(), hasPermi('monitor:job:add'), log('定时任务', BusinessType.INSERT, 'controller.system.sysJobController.add'), controller.system.sysJobController.add)
  router.put('/monitor/job', jwtAuth(), hasPermi('monitor:job:edit'), log('定时任务', BusinessType.UPDATE, 'controller.system.sysJobController.edit'), controller.system.sysJobController.edit)
  router.put('/monitor/job/changeStatus', jwtAuth(), hasPermi('monitor:job:changeStatus'), log('定时任务', BusinessType.UPDATE, 'controller.system.sysJobController.changeStatus'), controller.system.sysJobController.changeStatus)
  router.put('/monitor/job/run', jwtAuth(), hasPermi('monitor:job:changeStatus'), log('定时任务', BusinessType.UPDATE, 'controller.system.sysJobController.run'), controller.system.sysJobController.run)
  router.delete('/monitor/job/:jobIds', jwtAuth(), hasPermi('monitor:job:remove'), log('定时任务', BusinessType.DELETE, 'controller.system.sysJobController.remove'), controller.system.sysJobController.remove)

  router.get('/monitor/jobLog/list', jwtAuth(), hasPermi('monitor:job:list'), controller.system.sysJobLogController.list)
  router.post('/monitor/jobLog/export', jwtAuth(), hasPermi('monitor:job:export'), log('任务调度日志', BusinessType.EXPORT, 'controller.system.sysJobLogController.export'), controller.system.sysJobLogController.export)
  router.get('/monitor/jobLog/:jobLogId', jwtAuth(), hasPermi('monitor:job:query'), controller.system.sysJobLogController.getInfo)
  router.delete('/monitor/jobLog/clean', jwtAuth(), hasPermi('monitor:job:remove'), log('任务调度日志', BusinessType.CLEAN, 'controller.system.sysJobLogController.clean'), controller.system.sysJobLogController.clean)
  router.delete('/monitor/jobLog/:jobLogIds', jwtAuth(), hasPermi('monitor:job:remove'), log('任务调度日志', BusinessType.DELETE, 'controller.system.sysJobLogController.remove'), controller.system.sysJobLogController.remove)

  router.get('/tool/gen/list', jwtAuth(), hasPermi('tool:gen:list'), controller.system.genController.genList)
  router.get('/tool/gen/db/list', jwtAuth(), hasPermi('tool:gen:list'), controller.system.genController.dataList)
  router.get('/tool/gen/column/:tableId', jwtAuth(), hasPermi('tool:gen:list'), controller.system.genController.columnList)
  router.get('/tool/gen/preview/:tableId', jwtAuth(), hasPermi('tool:gen:preview'), controller.system.genController.preview)
  router.get('/tool/gen/download/:tableName', jwtAuth(), hasPermi('tool:gen:code'),log('代码生成', BusinessType.GENCODE, 'controller.system.genController.download'),  controller.system.genController.download)
  router.get('/tool/gen/genCode/:tableName', jwtAuth(), hasPermi('tool:gen:code'),log('代码生成', BusinessType.GENCODE, 'controller.system.genController.genCode'),  controller.system.genController.genCode)
  router.get('/tool/gen/synchDb/:tableName', jwtAuth(), hasPermi('tool:gen:edit'),log('代码生成', BusinessType.UPDATE, 'controller.system.genController.synchDb'),  controller.system.genController.synchDb)
  router.get('/tool/gen/batchGenCode', jwtAuth(), hasPermi('tool:gen:code'),log('代码生成', BusinessType.GENCODE, 'controller.system.genController.batchGenCode'),  controller.system.genController.batchGenCode)
  router.get('/tool/gen/:tableId', jwtAuth(), hasPermi('tool:gen:query'), controller.system.genController.getInfo)
  router.post('/tool/gen/importTable', jwtAuth(), hasPermi('tool:gen:import'), log('代码生成', BusinessType.IMPORT, 'controller.system.genController.importTableSave'), controller.system.genController.importTableSave)
  router.post('/tool/gen/createTable', jwtAuth(), hasRole('admin'), log('创建表', BusinessType.OTHER, 'controller.system.genController.createTableSave'), controller.system.genController.createTableSave)
  router.put('/tool/gen', jwtAuth(), hasPermi('tool:gen:edit'), log('代码生成', BusinessType.UPDATE, 'controller.system.genController.editSave'), controller.system.genController.editSave)
  router.delete('/tool/gen/:tableIds', jwtAuth(), hasPermi('tool:gen:remove'), log('代码生成', BusinessType.DELETE, 'controller.system.genController.remove'), controller.system.genController.remove)

}
