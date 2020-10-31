'use strict';
const HttpError = require("http-error-constructor"),
  core = require('../../../core');

exports = module.exports = async (req, res, next) => {
  const {accessToken} = req;
  if (!accessToken) {
    return next(new HttpError(400));
  }
  try {
    const user = await core.User.findById(accessToken.userId());
    res.json(user.profile());  
  } catch (e) {
    next(new HttpError(400, e.message));
  }
};