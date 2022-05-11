
module.exports = {
  getToken: (ctx) => {
    return ctx.request.header.authorization?.slice(7)
  },
  verifyToken: async (token, app) => {
    return await app.jwt.verify(token, app.config.jwt.secret)
  },
  resolveCatch: async (searchMethods) => {
    try {
      var result= await searchMethods()
      return  result
    } catch (error) {
      console.log(error)
      return await null;
    }
  }
}