'use strict';


const Subscription = require('egg').Subscription;
const axios = require('axios');

class UpdateCache extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
      return {
        interval: '5s', // 1 分钟间隔
        disable: true, // 开关，控制定时任务是否开启
        type: 'all', // 指定所有的 worker 都需要执行
      };
    }
  
    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
      return new Promise((resolve, reject)=>{
        axios.post('http://127.0.0.1:7007/promiseParam/api', {
            firstName: 'Fred',
            lastName: 'Flintstone'
        })
        .then(function (response) {
            const result = response.data
            resolve(result);
        })
        .catch(function (error) {
            console.log('error', error)
            reject(error);
        });
    })
    }
  }
  
  module.exports = UpdateCache;