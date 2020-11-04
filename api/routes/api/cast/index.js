'use strict';
exports = module.exports = require('express').Router();
const multer = require('multer'),
  create = require('./create'),
  findAll = require('./findAll'),
  update = require('./update'),
  setCastMemberPhoto = require('./setCastMemberPhoto'),
  getCastMemberPhoto = require('./getCastMemberPhoto');

const upload = multer({dest: '/tmp'});

/*
exports.post('/', create);
exports.get('/', findAll);
exports.patch('/:id', update);
*/

exports.post('/:id/photo', upload.single('file'), setCastMemberPhoto);
exports.get('/:id/photo', getCastMemberPhoto);
