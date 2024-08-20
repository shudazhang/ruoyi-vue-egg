# ruoyi-vue-egg

前端使用 ruoyi-vue  version: 3.8.8  
https://gitee.com/y_project/RuoYi-Vue.git  



## 不同
```
login.vue、register.vue
    this.codeUrl = "data:image/gif;base64," 
    修改为
    this.codeUrl = "data:image/svg+xml;base64,"
```

## 本地启动项目
```
mysql:5.7.28
redis:5.0.14
node:16.20.2

创建并导入数据库 ry-vue
启动redis服务

cd backend 
npm install  --registry=https://registry.npmmirror.com
npm run dev

cd frontend 
npm install  --registry=https://registry.npmmirror.com
npm run dev

浏览器打开: http://localhost:7009
```

## 默认账号密码
```
admin/admin123
ry/admin123
```

## 定时任务
```
任务名称: 测试任务
任务分组：默认
调用方法:  ctx.service.system.sysTaskService.testTask()
corn: */2 * * * * ?
执行策略: 放弃执行 （计划执行错误策略未实现，无论执行结果到时间依然执行）
状态开启后 每2秒执行一次
```