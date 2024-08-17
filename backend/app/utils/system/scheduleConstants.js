/**
 * 任务调度通用常量
 *
 * @author ruoyi
 */
class ScheduleConstants {
  constructor() {
    // 私有化构造函数以防止实例化
  }

  static get TASK_CLASS_NAME() {
    return 'TASK_CLASS_NAME'
  }

  static get TASK_PROPERTIES() {
    return 'TASK_PROPERTIES'
  }

  static get MISFIRE_DEFAULT() {
    return '0'
  }

  static get MISFIRE_IGNORE_MISFIRES() {
    return '1'
  }

  static get MISFIRE_FIRE_AND_PROCEED() {
    return '2'
  }

  static get MISFIRE_DO_NOTHING() {
    return '3'
  }

  static get Status() {
    return {
      NORMAL: '0',
      PAUSE: '1'
    }
  }
}
module.exports = ScheduleConstants