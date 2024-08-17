class Seq {
  static commSeq = 1 // 通用序列数
  static uploadSeq = 1 // 上传序列数
  static machineCode = 'A' // 机器标识
  static commSeqType = 'COMMON'
  static uploadSeqType = 'UPLOAD'
  /**
   * 获取通用序列号
   *
   * @returns {string} 序列值
   */
  static getId0() {
    return this.getId1(Seq.commSeqType)
  }

  /**
   * 默认16位序列号 yyMMddHHmmss + 一位机器标识 + 3长度循环递增字符串
   *
   * @param {string} type - 序列类型
   * @returns {string} 序列值
   */
  static getId1(type) {
    let seq = this.commSeq
    if (type === Seq.uploadSeqType) {
      seq = this.uploadSeq
    }
    return this.getId2(seq, 3)
  }

  /**
   * 通用接口序列号 yyMMddHHmmss + 一位机器标识 + length长度循环递增字符串
   *
   * @param {number} seq - 序列数
   * @param {number} length - 数值长度
   * @returns {string} 序列值
   */
  static getId2(seq, length) {
    const datePart = this.getCurrentDateTime()
    const seqPart = this.getNextSeq(seq, length)
    return `${datePart}${this.machineCode}${seqPart}`
  }

  /**
   * 序列循环递增字符串 [1, 10 的 (length)幂次方), 用0左补齐length位数
   *
   * @param {number} seq - 序列数
   * @param {number} length - 数值长度
   * @returns {string} 序列值
   */
  static getNextSeq(seq, length) {
    const maxSeq = Math.pow(10, length)
    const nextValue = seq
    seq = (seq + 1) % maxSeq
    if (seq === this.commSeq) {
      this.commSeq = seq
    } else {
      this.uploadSeq = seq
    }
    return this.padStart(nextValue, length)
  }

  /**
   * 获取当前时间的字符串表示形式 yyMMddHHmmss
   *
   * @returns {string} 当前时间字符串
   */
  static getCurrentDateTime() {
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = this.padStart(now.getMonth() + 1, 2)
    const day = this.padStart(now.getDate(), 2)
    const hours = this.padStart(now.getHours(), 2)
    const minutes = this.padStart(now.getMinutes(), 2)
    const seconds = this.padStart(now.getSeconds(), 2)
    return `${year}${month}${day}${hours}${minutes}${seconds}`
  }

  /**
   * 用0左填充字符串
   *
   * @param {number} num - 需要填充的数字
   * @param {number} length - 填充后的总长度
   * @returns {string} 填充后的字符串
   */
  static padStart(num, length) {
    const str = num.toString()
    return '0'.repeat(length - str.length) + str
  }
}

module.exports = Seq
