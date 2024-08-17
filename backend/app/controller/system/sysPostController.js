const BaseController = require('./baseController.js')
const ExcelJS = require('exceljs')
/**
 * 岗位信息操作处理
 * 
 * @author ruoyi
 */
class SysPostController extends BaseController {
  constructor(ctx) {
    super(ctx)
    this.postService = this.ctx.service.system.sysPostService
  }
  /**
   * 获取岗位列表
   */
  async list() {
    try {
      const post = this.ctx.query
      const list = await this.postService.selectPostList(post)
      this.ctx.body = this.getDataTable(list)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  async export() {
    try {
      const post = this.ctx.request.body
      const list = await this.postService.selectPostList(post)
      // 创建工作簿
      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('岗位数据')

      // 添加表头
      sheet.columns = [
        { header: '岗位序号', key: 'postId' },
        { header: '岗位编码', key: 'postCode' },
        { header: '岗位名称', key: 'postName' },
        { header: '岗位排序', key: 'postSort' },
        { header: '状态', key: 'status' }
      ]

      // 添加数据
      list.rows.forEach((item) => {
        item.status = item.status === '0' ? '正常' : '停用'
        sheet.addRow(item)
      })

      // 定义响应的形式
      const fileName = 'sys_post.xlsx'
      this.ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      this.ctx.set('Content-Disposition', `attachment; filename=${encodeURIComponent(fileName)}`)

      // 将Excel文件流输出到HTTP响应
      // 使用 writeBuffer 方法并等待Promise完成
      this.ctx.body = await workbook.xlsx.writeBuffer()
      this.ctx.status = 200
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 根据岗位编号获取详细信息
   */
  async getInfo() {
    try {
      const postId = this.ctx.params.postId
      this.ctx.body = this.success(await this.postService.selectPostById(postId))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 新增岗位
   */
  async add() {
    try {
      const post = this.ctx.request.body
      if (!(await this.postService.checkPostNameUnique(post))) {
        return (this.ctx.body = this.error("新增岗位'" + post.postName + "'失败，岗位名称已存在"))
      } else if (!(await this.postService.checkPostCodeUnique(post))) {
        return (this.ctx.body = this.error("新增岗位'" + post.postName + "'失败，岗位编码已存在"))
      }
      post.createBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.postService.insertPost(post))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 修改岗位
   */
  async edit() {
    try {
      const post = this.ctx.request.body
      if (!(await this.postService.checkPostNameUnique(post))) {
        return (this.ctx.body = this.error("修改岗位'" + post.postName + "'失败，岗位名称已存在"))
      } else if (!(await this.postService.checkPostCodeUnique(post))) {
        return (this.ctx.body = this.error("修改岗位'" + post.postName + "'失败，岗位编码已存在"))
      }
      post.updateBy = await this.getUsername()
      this.ctx.body = this.toAjax(await this.postService.updatePost(post))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 删除岗位
   */
  async remove() {
    try {
      const postIds = this.ctx.params.postIds.split(',')
      this.ctx.body = this.toAjax(await this.postService.deletePostByIds(postIds))
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  /**
   * 获取岗位选择框列表
   */
  async optionselect() {
    try {
      const posts = await this.postService.selectPostAll()
      this.ctx.body = this.success(posts)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
}
module.exports = SysPostController
