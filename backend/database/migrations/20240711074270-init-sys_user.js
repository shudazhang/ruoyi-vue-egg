'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DATE, STRING, BIGINT, CHAR } = Sequelize
    await queryInterface.createTable('sys_user', {
      userId: { field: 'user_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '用户ID' },
      deptId: { field: 'dept_id', type: BIGINT(20), comment: '部门ID' },
      userName: { field: 'user_name', type: STRING(30), allowNull: false, comment: '用户账号' },
      nickName: { field: 'nick_name', type: STRING(30), allowNull: false, comment: '用户昵称' },
      userType: { field: 'user_type', type: STRING(2), defaultValue: '00', comment: '用户类型（00系统用户）' },
      email: { field: 'email', type: STRING(50), defaultValue: '', comment: '用户邮箱' },
      phonenumber: { field: 'phonenumber', type: STRING(11), defaultValue: '', comment: '手机号码' },
      sex: { field: 'sex', type: CHAR(1), defaultValue: '0', comment: '用户性别（0男 1女 2未知）' },
      avatar: { field: 'avatar', type: STRING(100), defaultValue: '', comment: '头像地址' },
      password: { field: 'password', type: STRING(100), defaultValue: '', comment: '密码' },
      status: { field: 'status', type: CHAR(1), defaultValue: '0', comment: '帐号状态（0正常 1停用）' },
      delFlag: { field: 'del_flag', type: CHAR(1), defaultValue: '0', comment: '删除标志（0代表存在 2代表删除）' },
      loginIp: { field: 'login_ip', type: STRING(128), defaultValue: '', comment: '最后登录IP' },
      loginDate: { field: 'login_date', type: DATE, comment: '最后登录时间' },
      createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
      createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
      updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
      updateTime: { field: 'update_time', type: DATE, comment: '更新时间' },
      remark: { field: 'remark', type: STRING(500), comment: '备注' }
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE sys_user COMMENT = '用户信息表';  
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sys_user')
  }
}
