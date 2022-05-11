'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('index.html', {
      title: '我是xxx'
    })
  }
  async user() {
    const { ctx } = this;
    const result = await ctx.service.home.user()
    ctx.body = result
  }
  async add() {
    const { ctx } = this;
    const { title } = ctx.request.body;
    ctx.body = {
      title
    }
  }
  async addUser() {
    const { ctx } = this;
    const { name } = ctx.request.body
    const result = await ctx.service.home.addUser(name)
    ctx.body = result
  }
  async editUser() {
    const { ctx } = this;
    const { name, id } = ctx.request.body
    try {
      const result = await ctx.service.home.editUser(name, id)
      ctx.body = {
        code: 200,
        err: null,
        data: null
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        err: null,
        data: null
      }
    }

  }
  async delUser() {
    const { ctx } = this
    let { id } = ctx.request.body
    try {
      await ctx.service.home.delUser(id)
      ctx.body = {
        code: 200
      }
    } catch (error) {
      ctx.body = {
        code: 500
      }
    }
  }
}

module.exports = HomeController;
