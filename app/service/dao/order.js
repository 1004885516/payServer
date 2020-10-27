/**
 * Created by Administrator on 2018/6/26/026.
 */
'use strict';


const Service = require('egg').Service;
const Common = require('../../common');
const { DATA_TYPE } = Common.Validator;

class pay extends Service {

  constructor(ctx) {

    super(ctx);

    this.model = ctx.model;

  }

  // 创建订单信息
  async addPayForOrder (query) {

    const { ctx, model } = this;

    ctx.logger.info('dao/pay:addOrder  query', JSON.stringify(query));

    const doc = query.doc;
    if (!DATA_TYPE.isObject(doc)) {

      ctx.throw(new Error('数据库写入失败，doc is not a object'));

    }

    const result = await model.Order.create(doc);

    return result;
  }

  // 查询单个订单
  async getOneOrder (query) {

    const { ctx, model } = this;

    ctx.logger.info('dao/pay: getOneOrder  query', JSON.stringify(query));

    return await model.Order
      .findOne(query.find)
      .select(query.select || {})
      .lean()
      .exec();
  }
  
  // 更新订单
  async updateOneOrder (query){
    
    const { ctx, model } = this;

    ctx.logger.info('dao/pay: updateOrder  query', JSON.stringify(query));

    return await model.Order
      .updateOne(query.find, query.update)
      .exec()

  }

  // 聚订单金额
  async getMonthAmount (query){
    
    const { ctx, model } = this;

    ctx.logger.info('dao/pay: updateOrder  query', JSON.stringify(query));

    return await model.Order
      .aggregate([query.find, query.group])
      .exec()

  }

}


module.exports = pay;