'use strict'


const Joi = require('@hapi/joi');
const { join } = require('lodash');

/**
 * 对接参数相关
 */

const promiseParam = Joi.object({
    action: Joi.string().required(),
    appId: Joi.number().required(),
    appKey: Joi.string().required()
})

module.exports = {
    promiseParam
}