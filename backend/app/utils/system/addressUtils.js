const iconv = require('iconv-lite')
class AddressUtils {
  constructor(curl) {
    this.curl = curl
  }
  /**
   * 获取地址
   *
   * @author ruoyi
   */
  async getRealAddressByIP(ip) {
    try {
      // 内网不查询
      if (ip === '127.0.0.1' || ip === '0:0:0:0:0:0:0:1') {
        return '内网IP'
      }

      let { data } = await this.curl(`http://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true&GBK`)
      if (!data) {
        return 'XX XX'
      }
      data = iconv.decode(data, 'gbk')
      data = JSON.parse(data)
      return `${data.pro} ${data.city}`
    } catch (error) {
      return 'XX XX'
    }
  }
}
module.exports = AddressUtils
