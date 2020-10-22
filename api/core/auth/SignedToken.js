'use strict';
const _ = require('lodash'),
  jwt = require('jsonwebtoken');

class SignedToken {
  constructor(options) {
    this.signed = null;
    this.decoded = null;
    this.signingKey = _.get(options, 'signingKey', _.get(options, 'key'));
    this.verifykey = _.get(options, 'verifykey', _.get(options, 'key'));
    this.algorithm = _.get(options, 'algorithm', 'HS256');
  }

  sign(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.signingKey, {algorithm: this.algorithm}, (err, signed) => err ? reject(err) : resolve(signed));
    })
    .then(signed => {
      this.signed = signed;
      this.decoded = jwt.decode(signed);
      return signed;
    });
  }

  verify(signed) {
    return new Promise((resolve, reject) => {
      jwt.verify(signed, this.verifykey, {algorithms: [this.algorithm]}, (err, decoded) => err ? reject(err) : resolve(decoded));
    })
    .then(decoded => {
      this.decoded = decoded;
      this.signed = signed;
      return decoded;
    });
  }

  issuedAt() { return new Date(this.decoded.iat); }

  token() { return this.decoded; }

  toString() { return this.signed; }

  cookieValue() { return this.signed; }
}

exports = module.exports = SignedToken;