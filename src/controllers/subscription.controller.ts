import { NextFunction, Response } from "express";
import { DeleteSubDto, NewSubDto } from "../dtos/subscription.dto";
import HttpException from "../exceptions/HttpException";
import { RequestWithUser } from "../interfaces/auth.interface";
import { SubscriptionService } from "../services/subscription.service";

class SubscriptionController {
    public service = new SubscriptionService();

    public addSub = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const sub: NewSubDto = req.body;
            const result = await this.service.createSubscription(req.user, sub.partId);
            if (!result) {
                throw new HttpException(500, 'Server Error');
            }
            res.status(200).json({ message: `Subscription to part ${sub.partId} sucessful` });
        } catch (error) {
            next(error);
        }
    }

    public getSubs = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const results = await this.service.getSubscription(req.user);

            res.status(200).json({ subs: results });
        } catch (error) {
            next(error);
        }

    }

    public deleteSub = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const delSub: DeleteSubDto = req.body;
            const result = await this.service.deleteSubscription(req.user, delSub.subId);
            if (!result) {
               next(new HttpException(500, "Sub DB error"));
            }

            res.status(200).json({ message: "Subscription deleted with Success!" });

        } catch (error) {
            next(error);
        }
    }

}

export default SubscriptionController;