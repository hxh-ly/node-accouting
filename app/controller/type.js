const Controller = require('egg').Controller;
const resData = require('../../util/resReturn')
const moment = require('moment')
const { nanoid } = require('nanoid')
const { verifyToken, getToken } = require('../../util/commonMethods')
class TypeController extends Controller {
  async getTypeList() {
    const { ctx, app } = this;
    const { type_id='all' } = ctx.request.query
    const token = getToken(ctx);
    try {
      const decode = await verifyToken(token, app)
      if (!decode) return
      let list = await ctx.service.type.list(type_id)
      //console.log(list);
      ctx.body = resData(200, '获取标签成功', { list })
    } catch (err) {
      console.log(err);
      ctx.body = resData(500, '获取标签，内部错误')
    }
  }
}
module.exports = TypeController