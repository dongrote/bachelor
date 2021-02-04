import { Response } from 'express';

const httpOnly = true,
  maxAge = 24 * 60 * 60 * 1000; // one day

export default (res: Response, tokens: Array<any>) => {
  tokens.forEach((token: any) => res.cookie(token.cookieName(), token.cookieValue(), {httpOnly, maxAge}));
};
