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

  // 查询单个游戏用户
  async getOneGameUser (query) {

    const { ctx, model } = this;

    ctx.logger.info('dao/gameUser: getOneGameUser  query', JSON.stringify(query));

    return await model.GameUser
      .findOne(query.find)
      .select(query.select || {})
      .lean()
      .exec();
  }
}


module.exports = pay;