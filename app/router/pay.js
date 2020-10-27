'use strict';


/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  
  const { router, controller, middleware } = app;
  const { pay } = controller;

  router.get('/', pay.index);
  // router.get('/payWay', pay.payWay);
  router.get('/paySuccess', pay.paySuccess)
  router.post('/pay/api', pay.payHandler);
  router.post('/payCallBack', pay.payCallBack);




  router.post('/test', pay.test)
};