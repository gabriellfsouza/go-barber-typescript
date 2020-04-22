import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../configs/authConfig';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
  subject: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const { authorization } = request.headers;

  if (!authorization) throw new Error('JWT token is missing');

  const [, token] = authorization.split(' ');
  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub, subject } = decoded as TokenPayload;

    request.user = { id: sub || subject };

    return next();
  } catch {
    throw new Error('Invalid JWT Token');
  }
}
