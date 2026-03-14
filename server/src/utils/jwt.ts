import jwt from 'jsonwebtoken';
import { RoleName } from '@prisma/client';
import { env } from '../config/env';

interface TokenPayload {
  id: string;
  role: RoleName;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '1h' });
}

