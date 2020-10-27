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

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1595397486821_6189';

  // add your middleware config here
  config.middleware = ['errorHandler'];

  exports.cluster = {
    listen: {
      port: 7007,
      hostname: '0.0.0.0', // 不建议设置 hostname 为 '0.0.0.0'，它将允许来自外部网络和来源的连接，请在知晓风险的情况下使用
      // path: '/var/run/egg.sock',
    }
  }

  config.logger = {
    appLogName: `${appInfo.name}-web.log`,
  };

  config.mongoose = {
    clients: {
      payserver:{
        url: 'mongodb://127.0.0.1:27017/payserver',
        options: {
          autoReconnect: true,
          reconnectTries: Number.MAX_VALUE,
          bufferMaxEntries: 0,
          useUnifiedTopology: true
        },
      },
      loginserver: {
        url: 'mongodb://127.0.0.1:27017/loginserver',
        options: {
          autoReconnect: true,
          reconnectTries: Number.MAX_VALUE,
          bufferMaxEntries: 0,
          useUnifiedTopology: true
        },
      }
    }
    
  };

  // 为每一次请求添加tracerId，方便追踪接口问题
  config.tracer = {
    Class: require('../app/common/tracer')
  };
  
  // 解除安全验证，保证post请求对接口可以正常访问
  config.security = {
    csrf: {
      enable: false,
    }
  };

  config.cors = {
    origin:'*',
    allowMethods: 'GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH',
    credentials: true // 允许客户端发送cookie
  };
  // 模板渲染配置
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
    },
  };
  // bodyParser配置，由于egg内置的bodyParser默认只支持content-type 为'json', 'form'，然而第卅在南方支付回调结果中的值为text，为了正常获取到结果添加text
  config.bodyParser = { 
    enableTypes: ['json', 'form', 'text']
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
