'use strict';


const PayServerError = require('../error');

// 检查错误类型是否PayServer本身的业务异常,此error类型为开发者自定义err
exports.isPayServerError= function (err) {
  return (err instanceof PayServerError)
};

exports.isObject = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

exports.isNumber = function (number) {
  return (typeof number === 'number');
};