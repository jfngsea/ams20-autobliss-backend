import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpException from '../exceptions/HttpException';
import { RequestWithUser } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies;
    const authHeader = req.header('Authorization');
    
    if ( authHeader || (cookies && cookies.Authorization) ) {
      const token = authHeader || cookies.Authorization;
      const secret: string = <string>process.env.JWT_SECRET;
      const userData = (await jwt.verify(<string>token, secret)) as User;

      if (userData) {
        req.user = userData;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
