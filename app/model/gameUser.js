'use strict';


/**
 *  平台用户表
 */
module.exports = app => {

  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('loginserver'); 
  const userSchema = new Schema({
 
  });
  return conn.model('user', userSchema);

};