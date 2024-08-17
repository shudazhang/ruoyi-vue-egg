/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1720517078603_5415'

  // add your middleware config here
  config.middleware = []

  // 端口
  config.cluster = {
    listen: {
      port: 7003
    }
  }
  config.static = {
    prefix: '/profile/',
    dir: 'D:/ruoyi/uploadPath'
  }
  config.bodyParser = {
    formLimit: '30mb',
    jsonLimit: '30mb',
    textLimit: '30mb'
  }
  config.multipart = {
    mode: 'file',
    whitelist: () => true
  }
  // 设置csrd安全
  config.security = {
    csrf: false // false关闭
    // domainWhiteList: ['http://localhost:7009', 'http://localhost:7009'], // 允许跨域请求的域名白名单
  }
  // 数据库配置
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'egg_vue_starter',
    define: {
      // paranoid: false, // 添加软删除
      freezeTableName: true, // 防止修改表名为复数
      timestamps: false // 添加create,update,delete时间戳
      // underscored: false // 防止驼峰式字段被默认转为下划线
    }
  }
  config.redis = {
    client: {
      port: 6379, // Redis服务器端口
      host: '127.0.0.1', // Redis服务器地址
      password: '', // Redis服务器密码（如果有的话）
      db: 1 // 使用的数据库索引
    }
  }

  config.jwt = {
    //令牌自定义标识
    header: 'Authorization',
    secret: 'abcdefghijklmnopqrstuvwxyz', // 令牌密钥
    enable: false, // 是否开启
    expiresIn: 1000 * 60 * 30 // 令牌有效期（默认30分钟）
  }
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    ruoYiConfig: {
      // 名称
      name: 'RuoYi',
      // 版本
      version: '3.8.8',
      // 版权年份
      copyrightYear: 2024,
      // 文件路径 示例（ Windows配置D:/ruoyi/uploadPath，Linux配置 /home/ruoyi/uploadPath）
      profile: 'D:/ruoyi/uploadPath',
      // 获取ip地址开关
      addressEnabled: false,
      // 验证码类型 math 数字计算 char 字符验证
      captchaType: 'math',
      avatarPath: 'D:/ruoyi/uploadPath/avatar',
      importPath: 'D:/ruoyi/uploadPath/import',
      downloadPath: 'D:/ruoyi/uploadPath/download/',
      uploadPath: 'D:/ruoyi/uploadPath/upload'
    },
    // 用户配置
    user: {
      password: {
        //密码最大错误次数
        maxRetryCount: 5,
        // 密码锁定时间（默认10分钟）
        lockTime: 10
      }
    }
  }

  return {
    ...config,
    ...userConfig
  }
}
