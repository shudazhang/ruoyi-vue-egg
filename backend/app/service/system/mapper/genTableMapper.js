const { Service } = require('egg')

class GenTableMapper extends Service {
  /**
   * 查询业务列表
   *
   * @param genTable 业务信息
   * @return 业务集合
   */
  selectGenTableList(genTable) {
    const params = {
      where: {}
    }
    if (!['undefined', 'null', ''].includes('' + genTable.pageNum) && !['undefined', 'null', ''].includes('' + genTable.pageSize)) {
      params.offset = parseInt(((genTable.pageNum || 1) - 1) * (genTable.pageSize || 10))
      params.limit = parseInt(genTable.pageSize || 10)
    }
    if (!['undefined', 'null', ''].includes('' + genTable.tableName)) {
      params.where.tableName = {
        [this.app.Sequelize.Op.like]: `%${genTable.tableName}%`
      }
    }
    if (!['undefined', 'null', ''].includes('' + genTable.tableComment)) {
      params.where.tableComment = {
        [this.app.Sequelize.Op.like]: `%${genTable.tableComment}%`
      }
    }
    if (genTable['params[beginTime]'] && genTable['params[endTime]']) {
      params.where.createTime = {
        [this.app.Sequelize.Op.between]: [new Date(genTable['params[beginTime]'] + ' 00:00:00').toISOString().slice(0, 10), new Date(genTable['params[endTime]'] + ' 23:59:59').toISOString().slice(0, 10)]
      }
    }
    if (genTable.params && genTable.params.beginTime && genTable.params.endTime) {
      params.where.createTime = {
        [this.app.Sequelize.Op.between]: [new Date(genTable.params.beginTime + ' 00:00:00').toISOString().slice(0, 10), new Date(genTable.params.endTime + ' 23:59:59').toISOString().slice(0, 10)]
      }
    }
    if (!['undefined', 'null', ''].includes('' + genTable.pageNum) && !['undefined', 'null', ''].includes('' + genTable.pageSize)) {
      return this.app.model.System.GenTable.findAndCountAll(params)
    } else {
      return this.app.model.System.GenTable.findAll(params)
    }
  }
  /**
   * 查询据库列表
   *
   * @param genTable 业务信息
   * @return 数据库表集合
   */
  async selectDbTableList(genTable) {
    let sqlStr = `
    select 
        table_name as tableName, 
        table_comment as tableComment, 
        create_time as createTime, 
        update_time as updateTime
    from information_schema.tables
    where table_schema = (select database())
    AND table_name NOT LIKE 'qrtz\_%' AND table_name NOT LIKE 'gen\_%'
    AND table_name NOT IN (select table_name from gen_table)
      `
    if (genTable.tableName) {
      sqlStr += ` AND lower(table_name) like lower(concat('%', ${genTable.tableName}, '%'))`
    }
    if (genTable.tableComment) {
      sqlStr += ` AND lower(table_comment) like lower(concat('%', ${genTable.tableComment}, '%'))`
    }
    if (genTable['params[beginTime]'] || (genTable.params && genTable.params.beginTime)) {
      sqlStr += ` and date_format(create_time,'%Y%m%d') >= date_format('${genTable['params[beginTime]'] || (genTable.params && genTable.params.beginTime)}','%Y%m%d')`
    }
    if (genTable['params[endTime]'] || (genTable.params && genTable.params.endTime)) {
      sqlStr += ` and date_format(create_time,'%Y%m%d') <= date_format('${genTable['params[endTime]'] || (genTable.params && genTable.params.beginTime)}','%Y%m%d')`
    }
    sqlStr += ` order by create_time desc`
    const result = await this.ctx.model.query(sqlStr, { type: this.app.model.QueryTypes.SELECT })
    if (genTable.pageNum && genTable.pageSize) {
      const offset = parseInt(((genTable.pageNum || 1) - 1) * (genTable.pageSize || 10))
      const limit = parseInt(genTable.pageSize || 10)
      return {
        rows: result.slice(offset, offset + limit),
        count: result.length
      }
    } else {
      return result
    }
  }
  /**
   * 查询据库列表
   *
   * @param tableNames 表名称组
   * @return 数据库表集合
   */
  async selectDbTableListByNames(tableNames) {
    let sqlStr = `
    select 
        table_name as tableName, 
        table_comment as tableComment, 
        create_time as createTime, 
        update_time as updateTime
    from information_schema.tables
    where table_name NOT LIKE 'qrtz\_%' and table_name NOT LIKE 'gen\_%' and table_schema = (select database())
		and table_name in (${tableNames.map((name) => `'${name}'`).join(',')})
   
      `
    return this.ctx.model.query(sqlStr, { type: this.app.model.QueryTypes.SELECT })
  }
  /**
   * 新增业务
   *
   * @param genTable 业务信息
   * @return 结果
   */
  insertGenTable(genTable) {
    return this.app.model.System.GenTable.create({ ...genTable, createTime: new Date() })
  }
  /**
   * 查询表ID业务信息
   *
   * @param id 业务ID
   * @return 业务信息
   */
  selectGenTableById(id) {
    return this.app.model.System.GenTable.findOne({
      where: {
        tableId: id
      },
      include: [
        {
          model: this.app.model.System.GenTableColumn,
          as: 'columns',
          order: [['sort', 'ASC']]
        }
      ]
    })
  }
  /**
   * 查询所有表信息
   *
   * @return 表信息集合
   */
  selectGenTableAll() {
    return this.app.model.System.GenTable.findAll({
      include: [
        {
          model: this.app.model.System.GenTableColumn,
          as: 'columns',
          order: [['sort', 'ASC']]
        }
      ]
    })
  }
  /**
   * 修改业务
   *
   * @param genTable 业务信息
   * @return 结果
   */
  updateGenTable(genTable) {
    return this.app.model.System.GenTable.update(
      { ...genTable, updateTime: new Date() },
      {
        where: {
          tableId: genTable.tableId
        }
      }
    )
  }
  /**
   * 批量删除业务
   *
   * @param ids 需要删除的数据ID
   * @return 结果
   */
  deleteGenTableByIds(ids) {
    return this.app.model.System.GenTable.destroy({
      where: {
        tableId: ids
      }
    })
  }
  /**
   * 查询表名称业务信息
   *
   * @param tableName 表名称
   * @return 业务信息
   */
  selectGenTableByName(tableName) {
    return this.app.model.System.GenTable.findOne({
      where: {
        tableName
      },
      include: [
        {
          model: this.app.model.System.GenTableColumn,
          as: 'columns',
          order: [['sort', 'ASC']]
        }
      ]
    })
  }
  /**
   * 创建表
   *
   * @param sql 表结构
   * @return 结果
   */
  createTable(sql) {
    return this.ctx.model.query(sql, { type: this.app.model.QueryTypes.RAW })
  }
}
module.exports = GenTableMapper
