'use strict';


const RES_BODY = {
  SUCCESS: {
    code: 200,
    error: '00'
  },
  INVALID_PARAM_ERR: {
    code: 400,
    error: '参数错误'
  },
  SERVER_ERR: {
    code: 0,
    error: '服务器报错'
  },
  NO_DATA_ERR: {
    code: 404,
    error: '数据未找到'
  },
  REPEAT_ACTION_ERR: {
    code: 500,
    error: '无法对该数据进行重复操作'
  },
  TOKEN_ERR: {
    code: 403,
    error: '无token或token失效'
  },
  UPLOAD_ERR: {
    code: 401,
    error: '文件上传失败'
  },
  PARSE_ERR: {
    code: 100,
    error: '文件解析失败'
  },
  DATA_TYPE_ERR: {
    code: 101,
    error: '数据类型错误'
  },
  SIGN_ERR:{
    code: 102,
    error: 'MD5签名认证失败'
  }
};

module.exports = {
  RES_BODY
};