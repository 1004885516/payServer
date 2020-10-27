'use strict';


/**
 *  对接平台双方约定的参数
 */
module.exports = app => {

  const mongoose = app.mongoose;

  const conn = app.mongooseDB.get('payserver'); 

  const promiseParamSchema = new mongoose.Schema({
    appId: { type: Number },                                      // 游戏id
    appKey: { type: String },                                     // 签名
    cbkUrl: { type: String, default: '' },                        // 游戏端提供的回调地址
    createTime: { type: Date, default: Date.now }                 // 创建时间
  });

  return conn.model('promiseParam', promiseParamSchema);

};