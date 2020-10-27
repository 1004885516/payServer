'use strict';

const { string } = require("@hapi/joi");


/**
 *  游戏充值订单信息表
 */
module.exports = app => {

  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('payserver'); 
  const orderSchema = new Schema({
    gameId: { type: String },                                     // 游戏id
    amount: { type: Number },                                     // 本单消费金额
    type: { type: String, default: '1' },                         // 订单处理状态    1：已提交   2.处理中   3：处理完成 0:处理失败
    payMode: { type: String },                                    // 支付方式       1：微信  2：支付宝  3.银行
    cpOrder: { type: String },                                    // 游戏方订单id
    mhtOrderStartTime: { type: String },                          // 订单开始时间
    // 支付成功后第三方返回结果数据回填
    appId: { type: String },                                      // 商户应用唯一标识(也就是我们在聚合平台注册应用的应用编号)
    payChannelType:{ type: String},                               // 支付方式   银联：20   支付宝：12   微信：13   招行一网通：17
    deviceType: { type: String },                                 // 设备类型     (第三方支付约定的定值0601)
    version: { type: String },                                    // 接口版本号   (第三方支付约定的定值 1.0.0)
    mhtCurrencyType: { type: String },                            // 币种   (156人民币)
    payTime: { type: String },                                    // 支付成功时间
    mhtOrderType: { type:String },                                // 交易类型   01普通消费    05 代理消费
    channelOrderNo: { type: String },                             // 渠道订单号  (交易成功时返回)
    nowPayOrderNo: { type: String },                              // 现在支付流水号
    callbackUrl: { type: String },                                // 游戏端回调接口
    gameUserId: { type:String },                                  // 游戏角色id
    serverId: { type: String },                                   // 游戏服务器id
    product: {
        pId: { type: String },                                    // 商品 id
        name: { type: String },                                   // 商品名称
        describe: { type: String },                               // 商品描述
        unitPrice: { type: Number },                              // 商品单价
        num: { type: Number },                                    // 商品数量
    },
    user: {
        userId: { type: String },                                 // 充值用户id
        userName: { type: String },                               // 充值用户名称
    },
    createTime: { type: Date, default: Date.now }                 // 创建时间
  });

  return conn.model('order', orderSchema);

};