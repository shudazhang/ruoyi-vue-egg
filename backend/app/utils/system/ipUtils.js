/**
 * 获取IP方法
 *
 * @author ruoyi
 */
class IpUtils {
  static REGX_0_255 = '(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]\\d|\\d)'
  // 匹配 ip
  static REGX_IP = new RegExp(`(${this.REGX_0_255}\\.){3}${this.REGX_0_255}`)
  static REGX_IP_WILDCARD = new RegExp(`(((\\*\\.){3}\\*)|(${this.REGX_0_255}(\\.\\*){3})|(${this.REGX_0_255}\\.${this.REGX_0_255})(\\.\\*){2}|((${this.REGX_0_255}\\.){3}\\*))`)
  // 匹配网段
  static REGX_IP_SEG = new RegExp(`(${this.REGX_IP}-${this.REGX_IP})`)
  /**
   * 是否为IP
   */
  static isIP(ip) {
    return this.REGX_IP.test(ip)
  }
  /**
   * 是否为IP，或 *为间隔的通配符地址
   */
  static isIpWildCard(ip) {
    return this.REGX_IP_WILDCARD.test(ip)
  }
  /**
   * 检测参数是否在ip通配符里
   */
  static ipIsInWildCardNoCheck(ipWildCard, ip) {
    let s1 = ipWildCard.split('.')
    let s2 = ip.split('.')
    let isMatchedSeg = true
    for (let i = 0; i < s1.length && s1[i] !== '*'; i++) {
      if (s1[i] !== s2[i]) {
        isMatchedSeg = false
        break
      }
    }
    return isMatchedSeg
  }
  /**
   * 是否为特定格式如:“10.10.10.1-10.10.10.99”的ip段字符串
   */
  static isIPSegment(ipSeg) {
    return this.REGX_IP_SEG.test(ipSeg)
  }
  /**
   * 判断ip是否在指定网段中
   */
  static ipIsInNetNoCheck(iparea, ip) {
    let idx = iparea.indexOf('-')
    let sips = iparea.substring(0, idx).split('.')
    let sipe = iparea.substring(idx + 1).split('.')
    let sipt = ip.split('.')
    let ips = 0,
      ipe = 0,
      ipt = 0
    for (let i = 0; i < 4; i++) {
      ips = (ips << 8) | parseInt(sips[i])
      ipe = (ipe << 8) | parseInt(sipe[i])
      ipt = (ipt << 8) | parseInt(sipt[i])
    }
    if (ips > ipe) {
      ;[ips, ipe] = [ipe, ips]
    }
    return ips <= ipt && ipt <= ipe
  }
  /**
   * 校验ip是否符合过滤串规则
   *
   * @param filter 过滤IP列表,支持后缀'*'通配,支持网段如:`10.10.10.1-10.10.10.99`
   * @param ip 校验IP地址
   * @return boolean 结果
   */
  static isMatchedIp(filter, ip) {
    if (!filter || !ip) return false
    let ips = filter.split(';')
    for (let iStr of ips) {
      if (this.isIP(iStr) && iStr === ip) return true
      else if (this.isIpWildCard(iStr) && this.ipIsInWildCardNoCheck(iStr, ip)) return true
      else if (this.isIPSegment(iStr) && this.ipIsInNetNoCheck(iStr, ip)) return true
    }
    return false
  }
}

module.exports = IpUtils
