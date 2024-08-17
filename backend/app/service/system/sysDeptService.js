const BaseService = require('./baseService.js')
class SysRoleService extends BaseService {
  constructor(ctx) {
    super(ctx)
    this.deptMapper = this.ctx.service.system.mapper.sysDeptMapper
    this.securityUtils = this.ctx.service.system.securityUtils
    this.roleMapper = this.ctx.service.system.mapper.sysRoleMapper
    this.dataScopeAspect = this.ctx.service.system.dataScopeAspect

  }
  /**
   * 查询部门管理数据
   *
   * @param dept 部门信息
   * @return 部门信息集合
   */
  async selectDeptList(dept) {
    await this.dataScopeAspect.dataScope('d', '')
    return this.deptMapper.selectDeptList(dept)
  }
  /**
   * 查询部门树结构信息
   *
   * @param dept 部门信息
   * @return 部门树信息集合
   */
  async selectDeptTreeList(dept) {
    const depts = await this.selectDeptList(dept)
    return this.buildDeptTreeSelect(depts)
  }
  /**
   * 构建前端所需要树结构
   *
   * @param depts 部门列表
   * @return 树结构列表
   */
  buildDeptTree(depts) {
    let returnList = []
    const tempList = depts.map((dept) => dept.id)

    for (let dept of depts) {
      // 如果是顶级节点, 遍历该父节点的所有子节点
      if (!tempList.includes(dept.parentId)) {
        this.recursionFn(depts, dept)
        returnList.push(dept)
      }
    }

    if (returnList.length === 0) {
      returnList = [...depts]
    }
    return returnList
  }
  /**
   * 构建前端所需要下拉树结构
   *
   * @param depts 菜单列表
   * @return 下拉树结构列表
   */
  async buildDeptTreeSelect(depts) {
    depts = JSON.parse(JSON.stringify(depts))
    depts = depts.map((item) => {
      return { id: item.deptId, label: item.deptName, parentId: item.parentId }
    })
    let deptTrees = this.buildDeptTree(depts)
    return deptTrees
  }
  /**
   * 根据角色ID查询部门树信息
   *
   * @param roleId 角色ID
   * @return 选中部门列表
   */
  async selectDeptListByRoleId(roleId) {
    const role = await this.roleMapper.selectRoleById(roleId)
    return this.deptMapper.selectDeptListByRoleId(roleId, role.deptCheckStrictly)
  }
  /**
   * 根据部门ID查询信息
   *
   * @param deptId 部门ID
   * @return 部门信息
   */
  selectDeptById(deptId) {
    return this.deptMapper.selectDeptById(deptId)
  }
  /**
   * 根据ID查询所有子部门（正常状态）
   *
   * @param deptId 部门ID
   * @return 子部门数
   */
  selectNormalChildrenDeptById(deptId) {
    return this.deptMapper.selectNormalChildrenDeptById(deptId)
  }

  /**
   * 是否存在子节点
   *
   * @param deptId 部门ID
   * @return 结果
   */
  async hasChildByDeptId(deptId) {
    const result = await this.deptMapper.hasChildByDeptId(deptId)
    return result > 0
  }
  /**
   * 查询部门是否存在用户
   *
   * @param deptId 部门ID
   * @return 结果 true 存在 false 不存在
   */
  async checkDeptExistUser(deptId) {
    const result = await this.deptMapper.checkDeptExistUser(deptId)
    return result > 0
  }
  /**
   * 校验部门名称是否唯一
   *
   * @param dept 部门信息
   * @return 结果
   */
  async checkDeptNameUnique(dept) {
    const deptId = this.StringUtils.isNull(dept.deptId) ? -1 : dept.deptId
    const info = await this.deptMapper.checkDeptNameUnique(dept.deptName, dept.parentId)
    if (this.StringUtils.isNotNull(info) && info.deptId != deptId) {
      return this.UserConstants.NOT_UNIQUE
    }
    return this.UserConstants.UNIQUE
  }
  /**
   * 校验部门是否有数据权限
   *
   * @param deptId 部门id
   */
  async checkDeptDataScope(deptId) {
    if (!this.securityUtils.isAdmin(await this.securityUtils.getUserId()) && this.StringUtils.isNotNull(deptId)) {
      const dept = {}
      dept.deptId = deptId
      const depts = await this.selectDeptList(dept)
      if (this.StringUtils.isEmpty(depts)) {
        throw new this.ServiceException('没有权限访问部门数据！')
      }
    }
  }

  /**
   * 新增保存部门信息
   *
   * @param dept 部门信息
   * @return 结果
   */
  async insertDept(dept) {
    const info = await this.deptMapper.selectDeptById(dept.parentId)
    // 如果父节点不为正常状态,则不允许新增子节点
    if (this.UserConstants.DEPT_NORMAL != info.status) {
      throw new this.ServiceException('部门停用，不允许新增')
    }
    dept.ancestors = info.ancestors + ',' + dept.parentId
    return this.deptMapper.insertDept(dept)
  }

  /**
   * 修改保存部门信息
   *
   * @param dept 部门信息
   * @return 结果
   */
  async updateDept(dept) {
    const newParentDept = await this.deptMapper.selectDeptById(dept.parentId)
    const oldDept = await this.deptMapper.selectDeptById(dept.deptId)
    if (this.StringUtils.isNotNull(newParentDept) && this.StringUtils.isNotNull(oldDept)) {
      const newAncestors = newParentDept.ancestors + ',' + newParentDept.deptId
      const oldAncestors = oldDept.ancestors
      dept.ancestors = newAncestors
      await this.updateDeptChildren(dept.deptId, newAncestors, oldAncestors)
    }
    const result = await this.deptMapper.updateDept(dept)
    if (this.UserConstants.DEPT_NORMAL == dept.status && this.StringUtils.isNotEmpty(dept.ancestors) && !this.StringUtils.equals('0', dept.ancestors)) {
      // 如果该部门是启用状态，则启用该部门的所有上级部门
      await this.updateParentDeptStatusNormal(dept)
    }
    return result
  }
  /**
   * 修改该部门的父级部门状态
   *
   * @param dept 当前部门
   */
  async updateParentDeptStatusNormal(dept) {
    const ancestors = dept.ancestors
    const deptIds = ancestors.split(',')
    await this.deptMapper.updateDeptStatusNormal(deptIds)
  }
  /**
   * 修改子元素关系
   *
   * @param deptId 被修改的部门ID
   * @param newAncestors 新的父ID集合
   * @param oldAncestors 旧的父ID集合
   */
  async updateDeptChildren(deptId, newAncestors, oldAncestors) {
    const children = await this.deptMapper.selectChildrenDeptById(deptId)
    for (const child of children) {
      child.ancestors = child.ancestors.replace(oldAncestors, newAncestors)
    }
    if (children.length > 0) {
      await this.deptMapper.updateDeptChildren(children)
    }
  }

  /**
   * 删除部门管理信息
   *
   * @param deptId 部门ID
   * @return 结果
   */
  deleteDeptById(deptId) {
    return this.deptMapper.deleteDeptById(deptId)
  }

  /**
   * 递归列表
   *
   * @param {Array} list 分类表
   * @param {Object} t 子节点
   */
  recursionFn(list, t) {
    // 得到子节点列表
    const childList = this.getChildList(list, t)
    t.children = childList
    for (const tChild of childList) {
      if (this.hasChild(list, tChild)) {
        this.recursionFn(list, tChild)
      }
    }
  }

  /**
   * 获取子节点列表
   *
   * @param {Array} list 分类表
   * @param {Object} parent 父节点
   * @returns {Array} 子节点列表
   */
  getChildList(list, parent) {
    return list.filter((item) => item.parentId === parent.id)
  }

  /**
   * 判断是否有子节点
   *
   * @param {Array} list 分类表
   * @param {Object} node 节点
   * @returns {boolean} 是否有子节点
   */
  hasChild(list, node) {
    return list.some((item) => item.parentId === node.id)
  }
}
module.exports = SysRoleService
