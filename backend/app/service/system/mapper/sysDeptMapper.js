const { Service } = require('egg')

class SysDeptMapper extends Service {
  /**
   * 查询部门管理数据
   *
   * @param dept 部门信息
   * @return 部门信息集合
   */
  async selectDeptList(dept) {
    let sqlStr = `
      select 
          d.dept_id as deptId,
          d.parent_id as parentId,
          d.ancestors as ancestors,
          d.dept_name as deptName,
          d.order_num as orderNum,
          d.leader as leader,
          d.phone as phone,
          d.email as email,
          d.status as status,
          d.del_flag as delFlag,
          d.create_by as createBy,
          d.create_time as createTime,
          d.update_by as updateBy,
          d.update_time as updateTime
      from sys_dept d 
      where d.del_flag = '0'
      `
    if (dept.deptId) {
      sqlStr += ` and dept_id = '${dept.deptId}'`
    }
    if (dept.parentId && dept.parentId != 0) {
      sqlStr += ` and parent_id = '${dept.parentId}'`
    }
    if (dept.deptName) {
      sqlStr += ` and dept_name like concat('%', '${dept.deptName}', '%')`
    }
    if (!['undefined', 'null', ''].includes('' + dept.status)) {
      sqlStr += ` and status = '${dept.status}'`
    }
    if (this.ctx.params.dataScope) {
      sqlStr += ` ${this.ctx.params.dataScope}`
    }
    sqlStr += ` order by d.parent_id, d.order_num`
    const result = await this.ctx.model.query(sqlStr, { type: this.app.model.QueryTypes.SELECT })
    if (dept.pageNum && dept.pageSize) {
      const offset = parseInt(((dept.pageNum || 1) - 1) * (dept.pageSize || 10))
      const limit = parseInt(dept.pageSize || 10)
      return {
        rows: result.slice(offset, offset + limit),
        count: result.length
      }
    } else {
      return result
    }
  }
  /**
   * 根据角色ID查询部门树信息
   *
   * @param roleId 角色ID
   * @param deptCheckStrictly 部门树选择项是否关联显示
   * @return 选中部门列表
   */
  async selectDeptListByRoleId(roleId, deptCheckStrictly) {
    const roleDepts = await this.app.model.System.SysRoleDept.findAll({
      where: {
        roleId: roleId
      }
    })
    const deptIds = roleDepts.map((item) => item.deptId)
    let deptList = await this.app.model.System.SysDept.findAll({
      attributes: ['deptId'],
      where: {
        deptId: deptIds
      },
      order: [
        ['parentId', 'asc'],
        ['orderNum', 'asc']
      ]
    })
    if (deptCheckStrictly) {
      const parentIds = deptList.map((item) => item.parentId)
      deptList = deptList.filter((item) => !parentIds.includes(item.deptId))
    }
    return deptList.map((item) => item.deptId)
  }
  /**
   * 根据部门ID查询信息
   *
   * @param deptId 部门ID
   * @return 部门信息
   */
  async selectDeptById(deptId) {
    const dept = await this.app.model.System.SysDept.findOne({
      where: {
        deptId: deptId
      }
    })
    const parentDept = await this.app.model.System.SysDept.findOne({
      where: {
        deptId: dept.parentId
      }
    })
    if (parentDept) {
      dept.dataValues.parentName = parentDept.deptName
      dept.parentName = parentDept.deptName
    }
    return dept
  }
  /**
   * 根据ID查询所有子部门
   *
   * @param deptId 部门ID
   * @return 部门列表
   */
  async selectChildrenDeptById(deptId) {
    const list = await this.app.model.System.SysDept.findAll()
    return list.filter((item) => item.ancestors && item.ancestors.split(',').some((item) => item == deptId))
  }
  /**
   * 根据ID查询所有子部门（正常状态）
   *
   * @param deptId 部门ID
   * @return 子部门数
   */
  async selectNormalChildrenDeptById(deptId) {
    const list = await this.app.model.System.SysDept.findAll({
      where: {
        status: '0',
        delFlag: '0'
      }
    })
    return list.filter((item) => item.ancestors && item.ancestors.split(',').some((item) => item == deptId)).length
  }
  /**
   * 是否存在子节点
   *
   * @param deptId 部门ID
   * @return 结果
   */
  hasChildByDeptId(deptId) {
    return this.app.model.System.SysDept.count({ where: { delFlag: '0', parentId: deptId } })
  }
  /**
   * 查询部门是否存在用户
   *
   * @param deptId 部门ID
   * @return 结果
   */
  checkDeptExistUser(deptId) {
    return this.app.model.System.SysUser.count({ where: { deptId: deptId, delFlag: '0' } })
  }
  /**
   * 校验部门名称是否唯一
   *
   * @param deptName 部门名称
   * @param parentId 父部门ID
   * @return 结果
   */
  checkDeptNameUnique(deptName, parentId) {
    return this.app.model.System.SysDept.findOne({
      where: {
        deptName: deptName,
        parentId: parentId,
        delFlag: '0'
      }
    })
  }
  /**
   * 新增部门信息
   *
   * @param dept 部门信息
   * @return 结果
   */
  insertDept(dept) {
    return this.app.model.System.SysDept.create({ ...dept, createTime: new Date() })
  }
  /**
   * 修改部门信息
   *
   * @param dept 部门信息
   * @return 结果
   */
  updateDept(dept) {
    return this.app.model.System.SysDept.update(
      { ...dept, updateTime: new Date() },
      {
        where: {
          deptId: dept.deptId
        }
      }
    )
  }
  /**
   * 修改所在部门正常状态
   *
   * @param deptIds 部门ID组
   */
  updateDeptStatusNormal(deptIds) {
    return this.app.model.System.SysDept.update(
      { status: '0' },
      {
        where: {
          deptId: deptIds
        }
      }
    )
  }
  /**
   * 修改子元素关系
   *
   * @param depts 子元素
   * @return 结果
   */
  async updateDeptChildren(depts) {
    for (const dept of depts) {
      await this.app.model.System.SysDept.update({ ancestors: dept.ancestors }, { where: { deptId: dept.deptId } })
    }
  }

  /**
   * 删除部门管理信息
   *
   * @param deptId 部门ID
   * @return 结果
   */
  deleteDeptById(deptId) {
    return this.app.model.System.SysDept.update({ delFlag: '2' }, { where: { deptId: deptId } })
  }
}
module.exports = SysDeptMapper
