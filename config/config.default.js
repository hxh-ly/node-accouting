/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  exports.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'Ly622534',
      database: 'test_egg',
    },
    //是否加载在app上，默认开启
    app: true,
    agent: false
  }

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1651648794966_9377';

  // add your middleware config here
  /*  config.middleware = ['auth'];
   config.auth = {
     title: 'this is auth'
   }; */
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    uploadDir: 'app/public/upload'
  };
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['*'], // 配置白名单
  };
  config.view = {
    mapping: {
      // 模板文件以html结尾
      '.html': 'ejs',
    }
    // jwt
  };
  config.jwt = {
    secret: 'Nick'
  }
  config.cors = {
    origin: '*', // 允许所有跨域访问
    credentials: true, // 允许 Cookie 跨域跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };
  config.multipart = {
    mode: 'file',
  };
  return {
    ...config,
    ...userConfig,
  };
};
