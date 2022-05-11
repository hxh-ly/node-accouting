const { resolveCatch } = require('../../util/commonMethods')
const Service = require('egg').Service
class TypeService extends Service {
  async list(type) {
    const { app, ctx } = this
    let QUERY_STR = 'id,name,type'
    let sql = type == 'all' ? `select ${QUERY_STR} from type;` : `select ${ QUERY_STR } from type where type = ${ type }`;
    try {
      let result = await app.mysql.query(sql)
      //console.log(result)
      return result
    } catch (error) {
      console.log(error);
      return null
    }
  }
}
module.exports = TypeService