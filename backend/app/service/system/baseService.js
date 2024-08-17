const { Service } = require('egg')
const RedisCache = require('../../utils/system/redisCache.js')
const IdUtils = require('../../utils/system/idUtils.js')
const CacheConstants = require('../../utils/system/cacheConstants.js')
const StringUtils = require('../../utils/system/stringUtils.js')
const Convert = require('../../utils/system/convert.js')
const Constants = require('../../utils/system/constants.js')
const AddressUtils = require('../../utils/system/addressUtils.js')
const CaptchaExpireException = require('../../utils/system/captchaExpireException.js')
const MessageUtils = require('../../utils/system/messageUtils.js')
const CaptchaException = require('../../utils/system/captchaException.js')
const UserNotExistsException = require('../../utils/system/userNotExistsException.js')
const UserConstants = require('../../utils/system/userConstants.js')
const UserPasswordNotMatchException = require('../../utils/system/userPasswordNotMatchException.js')
const IpUtils = require('../../utils/system/ipUtils.js')
const BlackListException = require('../../utils/system/blackListException.js')
const ServiceException = require('../../utils/system/serviceException.js')
const UserStatus = require('../../utils/system/userStatus.js')
const UserPasswordRetryLimitExceedException = require('../../utils/system/userPasswordRetryLimitExceedException.js')
const HttpStatus = require('../../utils/system/httpStatus.js')
const ScheduleConstants = require('../../utils/system/scheduleConstants.js')
const GenConstants = require('../../utils/system/genConstants.js')
const VelocityUtils = require('../../utils/system/velocityUtils.js')
const SqlUtil = require('../../utils/system/sqlUtils.js')
class BaseService extends Service {
  constructor(ctx) {
    super(ctx)
  }
  redisCache = new RedisCache(this.app.redis)
  IdUtils = IdUtils
  CacheConstants = CacheConstants
  StringUtils = StringUtils
  Convert = Convert
  Constants = Constants
  addressUtils = new AddressUtils(this.ctx.curl)
  CaptchaExpireException = CaptchaExpireException
  MessageUtils = MessageUtils
  CaptchaException = CaptchaException
  UserNotExistsException = UserNotExistsException
  UserConstants = UserConstants
  UserPasswordNotMatchException = UserPasswordNotMatchException
  IpUtils = IpUtils
  BlackListException = BlackListException
  ServiceException = ServiceException
  UserStatus = UserStatus
  UserPasswordRetryLimitExceedException = UserPasswordRetryLimitExceedException
  HttpStatus = HttpStatus
  ScheduleConstants = ScheduleConstants
  GenConstants = GenConstants
  VelocityUtils = VelocityUtils
  SqlUtil = SqlUtil
}
module.exports = BaseService
