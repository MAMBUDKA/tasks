import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors.js';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const isDev = process.env.NODE_ENV !== 'production';
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      type: err.type,
      message: err.message,
      data: err.data ?? {},
      ...(isDev ? { stack: err.stack } : {}),
    });
  }
  console.error(err);
  res.status(500).json({
    type: 'InternalServerError',
    message: err?.message ?? 'Unknown error',
    data: {},
    ...(isDev ? { stack: err?.stack } : {}),
  });
}