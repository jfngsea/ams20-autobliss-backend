import { CookieOptions, Request } from 'express';
import { User } from './users.interface';

export interface DataStoredInAccessToken {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface DataStoredInRefreshToken {
  id: string;
  version: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface CookieData {
  name: string;
  val: string;
  options: CookieOptions;
}
