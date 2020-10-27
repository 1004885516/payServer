'use strict'


const Joi = require('@hapi/joi');
const { join } = require('lodash');

/**
 * book相关参数验证规则
 */

const orderSchema = Joi.object({
  action: Joi.string().required(),
  userId: Joi.string().required(),
  gameId: Joi.string().required(),
  userName: Joi.string().required(),
  cpOrder: Joi.string().required(),
  pId: Joi.string().required(),
  pName: Joi.string().required(),
  pDesc: Joi.string().required(),
  pSum: Joi.string().required(),
  amount: Joi.number().required(),
  unitPrice: Joi.number().required(),
  cbkUrl: Joi.string().required(),
  gameUserId: Joi.string().required(),
  serverId: Joi.string().required()
})

const tirdPartySchema = Joi.object({
  action: Joi.string().required(),
  mhtOrderNo: Joi.string().required()
})
const postDataSchema = Joi.object({
  action: Joi.string().required(),
  cpOrder: Joi.string().required(),
  payChannelType: Joi.string().required()
})
module.exports = {
  orderSchema,
  tirdPartySchema,
  postDataSchema
}