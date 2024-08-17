'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { INTEGER, DATE, STRING, BIGINT, CHAR } = Sequelize
    await queryInterface.createTable('sys_dept', {
      deptId: { field: 'dept_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '部门id' },
      parentId: { field: 'parent_id', type: BIGINT(20), defaultValue: 0, comment: '父部门id' },
      ancestors: { field: 'ancestors', type: STRING(50), defaultValue: '', comment: '祖级列表' },
      deptName: { field: 'dept_name', type: STRING(30), defaultValue: '', comment: '部门名称' },
      orderNum: { field: 'order_num', type: INTEGER(4), defaultValue: 0, comment: '显示顺序' },
      leader: { field: 'leader', type: STRING(20), comment: '负责人' },
      phone: { field: 'phone', type: STRING(11), comment: '联系电话' },
      email: { field: 'email', type: STRING(50), comment: '邮箱' },
      status: { field: 'status', type: CHAR(1), defaultValue: '0', comment: '部门状态（0正常 1停用）' },
      delFlag: { field: 'del_flag', type: CHAR(1), defaultValue: '0', comment: '删除标志（0代表存在 2代表删除）' },
      createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
      createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
      updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
      updateTime: { field: 'update_time', type: DATE, comment: '更新时间' }
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE sys_dept COMMENT = '部门表';  
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sys_dept')
  }
}
