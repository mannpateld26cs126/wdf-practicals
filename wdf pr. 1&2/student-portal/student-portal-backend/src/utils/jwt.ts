import jwt from 'jsonwebtoken';

export function sign(payload: object, secret: string, expiresIn: string | number) {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verify(token: string, secret: string) {
  return jwt.verify(token, secret);
}
