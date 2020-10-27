'use strict';


/**
 *  sdk快速注册用户表
 */
module.exports = app => {

  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('loginserver'); 
  const fastUserSchema = new Schema({
 
  });
  return conn.model('fastloginuser', fastUserSchema, 'fastloginuser' );

};