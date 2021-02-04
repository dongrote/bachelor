'use strict';
const _ = require('lodash'),
  path = require('path');

const assetsDirectory = () => _.get(process.env, 'ASSETS_DIRECTORY', '/var/run/assets');

exports = module.exports = {
  assetsDirectory,
  imagesDirectory: () => path.join(assetsDirectory(), _.get(process.env, 'IMAGES_SUBDIRECTORY', 'images')),
  listenPort: () => Number(_.get(process.env, 'PORT', 3000)),
  sqliteDatabasePath: () => _.get(process.env, 'SQLITEDB_PATH', '/var/run/db.sqlite'),
  refreshTokenCookieName: () => _.get(process.env, 'REFRESH_TOKEN_COOKIE_NAME', 'refreshToken'),
  accessTokenCookieName: () => _.get(process.env, 'ACCESS_TOKEN_COOKIE_NAME', 'accessToken'),
  accessTokenExpiresInSeconds: () => Number(_.get(process.env, 'ACCESS_TOKEN_EXPIRES_IN_SECONDS', 60)),
  tokenSigningKey: () => _.get(process.env, 'TOKEN_SIGNING_KEY', 'trust me this is secure probably maybe'),
  tokenSigningAlgorithm: () => _.get(process.env, 'TOKEN_SIGNING_ALGORITHM', 'HS256'),
};
