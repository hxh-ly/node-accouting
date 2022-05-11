'use strict';
const baseImgUrl = 'localhost:7001'
const Controller = require('egg').Controller
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const mkdirp = require('mkdirp')
const resData = require('../../util/resReturn')
class UploadController extends Controller {
  async uploadImg() {
    const { ctx } = this
    const file = ctx.request.files[0]
    console.log(file);
    let uploadDir = ''
    try {
      let f = fs.readFileSync(file.filepath)
      let day = moment(new Date()).format('YYYYMMDD')
      let dir = path.join(this.config.uploadDir, day)
      let date = Date.now()
      await mkdirp(dir)
      uploadDir = path.join(dir, date + path.extname(file.filename))
      console.log(uploadDir);
      fs.writeFileSync(uploadDir, f)
      //还要把文件的url保存到数据库
    } catch (err) {
      console.log(err);
    }
    finally {
      ctx.cleanupRequestFiles()
    }
    ctx.body = resData(200, '图片上传成功', { path: uploadDir.replace(/app/g, '') })
  }
}
module.exports = UploadController