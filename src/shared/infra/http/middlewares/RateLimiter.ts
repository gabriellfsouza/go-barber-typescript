import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import cacheConfig from '@configs/cacheConfig';
import AppError from '@shared/errors/AppError';

const { host, port, password } = cacheConfig.config.redis;

const redisClient = redis.createClient({
  host,
  port,
  password,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 5,
  duration: 5,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);
    next();
  } catch (error) {
    throw new AppError('Too many requests', 429);
  }
}
