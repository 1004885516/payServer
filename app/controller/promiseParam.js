'use strict';


const Controller = require('egg').Controller;
const common = require('../common');
const { PayServerError, Constant } = common;
const { ERR_CODE } = Constant.ERR_CODE;
const { PAY_SERVER_FIELD } = Constant.PAY_SERVER_FIELD;

const {
    ADD_PROMISE_PARAM
} = PAY_SERVER_FIELD.ACTION;

const {
    promiseParam
  } = common.Validator.PROMISE_PARAM
class PromiseParamHandler extends Controller {

    constructor(ctx) {
        super(ctx);
        this.service = ctx.service;
        this.reqBody = ctx.request.body;
    }

    async promiseParamHandler () {

        const { ctx, service, reqBody } = this;

        ctx.logger.info('controller/promiseParamHandler, reqBody', JSON.stringify(reqBody))
        
        const action = reqBody.action
        let param;

        switch (action) {
            case ADD_PROMISE_PARAM:
                await promiseParam.validateAsync(reqBody);
                await service.promiseParam.createPromiseParam(reqBody);
                break;
            default:
                throw new PayServerError({ code: ERR_CODE.INVALID_PARAM_ERR, message: 'no such action' })
        }

        if (param) {

            ctx.setSuccessBody(param)

        } else {

            ctx.setSuccessBody()

        }

    }
}
  
  module.exports = PromiseParamHandler;