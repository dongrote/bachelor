'use strict';
const _ = require('lodash');

function SignedToken(options) {
  this.signed = null;
  this.decoded = null;
  this.signingKey = _.get(options, 'signingKey', _.get(options, 'key'));
  this.verifykey = _.get(options, 'verifykey', _.get(options, 'key'));
  this.algorithm = _.get(options, 'algorithm', 'HS256');
  this.expiresInSeconds = _.get(options, 'expiresInSeconds');
}

exports = module.exports = SignedToken;

const jwt = require('jsonwebtoken');

SignedToken.prototype.sign = function(payload) {
  return new Promise((resolve, reject) => {
    const signOptions = {algorithm: this.algorithm};
    if (this.expiresInSeconds) {
      signOptions.expiresIn = this.expiresInSeconds;
    }
    jwt.sign(payload, this.signingKey, signOptions, (err, signed) => err ? reject(err) : resolve(signed));
  })
  .then(signed => {
    this.signed = signed;
    this.decoded = jwt.decode(signed);
    return signed;
  });
};

SignedToken.prototype.verify = function(signed) {
  return new Promise((resolve, reject) => {
    jwt.verify(signed, this.verifykey, {algorithms: [this.algorithm]}, (err, decoded) => err ? reject(err) : resolve(decoded));
  })
  .then(decoded => {
    this.decoded = decoded;
    this.signed = signed;
    return decoded;
  });
};

SignedToken.prototype.issuedAt = function() { return new Date(this.decoded.iat); };

SignedToken.prototype.token = function() { return this.decoded; };

SignedToken.prototype.toString = function() { return this.signed; };

SignedToken.prototype.cookieValue = function() { return this.signed; };
