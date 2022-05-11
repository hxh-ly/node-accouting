'use strict';

const md5Password = require("../util/md5Password");

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  var auth = app.middleware.auth({ title: 'this is router.js  middleware' })
  var handlerPass = middleware.handlerPass()
  const _jwt = middleware.jwtErr(app.config.jwt.secret);
  router.get('/', controller.home.index);
  router.get('/user/:id', controller.home.user)
  router.post('/addUser', controller.home.addUser)
  router.post('/editUser', controller.home.editUser)
  router.post('/delUser', controller.home.delUser)

  router.post('/add', controller.home.add)
  /* 
  注册
  */
  router.post('/api/user/register', handlerPass, controller.user.register)
  router.post('/api/user/login', handlerPass, controller.user.login)
  router.post('/api/user/test', _jwt, controller.user.test)
  /* 
用户信息
  修改个签
  修改密码
  修改头像
  */
  router.get('/api/user/get_userinfo', _jwt, controller.user.getUserInfo)
  router.post('/api/user/edit_userinfo', _jwt, controller.user.editUserInfo)
  router.post('/api/upload', controller.upload.uploadImg)
  router.post('/api/user/modify_pass', _jwt, controller.user.resetPassword)
  /* 
  
  */
  router.get('/api/type/list', _jwt, controller.type.getTypeList)
  /* 
  账单
   */
  router.post('/api/bill/add', _jwt, controller.bill.add); // 添加账单
  router.get('/api/bill/list', _jwt, controller.bill.list); // 获取账单列表
  router.get('/api/bill/detail', _jwt, controller.bill.detail); // 获取详情
  router.post('/api/bill/update', _jwt, controller.bill.update); // 账单更新
  router.post('/api/bill/delete', _jwt, controller.bill.delete); // 删除账单
  router.get('/api/bill/data', _jwt, controller.bill.data); // 获取数据
};
