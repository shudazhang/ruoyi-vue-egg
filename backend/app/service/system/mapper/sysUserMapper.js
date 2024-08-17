const { Service } = require('egg')

class SysUserMapper extends Service {
  /**
   * 根据条件分页查询用户列表
   *
   * @param sysUser 用户信息
   * @return 用户信息集合信息
   */
  async selectUserList(user) {
    let sqlStr = `
      select 
        u.user_id as userId, 
        u.dept_id as deptId, 
        u.nick_name as nickName, 
        u.user_name as userName, 
        u.email, 
        u.avatar, 
        u.phonenumber, 
        u.sex, 
        u.status, 
        u.del_flag as delFlag, 
        u.login_ip as loginIp, 
        u.login_date as loginDate, 
        u.create_by as createBy, 
        u.create_time as createTime, 
        u.remark, 
        d.dept_name as deptName, 
        d.leader,
        JSON_OBJECT(
          'deptId', d.dept_id,
          'parentId', d.parent_id,
          'deptName', d.dept_name,
          'ancestors', d.ancestors,
          'orderNum', d.order_num,
          'leader', d.leader,
          'status', d.status
        ) as dept
      from sys_user u
        left join sys_dept d on u.dept_id = d.dept_id
      where u.del_flag = '0'
      `
    if (user.userId && user.userId != 0) {
      sqlStr += ` AND u.user_id = '${user.userId}'`
    }
    if (user.userName) {
      sqlStr += ` AND u.user_name like concat('%', '${user.userName}', '%')`
    }
    if (!['undefined', 'null', ''].includes('' + user.status)) {
      sqlStr += ` and u.status = '${user.status}'`
    }
    if (user.phonenumber) {
      sqlStr += ` AND u.phonenumber like concat('%', '${user.phonenumber}', '%')`
    }
    if (user['params[beginTime]'] || (user.params && user.params.beginTime)) {
      sqlStr += ` and date_format(u.create_time,'%Y%m%d') >= date_format('${user['params[beginTime]'] || (user.params && user.params.beginTime)}','%Y%m%d')`
    }
    if (user['params[endTime]'] || (user.params && user.params.endTime)) {
      sqlStr += ` and date_format(u.create_time,'%Y%m%d') <= date_format('${user['params[endTime]'] || (user.params && user.params.beginTime)}','%Y%m%d')`
    }
    if (user.deptId && user.deptId != 0) {
      sqlStr += ` AND (u.dept_id = '${user.deptId}' OR u.dept_id IN ( SELECT t.dept_id FROM sys_dept t WHERE find_in_set('${user.deptId}', ancestors) ))`
    }

    if (this.ctx.params.dataScope) {
      sqlStr += ` ${this.ctx.params.dataScope}`
    }
    const result = await this.ctx.model.query(sqlStr, { type: this.app.model.QueryTypes.SELECT })
    if (user.pageNum && user.pageSize) {
      const offset = parseInt(((user.pageNum || 1) - 1) * (user.pageSize || 10))
      const limit = parseInt(user.pageSize || 10)
      return {
        rows: result.slice(offset, offset + limit),
        count: result.length
      }
    } else {
      return result
    }
  }
  /**
   * 根据条件分页查询已配用户角色列表
   *
   * @param user 用户信息
   * @return 用户信息集合信息
   */
  async selectAllocatedList(user) {
    let sqlStr = `select distinct
      u.user_id as userId, 
      u.dept_id as deptId, 
      u.nick_name as nickName, 
      u.user_name as userName, 
      u.email, 
      u.phonenumber, 
      u.status, 
      u.create_time as createTime, 
      JSON_OBJECT(
        'deptId', d.dept_id,
        'parentId', d.parent_id,
        'deptName', d.dept_name,
        'ancestors', d.ancestors,
        'orderNum', d.order_num,
        'leader', d.leader,
        'status', d.status
      ) as dept,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'roleId', r.role_id,
          'roleName', r.role_name,
          'roleKey', r.role_key,
          'roleSort', r.role_sort,
          'dataScope', r.data_scope,
          'status', r.status
        )
      ) as roles
      from sys_user u
      left join sys_dept d on u.dept_id = d.dept_id
      left join sys_user_role ur on u.user_id = ur.user_id
      left join sys_role r on r.role_id = ur.role_id
    where u.del_flag = '0' and r.role_id = ${user.roleId}
    `
    if (user.userName) {
      sqlStr += ` AND u.user_name like concat('%', '${user.userName}', '%')`
    }
    if (user.phonenumber) {
      sqlStr += ` AND u.phonenumber like concat('%', '${user.phonenumber}', '%')`
    }
    if (this.ctx.params.dataScope) {
      sqlStr += ` ${this.ctx.params.dataScope}`
    }
    sqlStr += ` GROUP BY 
    u.user_id, 
    u.dept_id, 
    u.nick_name, 
    u.user_name, 
    u.email, 
    u.avatar, 
    u.phonenumber, 
    u.status, 
    u.create_time, 
    d.dept_id, 
    d.parent_id, 
    d.dept_name, 
    d.ancestors, 
    d.order_num, 
    d.leader, 
    d.status `
    const result = await this.ctx.model.query(sqlStr, { type: this.app.model.QueryTypes.SELECT })
    if (user.pageNum && user.pageSize) {
      const offset = parseInt(((user.pageNum || 1) - 1) * (user.pageSize || 10))
      const limit = parseInt(user.pageSize || 10)
      return {
        rows: result.slice(offset, offset + limit),
        count: result.length
      }
    } else {
      return result
    }
  }
  /**
   * 根据条件分页查询未分配用户角色列表
   *
   * @param user 用户信息
   * @return 用户信息集合信息
   */
  async selectUnallocatedList(user) {
    let sqlStr = `select distinct
    u.user_id as userId, 
    u.dept_id as deptId, 
    u.nick_name as nickName, 
    u.user_name as userName, 
    u.email, 
    u.phonenumber, 
    u.status, 
    u.create_time as createTime, 
    JSON_OBJECT(
      'deptId', d.dept_id,
      'parentId', d.parent_id,
      'deptName', d.dept_name,
      'ancestors', d.ancestors,
      'orderNum', d.order_num,
      'leader', d.leader,
      'status', d.status
    ) as dept,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'roleId', r.role_id,
        'roleName', r.role_name,
        'roleKey', r.role_key,
        'roleSort', r.role_sort,
        'dataScope', r.data_scope,
        'status', r.status
      )
    ) as roles
    from sys_user u
    left join sys_dept d on u.dept_id = d.dept_id
    left join sys_user_role ur on u.user_id = ur.user_id
    left join sys_role r on r.role_id = ur.role_id
    where u.del_flag = '0' and (r.role_id != '${user.roleId}' or r.role_id IS NULL)
    and u.user_id not in (select u.user_id from sys_user u inner join sys_user_role ur on u.user_id = ur.user_id and ur.role_id = '${user.roleId}')
  `
    if (user.userName) {
      sqlStr += ` AND u.user_name like concat('%', '${user.userName}', '%')`
    }
    if (user.phonenumber) {
      sqlStr += ` AND u.phonenumber like concat('%', '${user.phonenumber}', '%')`
    }
    if (this.ctx.params.dataScope) {
      sqlStr += ` ${this.ctx.params.dataScope}`
    }
    sqlStr += ` GROUP BY 
      u.user_id, 
      u.dept_id, 
      u.nick_name, 
      u.user_name, 
      u.email, 
      u.avatar, 
      u.phonenumber, 
      u.status, 
      u.create_time, 
      d.dept_id, 
      d.parent_id, 
      d.dept_name, 
      d.ancestors, 
      d.order_num, 
      d.leader, 
      d.status `
    const result = await this.ctx.model.query(sqlStr, { type: this.app.model.QueryTypes.SELECT })
    if (user.pageNum && user.pageSize) {
      const offset = parseInt(((user.pageNum || 1) - 1) * (user.pageSize || 10))
      const limit = parseInt(user.pageSize || 10)
      return {
        rows: result.slice(offset, offset + limit),
        count: result.length
      }
    } else {
      return result
    }
  }
  /**
   * 通过用户名查询用户
   *
   * @param userName 用户名
   * @return 用户对象信息
   */

  async selectUserByUserName(userName) {
    return this.app.model.System.SysUser.findOne({
      where: {
        userName: userName,
        delFlag: '0'
      },
      include: [
        {
          model: this.app.model.System.SysDept,
          as: 'dept',
          required: false // 设置为 false 表示这是左连接
        },
        {
          model: this.app.model.System.SysRole,
          as: 'roles',
          through: { attributes: [] } // 排除通过表的属性
        }
      ]
    })
  }
  /**
   * 通过用户ID查询用户
   *
   * @param userId 用户ID
   * @return 用户对象信息
   */
  selectUserById(userId) {
    return this.app.model.System.SysUser.findOne({
      where: {
        userId: userId
      },
      include: [
        {
          model: this.app.model.System.SysDept,
          as: 'dept',
          required: false // 设置为 false 表示这是左连接
        },
        {
          model: this.app.model.System.SysRole,
          as: 'roles',
          through: { attributes: [] } // 排除通过表的属性
        }
      ]
    })
  }
  /**
   * 新增用户信息
   *
   * @param user 用户信息
   * @return 结果
   */
  insertUser(user) {
    return this.app.model.System.SysUser.create({ ...user, createTime: new Date() })
  }
  /**
   * 修改用户信息
   *
   * @param user 用户信息
   * @return 结果
   */
  async updateUser(user) {
    if(!user.password){
      delete user.password
    }
    return this.app.model.System.SysUser.update(
      { ...user, updateTime: new Date() },
      {
        where: {
          userId: user.userId
        }
      }
    )
  }
  /**
   * 修改用户头像
   *
   * @param userName 用户名
   * @param avatar 头像地址
   * @return 结果
   */
  updateUserAvatar(userName, avatar) {
    return this.app.model.System.SysUser.update(
      {
        avatar: avatar
      },
      {
        where: {
          userName: userName
        }
      }
    )
  }
  /**
   * 重置用户密码
   *
   * @param userName 用户名
   * @param password 密码
   * @return 结果
   */
  resetUserPwd(userName, password) {
    return this.app.model.System.SysUser.update(
      {
        password: password
      },
      {
        where: {
          userName: userName
        }
      }
    )
  }
  /**
   * 通过用户ID删除用户
   *
   * @param userId 用户ID
   * @return 结果
   */
  deleteUserById(userId) {
    return this.app.model.System.SysUser.update(
      {
        delFlag: '2'
      },
      { where: { userId: userId } }
    )
  }
  /**
   * 批量删除用户信息
   *
   * @param userIds 需要删除的用户ID
   * @return 结果
   */
  deleteUserByIds(userIds) {
    return this.app.model.System.SysUser.update(
      {
        delFlag: '2'
      },
      { where: { userId: userIds } }
    )
  }
  /**
   * 校验用户名称是否唯一
   *
   * @param userName 用户名称
   * @return 结果
   */
  checkUserNameUnique(userName) {
    return this.app.model.System.SysUser.findOne({
      attributes: ['userId', 'userName'],
      where: {
        userName: userName,
        delFlag: '0'
      },
      include: [
        {
          model: this.app.model.System.SysDept,
          as: 'dept',
          required: false // 设置为 false 表示这是左连接
        },
        {
          model: this.app.model.System.SysRole,
          as: 'roles',
          through: { attributes: [] } // 排除通过表的属性
        }
      ]
    })
  }
  /**
   * 校验手机号码是否唯一
   *
   * @param phonenumber 手机号码
   * @return 结果
   */
  checkPhoneUnique(phonenumber) {
    return this.app.model.System.SysUser.findOne({
      attributes: ['userId', 'phonenumber'],
      where: {
        phonenumber: phonenumber,
        delFlag: '0'
      },
      include: [
        {
          model: this.app.model.System.SysDept,
          as: 'dept',
          required: false // 设置为 false 表示这是左连接
        },
        {
          model: this.app.model.System.SysRole,
          as: 'roles',
          through: { attributes: [] } // 排除通过表的属性
        }
      ]
    })
  }
  /**
   * 校验email是否唯一
   *
   * @param email 用户邮箱
   * @return 结果
   */
  checkEmailUnique(email) {
    return this.app.model.System.SysUser.findOne({
      attributes: ['userId', 'email'],
      where: {
        email: email,
        delFlag: '0'
      },
      include: [
        {
          model: this.app.model.System.SysDept,
          as: 'dept',
          required: false // 设置为 false 表示这是左连接
        },
        {
          model: this.app.model.System.SysRole,
          as: 'roles',
          through: { attributes: [] } // 排除通过表的属性
        }
      ]
    })
  }
}
module.exports = SysUserMapper
