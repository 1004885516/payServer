'use strict';


const { Crypt } = require('../util');


/**
 * 构建md5签名，生成规则为   key1=value1&key2=value2....keyn=valuen&secret_key   (secret_key为md5加密后的密文)
 * @param {*} body     需要签名的必要参数 
 * @param {*} secret   md5key 
 * @param {*} ctx      上下文对象 
 */
exports.buildSign = function buildSign(body, secret, ctx) {

  ctx.logger.info(`buildSign, body: ${body}, secret: ${secret}`);
  const sortKeys = Object.keys(body).sort();
  let str = '';
  for (let i = 0; i < sortKeys.length; i++) {
    const curValue = body[sortKeys[i]].toString();
    if(curValue != null && curValue.length > 0){
      str += sortKeys[i] + '=' +curValue + '&';
    }
  }
  const secret_key = Crypt.MD5(secret)
  console.log('str##', str)
  str += secret_key;
  return Crypt.MD5(str);
};
