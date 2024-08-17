'use strict'

module.exports = (app) => {
  const { INTEGER, DATE, STRING, BIGINT, CHAR } = app.Sequelize
  const SysDept = app.model.define('sys_dept', {
    deptId: { field: 'dept_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '部门id' },
    parentId: { field: 'parent_id', type: BIGINT(20), defaultValue: 0, comment: '父部门id' },
    ancestors: { field: 'ancestors', type: STRING(50), defaultValue: '', comment: '祖级列表' },
    deptName: {
      field: 'dept_name',
      type: STRING(30),
      defaultValue: '',
      comment: '部门名称',
      set(deptName) {
        if (['undefined', 'null', ''].includes('' + deptName)) {
          throw new Error('部门名称不能为空')
        }
        if (('' + deptName).length > 30) {
          throw new Error('部门名称长度不能超过30个字符')
        }
        this.setDataValue('deptName', deptName)
      }
    },
    orderNum: {
      field: 'order_num',
      type: INTEGER(4),
      defaultValue: 0,
      comment: '显示顺序',
      set(orderNum) {
        if (['undefined', 'null', ''].includes('' + orderNum)) {
          throw new Error('显示顺序不能为空')
        }
        this.setDataValue('orderNum', orderNum)
      }
    },
    leader: { field: 'leader', type: STRING(20), comment: '负责人' },
    phone: {
      field: 'phone',
      type: STRING(11),
      comment: '联系电话',
      set(phone) {
        if (('' + phone).length > 11) {
          throw new Error('联系电话长度不能超过11个字符')
        }
        this.setDataValue('phone', phone)
      }
    },
    email: {
      field: 'email',
      type: STRING(50),
      comment: '邮箱',
      set(email) {
        if (('' + email).length > 50) {
          throw new Error('邮箱长度不能超过50个字符')
        }
        this.setDataValue('email', email)
      }
    },
    status: { field: 'status', type: CHAR(1), defaultValue: '0', comment: '部门状态（0正常 1停用）' },
    delFlag: { field: 'del_flag', type: CHAR(1), defaultValue: '0', comment: '删除标志（0代表存在 2代表删除）' },
    createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
    createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
    updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
    updateTime: { field: 'update_time', type: DATE, comment: '更新时间' }
  })
  SysDept.associate = () => {
    SysDept.hasMany(app.model.System.SysUser, { foreignKey: 'deptId' });
  };
  return SysDept
}
