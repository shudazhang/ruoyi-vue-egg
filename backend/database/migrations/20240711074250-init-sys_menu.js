'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { INTEGER, DATE, STRING, BIGINT, CHAR } = Sequelize
    await queryInterface.createTable('sys_menu', {
      menuId: { field: 'menu_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '菜单ID' },
      menuName: { field: 'menu_name', type: STRING(50), allowNull: false, comment: '菜单名称' },
      parentId: { field: 'parent_id', type: BIGINT(20), defaultValue: 0, comment: '父菜单ID' },
      orderNum: { field: 'order_num', type: INTEGER(4), defaultValue: 0, comment: '显示顺序' },
      path: { field: 'path', type: STRING(200), defaultValue: '', comment: '路由地址' },
      component: { field: 'component', type: STRING(255), comment: '组件路径' },
      query: { field: 'query', type: STRING(255), comment: '路由参数' },
      routeName: { field: 'route_name', type: STRING(50), defaultValue: '', comment: '路由名称' },
      isFrame: { field: 'is_frame', type: INTEGER(1), defaultValue: 1, comment: '是否为外链（0是 1否）' },
      isCache: { field: 'is_cache', type: INTEGER(1), defaultValue: 0, comment: '是否缓存（0缓存 1不缓存）' },
      menuType: { field: 'menu_type', type: CHAR(1), defaultValue: '', comment: '菜单类型（M目录 C菜单 F按钮）' },
      visible: { field: 'visible', type: CHAR(1), defaultValue: '0', comment: '菜单状态（0显示 1隐藏）' },
      status: { field: 'status', type: CHAR(1), defaultValue: '0', comment: '菜单状态（0正常 1停用）' },
      perms: { field: 'perms', type: STRING(100), comment: '权限标识' },
      icon: { field: 'icon', type: STRING(100), defaultValue: '#', comment: '菜单图标' },
      createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
      createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
      updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
      updateTime: { field: 'update_time', type: DATE, comment: '更新时间' },
      remark: { field: 'remark', type: STRING(500), defaultValue: '', comment: '备注' }
    })
    await queryInterface.sequelize.query(`  
      ALTER TABLE sys_menu COMMENT = '菜单权限表';  
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sys_menu')
  }
}
