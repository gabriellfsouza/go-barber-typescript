import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@configs/authConfig';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
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

  if (!authorization) throw new AppError('JWT token is missing', 401);

  const [, token] = authorization.split(' ');
  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub, subject } = decoded as ITokenPayload;

    request.user = { id: sub || subject };

    return next();
  } catch {
    throw new AppError('Invalid JWT Token', 401);
  }
}
