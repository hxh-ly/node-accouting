const md5Password = require('../../util/md5Password')
module.exports = (options, app) => {
  return async function auth(ctx, next) {
    console.log(options);
    console.log(new Date());
    await next()
  }
}