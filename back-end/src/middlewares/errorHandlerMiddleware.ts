import {
  AppError,
  errorTypeToStatusCode,
  isAppError,
} from '../utils/errorUtils.js';
import { NextFunction, Request, Response } from 'express';

export function errorHandlerMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (isAppError(err)) {
    return res.status(errorTypeToStatusCode(err.type)).send(err.message);
  }

  return res.sendStatus(500);
}
