'use strict';


/**
 *  防成谜配置表
 */
module.exports = app => {

  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('loginserver'); 
  const indulgeConfigSchema = new Schema({
 
  });
  return conn.model('indulgeconfig', indulgeConfigSchema);

};