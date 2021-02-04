'use strict';
const log = require('debug-logger')('api:cast:photo'),
  HttpError = require('http-error-constructor'),
  fs = require('fs'),
  core = require('../../../core');

exports = module.exports = (req, res, next) => {
  if (!req.accessToken) return Promise.resolve(setImmediate(next, new HttpError(401)));
  return core.SeasonCastMember.findById(Number(req.params.id))
    .then(seasonCastMember => seasonCastMember ? seasonCastMember.imageFilepath() : Promise.reject(new HttpError(404)))
    .then(imageFilepath => new Promise((resolve, reject) => {
      fs.stat(imageFilepath, (err, stats) => {
        if (err) return reject(err);
        if (stats.size === 0) return reject(new HttpError(404));
        res.sendFile(imageFilepath, err => err ? reject(err) : resolve());
      });
    }))
    .catch(err => {
      log.error(err);
      next(new HttpError(400, err.message));
    });
};
