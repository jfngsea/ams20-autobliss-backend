import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CreateUserDto, LoginUserDto } from '../dtos/auth.dto';
import HttpException from '../exceptions/HttpException';
import { CookieData, DataStoredInAccessToken, DataStoredInRefreshToken, TokenData } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';
import { AuthUser } from '../entity/auth.entity';
import { isEmpty } from '../utils/util';
import { CookieOptions } from 'express';

class AuthService {
  public users = AuthUser;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const userRepository = getRepository(this.users);
    const findUser: AuthUser = (await userRepository.findOne({ where: { email: userData.email } })) as AuthUser;
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: AuthUser = await userRepository.save({ ...userData, password: hashedPassword });
    return createUserData;
  }

  public async login(userData: LoginUserDto): Promise<{ accessTokenData: TokenData; findUser: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const userRepository = getRepository(this.users);
    const findUser: AuthUser = (await userRepository.findOne({ where: { email: userData.email } })) as AuthUser;
    if (!findUser) throw new HttpException(409, `Your email ${userData.email} not found`);

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Your password not matching');

    const accessToken = this.createAccessToken(findUser);
    //const refreshToken = await this.createRefreshToken(findUser);

    //return { accessTokenData: accessToken, refreshTokenData: refreshToken, findUser };
    return { accessTokenData: accessToken, findUser };
  }

  public async logout(userData: User): Promise<AuthUser> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const userRepository = getRepository(this.users);
    const findUser: AuthUser = (await userRepository.findOne({ where: { id: userData.id } })) as AuthUser;
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public createAccessToken(user: AuthUser): TokenData {
    const dataStoredInToken: DataStoredInAccessToken = { id: user.id, email: user.email, name: user.name, role: user.role };
    const secret: string = <string>process.env.JWT_SECRET;
    //const expiresIn: number = 60 * 5; //5min
    const expiresIn: number = 60 * 60 * 24 * 7; //7d
    const token = jwt.sign(dataStoredInToken, secret, { expiresIn });

    return { expiresIn, token: token };
  }

  public async createRefreshToken(user: AuthUser): Promise<TokenData> {
    const dataStoredInToken: DataStoredInRefreshToken = { id: user.id, version: user.refreshTokenVersion };
    const secret: string = <string>process.env.JWT_SECRET;
    const expiresIn: number = 60 * 60 * 24 * 7; //7d
    const token = jwt.sign(dataStoredInToken, secret, { expiresIn });

    return { expiresIn, token: token };
  }

  public createRefreshCookie(refreshTokenData: TokenData): CookieData {
    //` HttpOnly; Max-Age=${refreshTokenData.expiresIn};
    const options: CookieOptions = {
      maxAge: 1000 * refreshTokenData.expiresIn,
      httpOnly: true,
      sameSite: 'lax',
    };
    return { name: `RefreshToken`, val: `${refreshTokenData.token}`, options };
  }

  public createAccessCookie(accessTokenData: TokenData): CookieData {
    const options: CookieOptions = {
      maxAge: 1000 * accessTokenData.expiresIn,
      httpOnly: true,
      sameSite: 'lax',
    };
    return { name: `Authorization`, val: `${accessTokenData.token}`, options };
  }

  public async updateAccessToken(refreshToken: string): Promise<TokenData> {
    const user: AuthUser = await this.verifyRefreshToken(refreshToken);
    return this.createAccessToken(user);
  }

  public async updateRefreshToken(refreshToken: string): Promise<TokenData> {
    const user: AuthUser = await this.verifyRefreshToken(refreshToken);
    return this.createRefreshToken(user);
  }

  public async verifyRefreshToken(refreshToken: string): Promise<AuthUser> {
    const refreshTokenData: DataStoredInRefreshToken = (await jwt.verify(refreshToken, <string>process.env.JWT_SECRET)) as DataStoredInRefreshToken;
    const user: AuthUser = (await getRepository(this.users).findOne({ where: { id: refreshTokenData.id } })) as AuthUser;
    //checks if user's previous refresh tokens have been invalidated
    if (refreshTokenData.version !== user.refreshTokenVersion) {
      throw new HttpException(401, 'Refresh Token Invalid!');
    }
    return user;
  }

  public async invalidateRefreshTokens(user: User): Promise<boolean> {
    await getRepository(this.users).increment({ id: user.id }, 'refreshTokenVersion', 1);
    return true;
  }
}

export default AuthService;
