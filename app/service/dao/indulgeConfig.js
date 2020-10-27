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

  // 查询防沉迷开关配置
  async getIndulgeconfig (query) {
    const { ctx, model } = this;

    ctx.logger.info('dao/indulgeconfig: getIndulgeconfig  query', JSON.stringify(query));

    return await model.IndulgeConfig
      .findOne(query.find)
      .select(query.select || {})
      .lean()
      .exec();
  }
}


module.exports = pay;