module.exports =
  function (code = 200, msg = '', data = null) {
    return {
      code,
      msg,
      data
    }
  }
