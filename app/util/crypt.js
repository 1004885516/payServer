'use strict';


const crypto = require('crypto');


class Crypto {

  /*
   * MD5算法
   * @param {String} str - 字符串
   * @return {String} - md5
   * @constructor
   */
  static MD5(str) {
    return crypto
      .createHash('md5')
      .update(str, 'utf8')
      .digest('hex');
  }
}


module.exports = Crypto;
