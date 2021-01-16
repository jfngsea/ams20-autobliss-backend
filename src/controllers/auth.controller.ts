import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, LoginUserDto } from '../dtos/auth.dto';
import HttpException from '../exceptions/HttpException';
import { CookieData, RequestWithUser, TokenData } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';
import AuthService from '../services/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log('sign up servie');
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData: LoginUserDto = req.body;
      const { accessTokenData, findUser } = await this.authService.login(loginData);
      //const authCookie: CookieData = this.authService.createAccessCookie(accessTokenData);
      //const refreshCookie = this.authService.createRefreshCookie(refreshTokenData);

      
      if (findUser) {
        //res.cookie(authCookie.name, authCookie.val, authCookie.options);
        //res.cookie(refreshCookie.name, refreshCookie.val, refreshCookie.options);
        res.status(200).json({ user: findUser, authToken: accessTokenData});
      
      } else {
        next(new HttpException(409, "Wrong credentials"))
      }
    
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      await this.authService.logout(userData);

      //res.cookie('Authorization', '');
      //res.cookie('RefreshToken', '');
      res.status(200).json({ message: 'User successfully Loged Out' });
    } catch (error) {
      next(error);
    }
  };

  public refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken: string = req.cookies.RefreshToken;
      const newAccessToken: TokenData = await this.authService.updateAccessToken(refreshToken);
      const authCookie: CookieData = this.authService.createAccessCookie(newAccessToken);
      res.cookie(authCookie.name, authCookie.val, authCookie.options);
      res.status(200).json({ message: 'Access Token Refreshed Successfully' });
    } catch (error) {
      next(error);
    }
  };

  public refreshRefreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken: string = req.cookies.RefreshToken;
      const newRefreshToken: TokenData = await this.authService.updateRefreshToken(refreshToken);
      const newAccessToken: TokenData = await this.authService.updateAccessToken(newRefreshToken.token);
      const refreshCookie: CookieData = this.authService.createRefreshCookie(newRefreshToken);
      const authCookie: CookieData = this.authService.createAccessCookie(newAccessToken);

      res.cookie(refreshCookie.name, refreshCookie.val, refreshCookie.options);
      res.cookie(authCookie.name, authCookie.val, authCookie.options);
      res.cookie('user', newAccessToken.token.toString().split('.')[1]);
      res.status(200).json({ message: 'Refresh and Access Tokens updated Successfully' });
    } catch (error) {
      next(error);
    }
  };

  public endAllSessions = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshTokenReset: boolean = await this.authService.invalidateRefreshTokens(req.user);
      if (refreshTokenReset) {
        res.status(200).json({ message: 'Refresh Tokens revoked Successfully' });
      } else {
        res.status(500).json({ message: 'Refresh Tokens not revoked' });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
