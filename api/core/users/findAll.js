'use strict';
const _ = require('lodash'),
  models = require('../../db/models');

exports = module.exports = async options => {
  const {count, rows} = await models.User.findAndCountAll({
    offset: _.get(options, 'offset', 0),
    limit: _.get(options, 'limit'),
  });
  return {count, users: rows.map(r => r.toJSON())};
};
