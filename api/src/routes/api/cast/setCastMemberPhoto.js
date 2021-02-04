'use strict';
const log = require('debug-logger')('api:cast:photo'),
  fs = require('fs'),
  HttpError = require('http-error-constructor'),
  core = require('../../../core');

const unlinkFile = filepath => new Promise((resolve, reject) => {
  fs.unlink(filepath, err => err ? reject(err) : resolve());
});

exports = module.exports = async (req, res, next) => {
  if (!req.accessToken) return setImmediate(next, new HttpError(401));
  try {
    const seasonCastMember = await core.SeasonCastMember.findById(Number(req.params.id));
    await seasonCastMember.setPhoto(req.accessToken, req.file.path);
    await unlinkFile(req.file.path);
    res.sendStatus(204);
  } catch (e) {
    log.error(e);
    next(new HttpError(400, e.message));
  }
};
