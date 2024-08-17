'use strict'

module.exports = (app) => {
  const { DATE, STRING, BIGINT, INTEGER, CHAR } = app.Sequelize
  const SysPost = app.model.define('sys_post', {
    postId: { field: 'post_id', type: BIGINT(20), primaryKey: true, autoIncrement: true, allowNull: false, comment: '岗位ID' },
    postCode: {
      field: 'post_code',
      type: STRING(64),
      allowNull: false,
      comment: '岗位编码',
      set(postCode) {
        if (['undefined', 'null', ''].includes('' + postCode)) {
          throw new Error('岗位编码不能为空')
        }
        if (('' + postCode).length > 64) {
          throw new Error('岗位编码长度不能超过64个字符')
        }
        this.setDataValue('postCode', postCode)
      }
    },
    postName: {
      field: 'post_name',
      type: STRING(50),
      allowNull: false,
      comment: '岗位名称',
      set(postName) {
        if (['undefined', 'null', ''].includes('' + postName)) {
          throw new Error('岗位名称不能为空')
        }
        if (('' + postName).length > 50) {
          throw new Error('岗位名称长度不能超过50个字符')
        }
        this.setDataValue('postName', postName)
      }
    },
    postSort: {
      field: 'post_sort',
      type: INTEGER(4),
      allowNull: false,
      comment: '显示顺序',
      set(postSort) {
        if (['undefined', 'null', ''].includes('' + postSort)) {
          throw new Error('显示顺序不能为空')
        }
        this.setDataValue('postSort', postSort)
      }
    },
    status: { field: 'status', type: CHAR(1), allowNull: false, comment: '状态（0正常 1停用）' },
    createBy: { field: 'create_by', type: STRING(64), defaultValue: '', comment: '创建者' },
    createTime: { field: 'create_time', type: DATE, comment: '创建时间' },
    updateBy: { field: 'update_by', type: STRING(64), defaultValue: '', comment: '更新者' },
    updateTime: { field: 'update_time', type: DATE, comment: '更新时间' },
    remark: { field: 'remark', type: STRING(500), comment: '备注' }
  })
  return SysPost
}
