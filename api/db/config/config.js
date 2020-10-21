const env = require('../../env');

exports = module.exports = {
  development: {
    dialect: 'sqlite',
    storage: env.sqliteDatabasePath(),
  },
  test: {
    dialect: 'sqlite',
    storage: env.sqliteDatabasePath(),
  },
  production: {
    dialect: 'sqlite',
    storage: env.sqliteDatabasePath(),
    logging: () => null,
  },
};