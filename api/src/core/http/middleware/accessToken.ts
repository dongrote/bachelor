import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import HttpError from 'http-error-constructor';
import env from '../../../env';
import AccessToken from '../../auth/AccessToken';
import User from '../../User';

const httpOnly = true,
  maxAge = 24 * 60 * 60 * 1000;

export = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let error;
  const accessTokenCookie = req.cookies[AccessToken.cookieName()];
  if (!accessTokenCookie) {
    setImmediate(next);
    return;
  }
  try {
    _.set(req, 'accessToken', await AccessToken.verify(accessTokenCookie, env.tokenSigningKey(), {algorithm: env.tokenSigningAlgorithm()}));
  } catch (err) {
    if (_.has(req, 'refreshToken')) {
      const refreshToken = _.get(req, 'refreshToken');
      _.set(req, 'accessToken', await AccessToken.create(await User.findById(refreshToken.userId())));
      const accessToken = _.get(req, 'accessToken');
      res.cookie(accessToken.cookieName(), accessToken.cookieValue(), {httpOnly, maxAge});
    } else {
      res.clearCookie(AccessToken.cookieName(), {httpOnly});
      error = new HttpError(400, err.message);
    }
  }
  next(error);
};
