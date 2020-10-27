'use strict';


/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  
  const { router, controller } = app;
  const { promiseParam } = controller;
  
  router.post('/promiseParam/api', promiseParam.promiseParamHandler);
};