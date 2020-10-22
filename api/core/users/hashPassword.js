'use strict';
const bcrypt = require('bcryptjs');
exports = module.exports = async password => await bcrypt.hash(password, await bcrypt.genSalt());