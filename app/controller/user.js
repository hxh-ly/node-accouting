'use strict';

const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png'
const Controller = require('egg').Controller
const resData = require('../../util/resReturn')
const md5Password = require('../../util/md5Password')
class UserController extends Controller {
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    /* 1.判空 */
    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: '账号密码不能为空',
        data: null
      }
      return;
    }
    try {
      const userInfo = await ctx.service.user.getUserByName(username)
      /* 
      已经注册
      */
      console.log(userInfo)
      if (userInfo && userInfo.id) {
        ctx.body = resData(500, '账户已被注册')
        return;
      }
      /* 
      开始注册
      */
      const result = await ctx.service.user.register({
        username,
        password,
        signature: '..',
        avatar: defaultAvatar
      })
      if (result) {
        ctx.body = resData(200, '注册成功')
      } else {
        ctx.body = resData(500, '注册失败...')
      }
    } catch (error) {
      ctx.body = resData(500, 'fail register')
    }

  }
  async login() {
    const { ctx, app } = this
    const { username, password } = ctx.request.body
    if (!username || !password) {
      ctx.body = resData(500, '账户或者密码为空')
      return
    }
    console.log('过md5的',password)
    try {
      let useInfo = await ctx.service.user.getUserByName(username)
      if (!useInfo || !useInfo.id) {
        ctx.body = resData(500, '账户不存在')
      }
      if (useInfo && password != useInfo.password) {
        ctx.body = resData(500, '密码错误')
      }
      else {
        const token = app.jwt.sign({
          id: useInfo.id,
          username: useInfo.username,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
        }, app.config.jwt.secret)
        ctx.body = resData(200, '登录成功', { token, id: useInfo.id, username: useInfo.username })
      }
    } catch (error) {
      console.log(error);
      ctx.body = resData(500, '登录请求出错')
    }
    /* 可给token了 */

  }
  async test() {
    const { app, ctx } = this;
    const token = ctx.request.header.authorization.slice(7)
    console.log('111', token);
    try {
      const decode = await app.jwt.verify(token, app.config.jwt.secret)
      ctx.body = {
        data: { ...decode }
      }
    } catch (error) {
      console.log(error);
    }

  }
  async getUserInfo() {
    const { ctx, app } = this
    let token = ctx.request.header.authorization.slice(7)
    try {
      let secret = app.config.jwt.secret
      const decode = await app.jwt.verify(token, secret)
      const userInfo = await ctx.service.user.getUserByName(decode.username)
      console.log(decode, userInfo);
      ctx.body = resData(200, '获取用户信息成功', {
        id: userInfo.id,
        username: userInfo.username,
        signature: userInfo.signature || '',
        avatar: userInfo.avatar || defaultAvatar
      })
    } catch (error) {
      console.log(error);
    }

  }
  async editUserInfo() {
    const { ctx, app } = this
    let token = ctx.request.header.authorization.slice(7)
    let secret = app.config.jwt.secret
    let { signature = '', avatar = defaultAvatar } = ctx.request.body
    try {
      const decode = await app.jwt.verify(token, secret)
      const userInfo = await ctx.service.user.getUserByName(decode.username)
      if (!userInfo) {
        ctx.body = resData(200, '用户不存在')
        return
      }
      if (signature) {
        let res = await ctx.service.user.editUserInfo({ ...userInfo, signature, avatar })
        console.log(res)
        if (res) {
          ctx.body = resData(200, '修改成功')
          return
        }
      }
      ctx.body = resData(500, '修改失败')
    } catch (error) {
      console.log(error);
      ctx.body = resData(500, '内部错误')
    }
  }
  async resetPassword() {
    const { ctx, app } = this
    let token = ctx.request.header.authorization.slice(7)
    let secret = app.config.jwt.secret
    let { oldPass, newPass } = ctx.request.body
    console.log(oldPass, newPass);
    try {
      const decode = await app.jwt.verify(token, secret)
      const userInfo = await ctx.service.user.getUserByName(decode.username)
      if (!userInfo) {
        ctx.body = resData(200, '用户不存在')
        return
      }
      if (oldPass != userInfo.password) {
        ctx.body = resData(400, '旧密码错误')
        return
      }
      let res = await ctx.service.user.editUserInfo({ ...userInfo, password: newPass })
      console.log(res)
      if (res) {
        ctx.body = resData(200, '修改成功')
        return
      }

    } catch (error) {
      console.log(error);
      ctx.body = resData(500, '内部错误')
    }
  }
}
module.exports = UserController