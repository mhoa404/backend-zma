import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    sub: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  role: string;
}
