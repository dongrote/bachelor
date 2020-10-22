'use strict';
const _ = require('lodash');

exports = module.exports = {
  listenPort: () => Number(_.get(process.env, 'PORT', 3000)),
  sqliteDatabasePath: () => _.get(process.env, 'SQLITEDB_PATH', '/var/run/db.sqlite'),
  refreshTokenCookieName: () => _.get(process.env, 'REFRESH_TOKEN_COOKIE_NAME', 'refreshToken'),
  accessTokenCookieName: () => _.get(process.env, 'ACCESS_TOKEN_COOKIE_NAME', 'accessToken'),
  tokenSigningKey: () => _.get(process.env, 'TOKEN_SIGNING_KEY', 'trust me this is secure probably maybe'),
  tokenSigningAlgorithm: () => _.get(process.env, 'TOKEN_SIGNING_ALGORITHM', 'HS256'),
};