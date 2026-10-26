import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret';
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

export async function register({ email, password, name }: { email: string; password: string; name?: string }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email already in use');
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({ data: { email, password: hash, name } });
  return user;
}

function signAccess(user: { id: string; email: string; role: string }) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

function signRefresh(user: { id: string }) {
  return jwt.sign({ sub: user.id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export async function login({ email, password }: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Invalid credentials');

  const accessToken = signAccess({ id: user.id, email: user.email, role: user.role });
  const refreshToken = signRefresh({ id: user.id });

  const decoded: any = jwt.decode(refreshToken);
  const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 3600 * 1000);

  await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });

  return { accessToken, refreshToken };
}

export async function refresh(token: string) {
  try {
    const payload: any = jwt.verify(token, REFRESH_SECRET);
    const userId = payload.sub as string;

    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored) throw new Error('Invalid refresh token');
    if (stored.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: stored.id } });
      throw new Error('Refresh token expired');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    // rotate refresh token
    await prisma.refreshToken.delete({ where: { id: stored.id } });

    const accessToken = signAccess({ id: user.id, email: user.email, role: user.role });
    const refreshToken = signRefresh({ id: user.id });
    const decoded: any = jwt.decode(refreshToken);
    const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 3600 * 1000);

    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error('Invalid token');
  }
}

export async function logout(token: string) {
  await prisma.refreshToken.deleteMany({ where: { token } });
}
