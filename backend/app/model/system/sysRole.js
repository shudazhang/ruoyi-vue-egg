'use strict'

module.exports = (app) => {
  const { INTEGER, DATE, STRING, BIGINT, CHAR, TINYINT, VIRTUAL } = app.Sequelize
  const SysRole = app.model.define('sys_role', {
    roleId: { field: 'role_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '角色ID' },
    roleName: {
      field: 'role_name',
      type: STRING(30),
      allowNull: false,
      comment: '角色名称',
      set(roleName) {
        if (['undefined', 'null', ''].includes('' + roleName)) {
          throw new Error('角色名称不能为空')
        }
        if (('' + roleName).length > 30) {
          throw new Error('角色名称长度不能超过30个字符')
        }
        this.setDataValue('roleName', roleName)
      }
    },
    roleKey: {
      field: 'role_key',
      type: STRING(100),
      allowNull: false,
      comment: '角色权限字符串',
      set(roleKey) {
        if (['undefined', 'null', ''].includes('' + roleKey)) {
          throw new Error('权限字符不能为空')
        }
        if (('' + roleKey).length > 100) {
          throw new Error('权限字符长度不能超过100个字符')
        }
        this.setDataValue('roleKey', roleKey)
      }
    },
    roleSort: {
      field: 'role_sort',
      type: INTEGER(4),
      allowNull: false,
      comment: '显示顺序',
      set(roleSort) {
        if (['undefined', 'null', ''].includes('' + roleSort)) {
          throw new Error('显示顺序不能为空')
        }
        this.setDataValue('roleSort', roleSort)
      }
    },
    dataScope: { field: 'data_scope', type: CHAR(1), defaultValue: '1', comment: '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）' },
    menuCheckStrictly: {
      field: 'menu_check_strictly',
      type: TINYINT(1),
      defaultValue: 1,
      comment: '菜单树选择项是否关联显示（ 0：父子不互相关联显示 1：父子互相关联显示）',
      get() {
        return this.getDataValue('menuCheckStrictly') == 1
      },
      set(value) {
        this.setDataValue('menuCheckStrictly', value === false ? 0 : 1)
      }
    },
    deptCheckStrictly: {
      field: 'dept_check_strictly',
      type: TINYINT(1),
      defaultValue: 1,
      comment: '部门树选择项是否关联显示（0：父子不互相关联显示 1：父子互相关联显示 ）',
      get() {
        return this.getDataValue('deptCheckStrictly') == 1
      },
      set(value) {
        this.setDataValue('deptCheckStrictly', value === false ? 0 : 1)
      }
    },
    status: { field: 'status', type: CHAR(1), allowNull: false, comment: '角色状态（0正常 1停用）' },
    delFlag: { field: 'del_flag', type: CHAR(1), defaultValue: '0', comment: '删除标志（0代表存在 2代表删除）' },
    createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
    createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
    updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
    updateTime: { field: 'update_time', type: DATE, comment: '更新时间' },
    remark: { field: 'remark', type: STRING(500), comment: '备注' }
  })
  SysRole.associate = () => {
    SysRole.belongsToMany(app.model.System.SysUser, {
      through: app.model.System.SysUserRole,
      foreignKey: 'roleId',
      otherKey: 'userId',
      as: 'users'
    })
  }
  return SysRole
}
