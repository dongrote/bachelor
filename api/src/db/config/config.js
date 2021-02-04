const env = require('../../env');

exports = module.exports = {
  development: {
    dialect: 'sqlite',
    storage: env.sqliteDatabasePath(),
    seederStorage: 'sequelize',
    logging: () => null,
  },
  test: {
    dialect: 'sqlite',
    storage: env.sqliteDatabasePath(),
    seederStorage: 'sequelize',
  },
  production: {
    dialect: 'sqlite',
    storage: env.sqliteDatabasePath(),
    seederStorage: 'sequelize',
    logging: () => null,
  },
};
