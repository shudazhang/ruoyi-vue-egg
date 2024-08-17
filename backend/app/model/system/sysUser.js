'use strict'
const moment = require('moment')
module.exports = (app) => {
  const { DATE, STRING, BIGINT, CHAR, VIRTUAL } = app.Sequelize
  const SysUser = app.model.define('sys_user', {
    userId: { field: 'user_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '用户ID' },
    deptId: { field: 'dept_id', type: BIGINT(20), comment: '部门ID' },
    userName: {
      field: 'user_name',
      type: STRING(30),
      allowNull: false,
      comment: '用户账号',
      set(userName) {
        if (/<(\S*?)[^>]*>.*?|<.*?>/g.test('' + userName)) {
          throw new Error('用户账号不能包含脚本字符')
        }
        if (['undefined', 'null', ''].includes('' + userName)) {
          throw new Error('用户账号不能为空')
        }
        if (('' + userName).length > 30) {
          throw new Error('用户账号长度不能超过30个字符')
        }
        this.setDataValue('userName', userName)
      }
    },
    nickName: {
      field: 'nick_name',
      type: STRING(30),
      allowNull: false,
      comment: '用户昵称',
      set(nickName) {
        if (/<(\S*?)[^>]*>.*?|<.*?>/g.test('' + nickName)) {
          throw new Error('用户昵称不能包含脚本字符')
        }
        if (('' + nickName).length > 30) {
          throw new Error('用户昵称长度不能超过30个字符')
        }
        this.setDataValue('nickName', nickName)
      }
    },
    userType: { field: 'user_type', type: STRING(2), defaultValue: '00', comment: '用户类型（00系统用户）' },
    email: {
      field: 'email',
      type: STRING(50),
      defaultValue: '',
      comment: '用户邮箱',
      set(email) {
        if (('' + email).length > 50) {
          throw new Error('邮箱长度不能超过50个字符')
        }
        this.setDataValue('email', email)
      }
    },
    phonenumber: {
      field: 'phonenumber',
      type: STRING(11),
      defaultValue: '',
      comment: '手机号码',
      set(phonenumber) {
        if (('' + phonenumber).length > 11) {
          throw new Error('邮箱长度不能超过11个字符')
        }
        this.setDataValue('phonenumber', phonenumber)
      }
    },
    sex: { field: 'sex', type: CHAR(1), defaultValue: '0', comment: '用户性别（0男 1女 2未知）' },
    avatar: { field: 'avatar', type: STRING(100), defaultValue: '', comment: '头像地址' },
    password: { field: 'password', type: STRING(100), defaultValue: '', comment: '密码' },
    status: { field: 'status', type: CHAR(1), defaultValue: '0', comment: '帐号状态（0正常 1停用）' },
    delFlag: { field: 'del_flag', type: CHAR(1), defaultValue: '0', comment: '删除标志（0代表存在 2代表删除）' },
    loginIp: { field: 'login_ip', type: STRING(128), defaultValue: '', comment: '最后登录IP' },
    loginDate: {
      field: 'login_date',
      type: DATE,
      comment: '最后登录时间',
      get() {
        return moment(this.getDataValue('loginDate')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
    createTime: {
      field: 'create_time',
      type: DATE,
      comment: '创建时间',
      get() {
        return moment(this.getDataValue('createTime')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
    updateTime: {
      field: 'update_time',
      type: DATE,
      comment: '更新时间',
      get() {
        return moment(this.getDataValue('updateTime')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    remark: { field: 'remark', type: STRING(500), comment: '备注' }
  })
  SysUser.associate = function () {
    SysUser.belongsTo(app.model.System.SysDept, { as: 'dept', foreignKey: 'deptId' })
    SysUser.belongsToMany(app.model.System.SysRole, {
      through: app.model.System.SysUserRole,
      foreignKey: 'userId',
      otherKey: 'roleId',
      as: 'roles'
    })
  }
  return SysUser
}
