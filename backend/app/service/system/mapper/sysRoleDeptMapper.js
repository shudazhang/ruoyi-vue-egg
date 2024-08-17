const { Service } = require('egg')

class SysRoleDeptMapper extends Service {
  /**
   * 通过角色ID删除角色和部门关联
   *
   * @param roleId 角色ID
   * @return 结果
   */
  deleteRoleDeptByRoleId(roleId) {
    return this.app.model.System.SysRoleDept.destroy({ where: { roleId: roleId } })
  }
  /**
   * 批量删除角色部门关联信息
   *
   * @param ids 需要删除的数据ID
   * @return 结果
   */
  deleteRoleDept(ids) {
    return this.app.model.System.SysRoleDept.destroy({ where: { roleId: ids } })
  }
  /**
   * 查询部门使用数量
   *
   * @param deptId 部门ID
   * @return 结果
   */
  selectCountRoleDeptByDeptId(deptId) {
    return this.app.model.System.SysRoleDept.count({ where: { deptId: deptId } })
  }
  /**
   * 批量新增角色部门信息
   *
   * @param roleDeptList 角色部门列表
   * @return 结果
   */
  batchRoleDept(roleDeptList) {
    return this.app.model.System.SysRoleDept.bulkCreate(roleDeptList)
  }
}
module.exports = SysRoleDeptMapper
