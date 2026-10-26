import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // eslint-disable-next-line no-console
  console.error(err?.message || err);
  const status = err?.status || 500;
  return res.status(status).json({ message: err?.message || 'Internal server error' });
}
