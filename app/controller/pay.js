'use strict';


const Controller = require('egg').Controller;
const common = require('../common');
const { PayServerError, Constant, Sign } = common;
const { ERR_CODE } = Constant.ERR_CODE;
const { PAY_SERVER_FIELD } = Constant.PAY_SERVER_FIELD;

// action值用于区分接口请求的不同业务
const {
  CREATE_ORDER,
  PAY_CALL_BACK,
  GET_POST_DATA,
  GET_ORDER_FOR_TIRD_PARTY
} = PAY_SERVER_FIELD.ACTION;

const {
  orderSchema,
  tirdPartySchema,
  postDataSchema,

} = common.Validator.PAY_SCHEMA
class PayController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.service = ctx.service;
    this.reqBody = ctx.request.body;
  }

  async test(){
    const { ctx, service, reqBody } = this;
    console.log('请求结果', reqBody)
    ctx.body = reqBody
  }

  // 导出支付页面模板
  async index() {
    
    const { ctx } = this;
    const { cpOrder } = ctx.query;
    const dataList = {
      list: [
        { id: 13, title: '微信', src: 'public/img/weixin.png'},
        { id: 12, title: '支付宝', src: 'public/img/zhifubao.png'}
      ], 
      cpOrder: cpOrder
    };

    await ctx.render('page/pay.html', dataList);

  }
  // 支付成功页面
  async paySuccess () {
    const { ctx, service, reqBody } = this;
    await ctx.render('page/paySuccess.html');
  }

  // 支付回调接口
  async payCallBack (){
    
    const { ctx, service, reqBody } = this;

    ctx.logger.info('controller/payCallBack, reqBody', JSON.stringify(reqBody))

    const result = await service.pay.payCallBack(reqBody);

    ctx.logger.info('controller/payCallBack, successBody', JSON.stringify({ result }))
    ctx.body = result 

    return ctx.body
  }

  /**
   * 支付相关操作，创建订单，提交支付等
   */
  async payHandler () {

    const { ctx, service, reqBody } = this;

    ctx.logger.info('controller/payHandler, reqBody', JSON.stringify(reqBody))
 
    const action = reqBody.action
    let pay;

    switch (action) {
      case CREATE_ORDER:
        await orderSchema.validateAsync(reqBody);
        await service.pay.createOrder(reqBody);
        break;
      case GET_POST_DATA:
        await postDataSchema.validateAsync(reqBody);
        pay = await service.pay.getPostData(reqBody);
        break;
      case GET_ORDER_FOR_TIRD_PARTY:
        await tirdPartySchema.validateAsync(reqBody);
        pay = await service.pay.getOrderFortirdParty(reqBody);
        break;  
      default:
        throw new PayServerError({ code: ERR_CODE.INVALID_PARAM_ERR, message: 'no such action' })
    }

    if (pay) {

      ctx.setSuccessBody(pay)

    } else {

      ctx.setSuccessBody()

    }

  }
}

module.exports = PayController;
