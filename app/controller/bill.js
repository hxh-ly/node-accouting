'use strict';

const Controller = require('egg').Controller;
const resData = require('../../util/resReturn')
const moment = require('moment')
const { nanoid } = require('nanoid')
const { verifyToken, getToken } = require('../../util/commonMethods')
class BillController extends Controller {
  async add() {
    const { ctx, app } = this;
    // console.log(ctx.request.body);
    const token = getToken(ctx)
    const { amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = resData('400', '参数错误')
      return;
    }
    // 鉴权 用户是否存在
    let user_id;
    try {
      const decode = await verifyToken(token, app)
      //console.log(decode);
      if (!decode) return;
      user_id = decode.id;
      //console.log(ctx.service.bill)
      const res = await ctx.service.bill.add({
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id
      })
      ctx.body = resData('200', '添加账单成功')
    } catch (error) {
      console.log(error);
      ctx.body = resData('500', '内部错误')
    }
  }
  async list() {
    const { ctx, app } = this;
    //请求参数
    const { date, page = 1, page_size = 5, type_id = 'all' } = ctx.request.query
    const token = getToken(ctx);
    try {
      const decode = await verifyToken(token, app)
      let list = await ctx.service.bill.list({ id: decode.id })
     // let { total_count } = (await ctx.service.bill.getAllCount(date))[0]
      //日期
      const _list = list.filter(item => {
        if (type_id != 'all') {
          return moment(Number(item.date)).format('YYYY-MM') == date && item.type_id == type_id
        }
        return moment(Number(item.date)).format('YYYY-MM') == date
      })
      //格式化数据放回
      let listMap = _list.reduce((curr, item) => {
        //存的是时间戳  转成字符串比较
        const date = moment(Number(item.date)).format('YYYY-MM-DD')
        if (curr && curr.length && curr.findIndex(ext_item => ext_item.date == date) > -1) {
          let target = curr.find(o_item => o_item.date == date)
          target.bills.push(item)
          target.totalExpense += (item.pay_type == 1 ? item.amount - '0' : 0)
          target.totalIncome += (item.pay_type == 2 ? item.amount - '0' : 0)
        }
        if (curr && curr.findIndex(ext_item => ext_item.date == date) == -1) {
          curr.push(
            {
              id: nanoid(),
              date,
              bills: [item],
              totalExpense: item.pay_type == 1 ? item.amount - '0' : 0,
              totalIncome: item.pay_type == 2 ? item.amount - '0' : 0,
            }
          )
        }
        return curr
      }, []).sort((a, b) => moment(b.date) - moment(a.date))

      //分页
      const filterListMap = listMap.slice((page - 1) * page_size, page * page_size)
      //计算总收入 总支出
      let totalExpense = _list.reduce((curr, item) => {
        if (item.pay_type == 1) {
          curr += Number(item.amount)
        }
        return curr
      }, 0)
      let totalIncome = _list.reduce((curr, item) => {
        if (item.pay_type == 2) {
          curr += Number(item.amount)
        }
        return curr
      }, 0)

      ctx.body = resData(200, '获取账单成功', {
        totalExpense,
        totalIncome,
        list: filterListMap || [],
        totalPage: Math.ceil(listMap.length / page_size)
      })
    } catch (error) {
      console.log(error);
      ctx.body = resData(500, '获取账单失败')
    }
  }

  // 获取账单详情
  async detail() {
    const { ctx, app } = this;
    // 获取账单 id 参数
    const { id = '' } = ctx.query
    // 获取用户 user_id
    let user_id;
    const token = getToken(ctx);
    // 获取当前用户信息
    const decode = await verifyToken(token, app)
    console.log(decode);
    if (!decode) return
    user_id = decode.id
    // 判断是否传入账单 id
    if (!id) {
      ctx.body = {
        code: 500,
        msg: '订单id不能为空',
        data: null
      }
      return
    }

    try {
      // 从数据库获取账单详情
      const detail = await ctx.service.bill.detail(id, user_id)
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: detail
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null
      }
    }
  }
  async update() {
    const { ctx, app } = this;
    // 账单的相关参数，这里注意要把账单的 id 也传进来
    const { id, amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
    // 判空处理
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null
      }
    }

    try {
      let user_id
      const token = getToken(ctx);
      // 获取当前用户信息
      const decode = await verifyToken(token, app);
      if (!decode) return
      user_id = decode.id
      // 根据账单 id 和 user_id，修改账单数据
      const result = await ctx.service.bill.update({
        id, // 账单 id
        amount, // 金额
        type_id, // 消费类型 id
        type_name, // 消费类型名称
        date, // 日期
        pay_type, // 消费类型
        remark, // 备注
        user_id // 用户 id
      });
      console.log(result)
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null
      }
    }
  }
  async data() {
    const { ctx, app } = this
    let { date = '' } = ctx.query
    const token = getToken(ctx)
    try {
      const decode = await verifyToken(token, app)
      if (!decode) return
      let list = await ctx.service.bill.list({id:decode.id})
      let start = (moment(date).startOf('month').unix() * 1000)
      let end = (moment(date).endOf('month').unix() * 1000)
      let _data = list.filter(item => {
        let time = Number(item.date)
        return time > start && time < end
      })
      //支出 收入
      //构造返回的数组 
      let total_income = 0
      let total_expense = 0
      _data.forEach((cur) => {
        if (cur.pay_type == 1) {
          total_expense += cur.amount - '0'
        }
        if (cur.pay_type == 2) {
          total_income += cur.amount - '0'
        }

      })
      let total_data = _data.reduce((arr, cur) => {
        let id = cur.type_id
        let pay_type = cur.pay_type
        const index = arr.findIndex(item => item.type_id == id && item.pay_type == pay_type)
        if (index == -1) {
          arr.push({
            type_id: cur.type_id,
            type_name: cur.type_name,
            pay_type: cur.pay_type,
            number: Number(cur.amount)
          })
        }
        if (index > -1) {
          arr[index].number += Number(cur.amount)
        }
        return arr
      }, [])

      total_data = total_data.map(item => {
        item.number = Number(Number(item.number).toFixed(2))
        return item
      })
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          total_expense: Number(total_expense).toFixed(2),
          total_income: Number(total_income).toFixed(2),
          total_data: total_data || [],
        }
      }
    } catch (error) {
      console.log(error);
      ctx.body = resData(500, '数据计算失败')
    }
  }
  async delete() {
    const { ctx, app } = this
    const { id } = ctx.request.query
    const token = getToken(ctx)
    try {
      const decode = await verifyToken(token, app)
      if (!decode) return
      let res = await ctx.service.bill.delete({ user_id: decode.id, id: id })
      if (res) {
        ctx.body = resData(200, '删除成功')
        return
      }
      throw new Error('...')
    } catch (error) {
      ctx.body = resData(500, '删除失败')
    }
  }
}
module.exports = BillController