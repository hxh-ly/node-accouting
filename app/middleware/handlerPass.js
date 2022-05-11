const md5Password = require('../../util/md5Password')
module.exports = (options, app) => {
  return async function handlerPass(ctx, next) {
    console.log('开始md5', new Date());
    try {
      ctx.request.body.password = md5Password(ctx.request.body.password)
    } catch (error) {
      console.log(error);
    }
    await next()
  }
}