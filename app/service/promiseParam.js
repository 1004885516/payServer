'use strict';


const Service = require('egg').Service;
const _ = require('underscore');
const common = require('../common');
const { required } = require('@hapi/joi');
const { PayServerError, Constant, Sign } = common;
const { ERR_CODE } = Constant.ERR_CODE;
const { PAY_SERVER_FIELD } = Constant.PAY_SERVER_FIELD;


class payServer extends Service {
    constructor(ctx) {

        super(ctx);
    
        this.dao = ctx.service.dao;
    
    }

    // 创建约定参数
    async createPromiseParam (reqBody) {

        const { ctx, dao, app } = this;
        const { appId, appKey, cbkUrl } = reqBody;
        let errorObj = null;
        let errorBody = null;
        ctx.logger.info(`createPromiseParam appId:${ appId } appKey:${ appKey } cbkUrl:${ cbkUrl }`);

        // 验证约定参数是否存在
        const params = await dao.promiseParam.getPromiseParam({ find: { appId: appId } });
        if (params) {
            errorObj = { code: ERR_CODE.REPEAT_ACTION_ERR, message: '该参数配置已存在' };
            errorBody = new PayServerError(errorObj);

            if (!errorBody) {
                errorBody = { code: ERR_CODE.SERVER_ERR, message: 'error构建失败' };
            }

            ctx.throw(errorBody);
            
        }

        const query = {
            doc: {
                appId: appId,
                appKey: appKey,
                cbkUrl: cbkUrl
            }
        };

        const result = await dao.promiseParam.addPromiseParam(query);

        return result;
    }


}

module.exports = payServer;