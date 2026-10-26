import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const user = await authService.register({ email, password, name });
  return res.status(201).json({ user: { id: user.id, email: user.email, role: user.role } });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokens = await authService.login({ email, password });
  return res.json(tokens);
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Missing refreshToken' });
  const tokens = await authService.refresh(refreshToken);
  return res.json(tokens);
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Missing refreshToken' });
  await authService.logout(refreshToken);
  return res.json({ message: 'Logged out' });
};
