/**
 * 用户常量信息
 *
 * @author ruoyi
 */
class UserConstants {
  /**
   * 平台内系统用户的唯一标志
   */
  static SYS_USER = 'SYS_USER'

  /** 正常状态 */
  static NORMAL = '0'

  /** 异常状态 */
  static EXCEPTION = '1'

  /** 用户封禁状态 */
  static USER_DISABLE = '1'

  /** 角色封禁状态 */
  static ROLE_DISABLE = '1'

  /** 部门正常状态 */
  static DEPT_NORMAL = '0'

  /** 部门停用状态 */
  static DEPT_DISABLE = '1'

  /** 字典正常状态 */
  static DICT_NORMAL = '0'

  /** 是否为系统默认（是） */
  static YES = 'Y'

  /** 是否菜单外链（是） */
  static YES_FRAME = '0'

  /** 是否菜单外链（否） */
  static NO_FRAME = '1'

  /** 菜单类型（目录） */
  static TYPE_DIR = 'M'

  /** 菜单类型（菜单） */
  static TYPE_MENU = 'C'

  /** 菜单类型（按钮） */
  static TYPE_BUTTON = 'F'

  /** Layout组件标识 */
  static LAYOUT = 'Layout'

  /** ParentView组件标识 */
  static PARENT_VIEW = 'ParentView'

  /** InnerLink组件标识 */
  static INNER_LINK = 'InnerLink'

  /** 校验是否唯一的返回标识 */
  static UNIQUE = true
  static NOT_UNIQUE = false

  /**
   * 用户名长度限制
   */
  static USERNAME_MIN_LENGTH = 2
  static USERNAME_MAX_LENGTH = 20

  /**
   * 密码长度限制
   */
  static PASSWORD_MIN_LENGTH = 5
  static PASSWORD_MAX_LENGTH = 20
}

module.exports = UserConstants
