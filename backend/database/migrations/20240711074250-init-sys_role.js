'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { INTEGER, DATE, STRING, BIGINT, CHAR, TINYINT } = Sequelize
    await queryInterface.createTable('sys_role', {
      roleId: { field: 'role_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '角色ID' },
      roleName: { field: 'role_name', type: STRING(30), allowNull: false, comment: '角色名称' },
      roleKey: { field: 'role_key', type: STRING(100), allowNull: false, comment: '角色权限字符串' },
      roleSort: { field: 'role_sort', type: INTEGER(4), allowNull: false, comment: '显示顺序' },
      dataScope: { field: 'data_scope', type: CHAR(1), defaultValue: '1', comment: '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）' },
      menuCheckStrictly: { field: 'menu_check_strictly', type: TINYINT(1), defaultValue: 1, comment: '菜单树选择项是否关联显示' },
      deptCheckStrictly: { field: 'dept_check_strictly', type: TINYINT(1), defaultValue: 1, comment: '部门树选择项是否关联显示' },
      status: { field: 'status', type: CHAR(1), allowNull: false, comment: '角色状态（0正常 1停用）' },
      delFlag: { field: 'del_flag', type: CHAR(1), defaultValue: '0', comment: '删除标志（0代表存在 2代表删除）' },
      createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
      createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
      updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
      updateTime: { field: 'update_time', type: DATE, comment: '更新时间' },
      remark: { field: 'remark', type: STRING(500), comment: '备注' }
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE sys_role COMMENT = '角色信息表';  
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sys_role')
  }
}
