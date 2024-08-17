const BaseController = require('./baseController.js')
/**
 * 部门信息
 *
 * @author ruoyi
 */
class SysDeptController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.deptService = this.ctx.service.system.sysDeptService
  }
  /**
   * 获取部门列表
   */
  async list() {
    try {
      const dept = this.ctx.query
      const depts = await this.deptService.selectDeptList(dept)
      this.ctx.body = this.success(depts)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 查询部门列表（排除节点）
   */
  async excludeChild() {
    try {
      const deptId = this.ctx.params.deptId
      let depts = await this.deptService.selectDeptList({})
      depts = depts.filter(d => !(d.deptId == deptId || ('' + d.ancestors).split(',').includes(deptId + '')));
      this.ctx.body = this.success(depts)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 根据部门编号获取详细信息
   */
  async getInfo() {
    try {
      const deptId = this.ctx.params.deptId
      await this.deptService.checkDeptDataScope(deptId)
      this.ctx.body = this.success(await this.deptService.selectDeptById(deptId))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 新增部门
   */
  async add() {
    try {
      const dept = this.ctx.request.body
      if (!(await this.deptService.checkDeptNameUnique(dept))) {
        return (this.ctx.body = this.error("新增部门'" + dept.deptName + "'失败，部门名称已存在"))
      }
      dept.createBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.deptService.insertDept(dept))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 修改部门
   */
  async edit() {
    try {
      const dept = this.ctx.request.body
      const deptId = dept.deptId
      await this.deptService.checkDeptDataScope(deptId)
      if (!(await this.deptService.checkDeptNameUnique(dept))) {
        return (this.ctx.body = this.error("修改部门'" + dept.deptName + "'失败，部门名称已存在"))
      } else if (dept.parentId == deptId) {
        return (this.ctx.body = this.error("修改部门'" + dept.deptName + "'失败，上级部门不能是自己"))
      } else if (this.StringUtils.equals(this.UserConstants.DEPT_DISABLE, dept.status) && (await this.deptService.selectNormalChildrenDeptById(deptId)) > 0) {
        return (this.ctx.body = this.error('该部门包含未停用的子部门！'))
      }
      dept.updateBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.deptService.updateDept(dept))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 删除部门
   */
  async remove() {
    try {
      const deptId = this.ctx.params.deptId

      if (await this.deptService.hasChildByDeptId(deptId)) {
        return (this.ctx.body = this.warn('存在下级部门,不允许删除'))
      }
      if (await this.deptService.checkDeptExistUser(deptId)) {
        return (this.ctx.body = this.warn('部门存在用户,不允许删除'))
      }
      await this.deptService.checkDeptDataScope(deptId)
      this.ctx.body = this.toAjax(await this.deptService.deleteDeptById(deptId))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}
module.exports = SysDeptController
