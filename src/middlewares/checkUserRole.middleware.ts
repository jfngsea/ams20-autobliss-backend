import { NextFunction, Response } from "express";
import HttpException from "../exceptions/HttpException";
import { RequestWithUser } from "../interfaces/auth.interface";

const checkUserRoleMiddleware = (role: string = 'user') => {
    return (req: RequestWithUser, _:Response, next: NextFunction) => {
        if(req.user.role !== role) {
            next(new HttpException(401, 'Unauthorized Request'));
        } else {
            next();
        }

    }
}

export default checkUserRoleMiddleware;