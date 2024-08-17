class UserStatus {
  static OK = {
    code: '0',
    info: '正常'
  }
  static DISABLE = {
    code: '1',
    info: '停用'
  }
  static DELETED = {
    code: '2',
    info: '删除'
  }
}

module.exports = UserStatus
