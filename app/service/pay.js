  'use strict';


const Service = require('egg').Service;
const _ = require('underscore');
const common = require('../common');
const { required } = require('@hapi/joi');
const { PayServerError, Constant, Sign } = common;
const { ERR_CODE } = Constant.ERR_CODE;
const { Request, Timer, DateFormat } = require('../util');
const queryString = require('query-string');

class payServer extends Service {
    constructor(ctx) {

        super(ctx);
    
        this.dao = ctx.service.dao;
    
    }

    // 创建订单
    async createOrder (reqBody) {
        const { ctx, dao, app } = this;
        let errorObj = null;
        let errorBody = null;

        ctx.logger.info('server/createOrder, reqBody', JSON.stringify(reqBody))

        

        let { userId, gameId, userName, cpOrder, amount, pId, pName, pDesc, pSum, unitPrice, cbkUrl, gameUserId, serverId } = reqBody;
        amount = Number(amount);
        // 验证用户
        let user = await dao.gameUser.getOneGameUser({ find: { loginid: Number(userId) } })   // 正常用户
        const fastUser = await dao.fastUser.getOneFastUser({ find: { fastloginid: userId } }) // 快速注册用户
        console.log('fastUser', fastUser)
        if (!user){
            user = fastUser
        }
        if (!user) {
            errorObj = { code: ERR_CODE.NO_DATA_ERR, message: '该用户未注册' };
            errorBody = new PayServerError(errorObj);

            if (!errorBody) {
                errorBody = { code: ERR_CODE.SERVER_ERR, message: 'error构建失败' };
            }

            ctx.throw(errorBody);
        }

        const nowMonth = DateFormat.dateFormat(new Date(), 'yyyyMM');

        const  match = { 
            $match: { 'user.userId': userId, mhtOrderStartTime: { "$regex": nowMonth } } 
        }
        const group = {
            $group:{
                _id: "$user.userId",
                monthAmount: { $sum: "$amount" }
            }
        }
        const monthAmount = await dao.order.getMonthAmount({ find: match, group: group })
        let totalMoney = 0;
        if(monthAmount[0] && monthAmount[0]['monthAmount']){
            totalMoney = monthAmount[0]['monthAmount']
        }
        const indulgeconfig = await dao.indulgeConfig.getIndulgeconfig({ find: { gameid: gameId } });
        console.log('indulgeconfig###', indulgeconfig)

        // 防沉迷用户充值限制
        console.log('############11', indulgeconfig && indulgeconfig.type)
        if(indulgeconfig && indulgeconfig.type){
            if(!user.idCardData){
                ctx.throw('请先完成实名认证');
            }
            console.log('user####', user)
            if(user.idCardData.addiction === "1"){
                ctx.throw('未满8周岁的用户不提供游戏付费服务');
            }
            if(user.idCardData.addiction === "2"){
                if(amount > 50){
                    ctx.throw('8周岁以上未满16周岁的用户，单次充值金额不超过50元人民币');
                }
                if((amount + totalMoney) > 200){
                    ctx.throw('8周岁以上未满16周岁的用户，每月充值金额累计不超过200元人民币');
                }
            }
            if(user.idCardData.addiction === "3"){
                if(amount > 100){
                    ctx.throw('16周岁以上未满18周岁的用户，单次充值金额不超过100元人民币');
                }
                if((amount + totalMoney) >= 400){
                    ctx.throw('16周岁以上未满18周岁的用户，每月充值金额累计不超过400元人民币');
                }
            }
        }

        // 验证订单
        const order = await dao.order.getOneOrder({ find: { cpOrder: cpOrder } })
        if (order) {

            errorObj = { code: ERR_CODE.REPEAT_ACTION_ERR, message: '订单已存在' };
            errorBody = new PayServerError(errorObj);

        if (!errorBody) {
            errorBody = { code: ERR_CODE.REPEAT_ACTION_ERR, message: 'error构建失败' };
        }
            ctx.throw(errorBody);
        }

        const query = {
            doc: {
                gameId: gameId,
                cpOrder: cpOrder,
                amount: amount.toFixed(2),
                mhtOrderStartTime: DateFormat.dateFormat(new Date(), 'yyyyMMddhhmmss'),
                callbackUrl: cbkUrl,
                gameUserId: gameUserId,
                serverId: serverId,
                user: {
                    userId: userId,
                    userName: userName
                },
                product: {
                    pId: pId,
                    name: pName,
                    describe: pDesc,
                    unitPrice: unitPrice,
                    num: pSum
                }
            }
        };
        // 创建平台订单
        const result = await dao.order.addPayForOrder(query);
        // 把游戏端回调地址写入promiseParam表，方便以后调用
        const promiseParamQuery = {
            find:{
                appId: Number(gameId)
            },
            update:{
                $set:{ cbkUrl: cbkUrl }
            }
        }
        await dao.promiseParam.updatePromiseParam(promiseParamQuery);
        return result;
    }

    // 查询payserver订单
    async getOrder (reqBody){
        const { ctx, dao } = this;
        const { cpOrder } = reqBody;

        ctx.logger.info(`getOrder cpOrder:${cpOrder} `);
        
        return await dao.order.getOneOrder({ find: { cpOrder: cpOrder } });
    }
    // 更新订单中的支付方式
    async updateOrderPayWay (_id, payChannelType){
        const { ctx, dao } = this;

        ctx.logger.info(`updateOrderPayWay _id:${_id} `);

        const query = {
            find: { _id: _id },
            update: { $set:{ payChannelType: payChannelType } }
        }
        return await dao.order.updateOneOrder(query);
    }
    // 支付成功的回调接口
    async payCallBack(reqBody){
        const { ctx, dao } = this;
        reqBody = queryString.parse(reqBody)
        const { 
            appId, 
            payChannelType, 
            deviceType, version, 
            mhtCurrencyType, payTime, 
            mhtOrderNo,
            mhtOrderType,
            channelOrderNo,
            nowPayOrderNo
        } = reqBody;

        let errorObj = null;
        let errorBody = null;
        ctx.logger.info('payCallBack reqBody:', JSON.stringify(reqBody));

        const order = await dao.order.getOneOrder({ find: { _id: mhtOrderNo } });

        // console.log('order', order)
        
        if (!order) {

            errorObj = { code: ERR_CODE.REPEAT_ACTION_ERR, message: '订单不存在' };
            errorBody = new PayServerError(errorObj);

            if (!errorBody) {
                errorBody = { code: ERR_CODE.REPEAT_ACTION_ERR, message: 'error构建失败' };
            }

            ctx.throw(errorBody);

        }

        const query = {
            find: { _id: order._id },
            update: { 
                $set:{ 
                    type: 2, 
                    appId: appId,
                    payChannelType: payChannelType, 
                    deviceType: deviceType, 
                    version: version, 
                    mhtCurrencyType: mhtCurrencyType, 
                    payTime:payTime, 
                    mhtOrderType: mhtOrderType,
                    mhtOrderType: mhtOrderType,
                    channelOrderNo: channelOrderNo,
                    nowPayOrderNo: nowPayOrderNo
                } 
            }
        }


        // 将订单状态修改为处理中，并同步第三方支付相关信息
        await dao.order.updateOneOrder(query);

        // 返回支付结果到游戏服务器（需要游戏服务器端提供回调接口），此处需要对参数做一个签名认证

        const promise = await dao.promiseParam.getPromiseParam({ find:{ appId: order.gameId } }); // 获取约定参数配置
        const { appKey,  cbkUrl} = promise;
      
        const data = {
            snOrder: order._id,                       // 平台订单id
            cpOrder: order.cpOrder,                   // 游戏放订单id
            amount: order.amount,                     // 支付总金额
            productId: order.product.pId,             // 商品id
            productName: order.product.name,          // 商品名称
            payChannelType: payChannelType,           // 支付方式
            timestamp: DateFormat.dateFormat(new Date(), 'yyyyMMddhhmmss'),  // 付款时间
            gameUserId: order.gameUserId,
            serverId: order.serverId,
            signType: 'MD5'                           // 定值：MD5
        }

        const sign = Sign.buildSign(data, appKey, ctx); // 构建签名
        data.sign = sign;                               // MD5密文
        const urlEncodedData = queryString.stringify(data); 
        let gameResult = await Request.sendMsg(cbkUrl, urlEncodedData, ctx);
        
        let count = 0;

        // 重发机制，当游戏服务器返回的status不为"success"时，每隔20秒发起一次请求，此过程中如果code返回200就停止定时器（停止发送），或者请求20次以后认为此单为失败单据
        console.log('gameResult####', gameResult)
        if(gameResult.status && gameResult.status === "success"){
            query.update = {$set:{ type: '3' }};
            await dao.order.updateOneOrder(query);
        }else{
            let testTimer= new Timer(async ()=>{
                testTimer.pause();
                count++;
                gameResult = await Request.sendMsg(cbkUrl, urlEncodedData, ctx);
                testTimer.resume();

                // console.log('count######', count);
                // console.log('code', gameResult.code);

                // 订单状态修改为成功
                if(gameResult.code === 200){
                    testTimer.stop();
                    query.update = {$set:{ type: '3' }};
                    await dao.order.updateOneOrder(query);
                    return
                }

                // 重发10次后依然不成功，订单状态改为处理失败
                if(count === 10){
                    testTimer.stop();
                    query.update = {$set:{ type: '0' }};
                    await dao.order.updateOneOrder(query);
                    return
                }
            },20000);
        }
        return 'success=Y'
    }

    // 构建form表单填充数据，用于请求第三方支付服务
    async getPostData (reqBody) {

        const { ctx, dao } = this;
        const { cpOrder, payChannelType } = reqBody;

        ctx.logger.info(`getPostData cpOrder:${ cpOrder } `);

        const gameOrder = await dao.order.getOneOrder({ find: { cpOrder: cpOrder } });

        const { amount, _id, mhtOrderStartTime, product } = gameOrder;
        const data = {
            funcode: 'WP001',                                // 功能码
            version: '1.0.0',                                // 接口版本号
            appId: '159739883292211',                        // 商户应用唯一标识(聚合支付平台的商家应用的应用编号)
            mhtOrderNo: _id.toString(),                      // 商户订单号(咱们的payserver生成的订单唯一id)
            // mhtOrderName: '钻石',                            // 商户商品名称
            mhtOrderName: product.name,                      // 商户商品名称
            mhtOrderType: '01',                              // 商户交易类型
            mhtCurrencyType: '156',                          // 商户订单币种类型
            mhtOrderAmt: amount,                             // 商户订单交易金额
            // mhtOrderDetail: '测试数据',                       // 商户订单详情
            mhtOrderDetail: product.describe,                // 商户订单详情
            mhtOrderStartTime: mhtOrderStartTime,            // 商户订单开始时间
            notifyUrl: 'http://47.104.201.169:7007/payCallBack',                                  // 商户后台通知url
            frontNotifyUrl: 'http://47.104.201.169:7007/paySuccess',                              // 商户前台通知URL
            mhtCharset: 'UTF-8',                             // 商户字符编码
            deviceType: '0601',                              // 设备类型
            outputType: '',                                 // 输出格式    微信 0 直接跳转支付页面 2 返回weixin://支付链接，需商户在前端使用html中的a标签调起支付  支付宝 outputType=0时，直接跳转支付宝支付页面，2时返回tn需要我么能调起支付
            payChannelType: payChannelType,                  // 用户所选渠道类型  银联：20   支付宝：12   微信：13   招行一网通：17
            // mhtReserved: '',                                 // 保留字段，暂时不传
            // mhtLimitPay: '1',                                // 是否支持信用卡支付   0：禁用信用卡  1：允许使用信用卡默认禁用信用卡 (非必须字段)
            consumerCreateIp: '',                            // 用户支付ip paychanneltype=13  且outputtype=0、1、5   时必填
            // consumerId: '',                                  // 消费者id   消费者在商户系统的ID，必须唯一。招行一网通渠道必填
            mhtSignType: 'MD5',                              // 商户签名方法
            // mhtSignature: ''                                 // 除mhtSignature字段外，所有参数都参与MD5签名
        }
        // 判断如果是微信支付旧调用第三方的outputType='0'模式
        if(data.payChannelType === '13'){
            data.outputType = '0'
        }else{
            data.outputType = '0';
        }

        // 根据第三方参数规则   paychanneltype=13 且 outputtype=0、1、5 时必填 consumerCreateIp
        if(data.payChannelType === '13' && (data.outputType === '0' || data.outputType === '1' || data.outputType === '5')){
            data.consumerCreateIp = ctx.request.ip
        }
        
        const MD5_KEY = '3WYC0iAh9BJqyEcKhqtFYczGBKnXH9Rx'; // 现在支付平台创建应用时生成
        const sign = Sign.buildSign(data, MD5_KEY, ctx);   // 构建签名
        data.mhtSignature = sign;

        ctx.logger.info('postData-result-----:', JSON.stringify(data));
        return data;
    } 

    // 查询第三那方现在支付的的订单
    async getOrderFortirdParty (reqBody){

        const { ctx, dao } = this;
        const { mhtOrderNo } = reqBody;

        ctx.logger.info('getOrderFortirdParty mhtOrderNo:', JSON.stringify(mhtOrderNo));

        let errorObj = null;
        let errorBody = null;
        const cbkUrl = 'https://pay.ipaynow.cn/';
        const data = {
            funcode: 'MQ002',
            version: '1.0.0',
            deviceType: '0601',
            appId:'159739883292211',
            mhtOrderNo: mhtOrderNo,
            mhtCharset: 'UTF-8',
            mhtSignType: 'MD5'
        }

        const MD5_KEY = '3WYC0iAh9BJqyEcKhqtFYczGBKnXH9Rx'; // 现在支付平台创建应用时生成
        const sign = Sign.buildSign(data, MD5_KEY, ctx);   // 构建签名
        data.mhtSignature = sign;
        const urlEncodedData = queryString.stringify(data);  // 由于第三方提供的接口需要以
        const result = queryString.parse(await Request.sendMsg(cbkUrl, urlEncodedData, ctx));

        if(result.responseCode !== 'A001'){
            errorObj = { code: ERR_CODE.NO_DATA_ERR, message: result.responseMsg };
            errorBody = new PayServerError(errorObj);

            if (!errorBody) {
                errorBody = { code: ERR_CODE.SERVER_ERR, message: 'error构建失败' };
            }

            ctx.throw(errorBody);
        }
        return result
    }
}

module.exports = payServer;