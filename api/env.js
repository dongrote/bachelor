'use strict';
const _ = require('lodash');

exports = module.exports = {
  listenPort: () => Number(_.get(process.env, 'PORT', 3000)),
  sqliteDatabasePath: () => _.get(process.env, 'SQLITEDB_PATH', '/var/run/db.sqlite'),
};