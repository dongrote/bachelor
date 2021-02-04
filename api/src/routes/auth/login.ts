import { Request, Response, NextFunction } from 'express';
import HttpError from 'http-error-constructor';
import createUserTokens from '../../core/auth/createUserTokens';
import loginUser from '../../core/http/loginUser';
import User from '../../core/User';

export = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {username, password} = req.body;
    const user = await User.verifyCredentials(username, password);
    if (user) loginUser(res, await createUserTokens(user));
    res.sendStatus(user ? 204 : 400);
  } catch (err) {
    return next(new HttpError(400, err.message));
  }
};
