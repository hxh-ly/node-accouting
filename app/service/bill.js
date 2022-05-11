const { resolveCatch } = require('../../util/commonMethods')
const Service = require('egg').Service
class BillService extends Service {
  async add(params) {
    const { ctx, app } = this;
    try {
      // 往 bill 表中，插入一条账单数据
      const result = await app.mysql.insert('bill', params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async list(params) {
    const { ctx, app } = this;
    let { id, date, page_size, page } = params
   /*  let [year, month] = date.split('-') */
    let QUERY_STR = 'id,amount, type_id, type_name, date, pay_type, remark '
    /*  let sql = `select ${QUERY_STR} from bill where user_id  = ${id} and  Year(date)=${year} and Month(date)=${month}  limit 0,${(page - 1) * page_size} `; */
    let sql = `select ${QUERY_STR} from bill where user_id = ${id}`
    try {
      let result = await app.mysql.query(sql)
      //console.log('分页+date限制查出来的', result)
      return result
    } catch (error) {
      console.log(error);
      return null
    }
  }
  async getAllCount(date) {
    const { ctx, app } = this;
    let [year, month] = date.split('-')
    let sql = `SELECT Count(*) as total_count from bill where  YEAR(date)=${year} and  Month(date)=${month} `
    let result = await app.mysql.query(sql)
    console.log(result);
    return result
  }

  async detail(id, user_id) {
    const { ctx, app } = this;
    try {
      const result = await app.mysql.get('bill', { id, user_id })
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async update(params) {
    const { ctx, app } = this;
    try {
      let result = await app.mysql.update('bill', {
        ...params
      }, {
        id: params.id,
        user_id: params.user_id
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async delete(params) {
    const { app, ctx } = this
    try {
      return await app.mysql.delete('bill', params)
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
module.exports = BillService