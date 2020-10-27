'use strict'


module.exports = app => {
  require('./pay')(app);
  require('./promiseParam')(app);
}