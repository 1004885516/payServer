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

  // 添加约定参数配置
  async addPromiseParam (query) {

    const { ctx, model } = this;

    ctx.logger.info('dao/promiseParam: addPromiseParam  query', JSON.stringify(query));

    const doc = query.doc;
    const result = await model.PromiseParam.create(doc);

    return result;
  }
  
  //更新参数配置
  async updatePromiseParam (query) {
    const { ctx, model } = this;

    ctx.logger.info('dao/promiseParam: updatePromiseParam  query', JSON.stringify(query));

    return await model.PromiseParam
      .updateOne(query.find, query.update)
      .exec()
  }
  
  // 查询配置信息
  async getPromiseParam (query) {

    const { ctx, model } = this;
    ctx.logger.info('dao/promiseParam: getPromiseParam  query', JSON.stringify(query));

    return await model.PromiseParam
      .findOne(query.find)
      .select(query.select || {})
      .lean()
      .exec();
  }
}


module.exports = pay;