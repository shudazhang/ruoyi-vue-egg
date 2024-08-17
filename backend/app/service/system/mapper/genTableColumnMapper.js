const { Service } = require('egg')

class GenTableColumnMapper extends Service {
  /**
   * 根据表名称查询列信息
   *
   * @param tableName 表名称
   * @return 列信息
   */
  selectDbTableColumnsByName(tableName) {
    let sqlStr = `
        SELECT 
        column_name as columnName,
        (CASE WHEN (is_nullable = 'NO' AND column_key != 'PRI') THEN '1' ELSE '0' END) AS isRequired,
        (CASE WHEN column_key = 'PRI' THEN '1' ELSE '0' END) AS isPk,
        ordinal_position AS sort,
        column_comment as columnComment,
        (CASE WHEN extra = 'auto_increment' THEN '1' ELSE '0' END) AS isIncrement,
        column_type as columnType
    FROM information_schema.columns
    WHERE table_schema = (SELECT DATABASE())
      AND table_name = '${tableName}'
    ORDER BY ordinal_position
          `
    return this.ctx.model.query(sqlStr, { type: this.app.model.QueryTypes.SELECT })
  }
  /**
   * 新增业务字段
   *
   * @param genTableColumn 业务字段信息
   * @return 结果
   */
  insertGenTableColumn(genTableColumn) {
    return this.app.model.System.GenTableColumn.create({ ...genTableColumn, createTime: new Date() })
  }
  /**
   * 查询业务字段列表
   *
   * @param tableId 业务字段编号
   * @return 业务字段集合
   */
  selectGenTableColumnListByTableId(tableId) {
    return this.app.model.System.GenTableColumn.findAll({
      where: {
        tableId
      },
      order: [['sort', 'ASC']]
    })
  }
  /**
   * 修改业务字段
   *
   * @param genTableColumn 业务字段信息
   * @return 结果
   */
  updateGenTableColumn(genTableColumn) {
    return this.app.model.System.GenTableColumn.update(
      { ...genTableColumn, updateTime: new Date() },
      {
        where: {
          columnId: genTableColumn.columnId
        }
      }
    )
  }
  /**
   * 批量删除业务字段
   *
   * @param ids 需要删除的数据ID
   * @return 结果
   */
  deleteGenTableColumnByIds(ids) {
    return this.app.model.System.GenTableColumn.destroy({
      where: {
        tableId: ids
      }
    })
  }
  /**
   * 删除业务字段
   *
   * @param genTableColumns 列数据
   * @return 结果
   */
  deleteGenTableColumns(genTableColumns) {
    return this.app.model.System.GenTableColumn.destroy({
      where: {
        columnId: genTableColumns.map((item) => item.columnId)
      }
    })
  }
}
module.exports = GenTableColumnMapper
