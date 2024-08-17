const BaseController = require('./baseController.js')
var exec = require('child_process').exec
var os = require('os')
/**
 * 服务器监控
 *
 * @author ruoyi
 */
class ServerController extends BaseController {
  constructor(ctx) {
    super(ctx)
  }
  async getInfo() {
    try {
      const server = {
        cpu: this.getCpuInfo(),
        mem: this.getMemoryInfo(),
        jvm: this.getJvmInfo(),
        sys: this.getSystemInfo(),
        sysFiles: await this.getDisksInfo()
      }

      this.ctx.body = this.success(server)
    } catch (error) {
      this.ctx.body = this.AjaxResult.error(error.message)
    }
  }
  getCpuInfo() {
    const cpus = os.cpus()
    const cpuCount = cpus.length

    let total = 0
    let idle = 0
    let sys = 0

    // 计算总时间、空闲时间和系统时间
    cpus.forEach((cpu) => {
      const times = cpu.times
      total += times.user + times.nice + times.sys + times.idle + times.irq
      idle += times.idle
      sys += times.sys
    })

    const used = total - idle
    const free = (idle / total) * 100

    // 返回 CPU 信息
    return {
      cpuNum: cpuCount,
      total: total,
      sys: ((sys / total) * 100).toFixed(2),
      used: ((used / total) * 100).toFixed(2),
      wait: 0, // Node.js 不直接提供等待时间
      free: free.toFixed(2)
    }
  }
  getMemoryInfo() {
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem
    const memUsage = (usedMem / totalMem) * 100

    // 将内存大小转换为 GB
    const totalGB = totalMem / (1024 * 1024 * 1024)
    const usedGB = usedMem / (1024 * 1024 * 1024)
    const freeGB = freeMem / (1024 * 1024 * 1024)

    // 返回内存信息
    return {
      total: totalGB.toFixed(2),
      used: usedGB.toFixed(2),
      free: freeGB.toFixed(2),
      usage: memUsage.toFixed(2)
    }
  }
  getJvmInfo() {
    function formatUptime(uptime) {
      const days = Math.floor(uptime / (24 * 60 * 60))
      uptime -= days * 24 * 60 * 60
      const hours = Math.floor(uptime / (60 * 60))
      uptime -= hours * 60 * 60
      const minutes = Math.floor(uptime / 60)
      uptime -= minutes * 60
      const seconds = Math.floor(uptime)
      return `${days}天${hours}小时${minutes}分钟`
    }
    function getStartTime(uptime) {
      const now = new Date()
      const startTime = new Date(now.getTime() - uptime * 1000)
      return startTime.toLocaleString()
    }
    return {
      total: (process.memoryUsage().heapTotal / (1024 * 1024)).toFixed(2), // MB
      max: (process.memoryUsage().heapTotal / (1024 * 1024)).toFixed(2), // MB
      free: ((process.memoryUsage().heapTotal - process.memoryUsage().heapUsed) / (1024 * 1024)).toFixed(2), // MB
      version: process.version, // Node.js版本
      home: process.execPath, // Node.js没有这个概念
      name: 'Node.js V8 Engine',
      startTime: getStartTime(process.uptime()), // 运行时间，单位秒
      usage: ((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100).toFixed(2), // 内存使用率
      used: (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2), // MB
      runTime: formatUptime(process.uptime()), // 运行时间
      inputArgs: process.argv.slice(2).join(' ') // 启动参数
    }
  }
  getSystemInfo() {
    const interfaces = os.networkInterfaces()
    let computerIp = ''
    for (const name of Object.keys(interfaces)) {
      for (const interfaceObj of interfaces[name]) {
        if (interfaceObj.family === 'IPv4' && !interfaceObj.internal) {
          computerIp = interfaceObj.address
          break
        }
      }
      if (computerIp) break
    }

    const computerName = os.hostname()
    const userDir = process.cwd() // 当前工作目录
    const osName = os.type()
    const osArch = os.arch()

    // 格式化操作系统名称
    let formattedOsName = osName
    switch (osName) {
      case 'Darwin':
        formattedOsName = 'Mac OS X'
        break
      case 'Linux':
        formattedOsName = 'Linux'
        break
      case 'Windows_NT':
        formattedOsName = 'Windows'
        break
      default:
        formattedOsName = osName
    }

    return {
      computerName,
      computerIp,
      userDir,
      osName: formattedOsName,
      osArch
    }
  }
  async getDisksInfo() {
    return new Promise((resolve, reject) => {
      try {
        var aDrives = []
        function getDrives(callback) {
          switch (os.platform().toLowerCase()) {
            case 'win32':
              // Windows 32
              // Tested on Vista

              // Run command to get list of drives
              var oProcess = exec('wmic logicaldisk get Caption,FreeSpace,Size,VolumeSerialNumber,Description  /format:list', function (err, stdout, stderr) {
                if (err) return callback(err, null)

                var aLines = stdout.split('\r\r\n')
                var bNew = false
                var sCaption = '',
                  sDescription = '',
                  sFreeSpace = '',
                  sSize = '',
                  sVolume = ''
                // For each line get information
                // Format is Key=Value
                for (var i = 0; i < aLines.length; i++) {
                  if (aLines[i] != '') {
                    var aTokens = aLines[i].split('=')
                    switch (aTokens[0]) {
                      case 'Caption':
                        sCaption = aTokens[1]
                        bNew = true
                        break
                      case 'Description':
                        sDescription = aTokens[1]
                        break
                      case 'FreeSpace':
                        sFreeSpace = aTokens[1]
                        break
                      case 'Size':
                        sSize = aTokens[1]
                        break
                      case 'VolumeSerialNumber':
                        sVolume = aTokens[1]
                        break
                    }
                  } else {
                    // Empty line
                    // If we get an empty line and bNew is true then we have retrieved
                    // all information for one drive, add to array and reset variables
                    if (bNew) {
                      sSize = parseFloat(sSize)
                      if (isNaN(sSize)) {
                        sSize = 0
                      }
                      sFreeSpace = parseFloat(sFreeSpace)
                      if (isNaN(sFreeSpace)) {
                        sFreeSpace = 0
                      }

                      var sUsed = sSize - sFreeSpace
                      var sPercent = '0%'
                      if (sSize != '' && parseFloat(sSize) > 0) {
                        sPercent = Math.round((parseFloat(sUsed) / parseFloat(sSize)) * 100) + '%'
                      }
                      aDrives[aDrives.length] = {
                        filesystem: sDescription,
                        blocks: sSize,
                        used: sUsed,
                        available: sFreeSpace,
                        capacity: sPercent,
                        mounted: sCaption
                      }
                      bNew = false
                      sCaption = ''
                      sDescription = ''
                      sFreeSpace = ''
                      sSize = ''
                      sVolume = ''
                    }
                  }
                }
                // Check if we have callback
                if (callback != null) {
                  callback(null, aDrives)
                }
                return aDrives
              })

              break

            case 'linux':
            // Linux
            // Tested on CentOS
            default:
              // Run command to get list of drives
              var oProcess = exec("df -P | awk 'NR > 1'", function (err, stdout, stderr) {
                if (err) return callback(err, null)
                var aLines = stdout.split('\n')
                // For each line get drive info and add to array
                for (var i = 0; i < aLines.length; i++) {
                  var sLine = aLines[i]
                  if (sLine != '') {
                    sLine = sLine.replace(/ +(?= )/g, '')
                    var aTokens = sLine.split(' ')
                    aDrives[aDrives.length] = {
                      filesystem: aTokens[0],
                      blocks: aTokens[1],
                      used: aTokens[2],
                      available: aTokens[3],
                      capacity: aTokens[4],
                      mounted: aTokens[5]
                    }
                  }
                }
                // Check if we have a callback
                if (callback != null) {
                  callback(null, aDrives)
                }
                return aDrives
              })
          }
        }
        function formatSize(size) {
          const units = ['B', 'KB', 'MB', 'GB', 'TB']
          let unitIndex = 0
          while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024
            unitIndex++
          }
          return `${size.toFixed(1)} ${units[unitIndex]}`
        }

        getDrives((err, aDrives) => {
          const result = aDrives.map((disk) => ({
            dirName: disk.mounted,
            sysTypeName: disk.filesystem,
            typeName: `本地固定磁盘 (${disk.mounted})`,
            total: formatSize(disk.blocks),
            free: formatSize(disk.available),
            used: formatSize(disk.used),
            usage: disk.capacity.slice(0, disk.capacity.length - 1)
          }))
          return resolve(result)
        })
      } catch (error) {
        throw error
      }
    })
  }
}
module.exports = ServerController
