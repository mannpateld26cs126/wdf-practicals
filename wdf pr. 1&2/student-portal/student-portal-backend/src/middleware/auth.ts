import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'access_secret';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, ACCESS_SECRET) as any;
    // attach user minimal info to request
    (req as any).user = { id: payload.sub, email: payload.email, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
