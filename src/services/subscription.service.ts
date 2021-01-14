import { getRepository } from "typeorm";
import { Subscription } from "../entity/subscription.entity";
import HttpException from "../exceptions/HttpException";
import { User } from "../interfaces/users.interface";

export class SubscriptionService {

  public async createSubscription(user: User, prodId: number): Promise<boolean> {
    const subRepo = getRepository(Subscription);
    const result = await subRepo.save({partId:prodId, userEmail:user.email, userId:user.id.toString()});
    if(!result){throw new HttpException(500, "Sub Db error")}
    return true;
  }

  public async getSubscription(user: User): Promise<Subscription[]> {
    const subRepo = getRepository(Subscription);
    return subRepo.find({ userId: user.id.toString() });
  }

  public async deleteSubscription(user: User, subId: number): Promise<boolean> {
    const subRepo = getRepository(Subscription);
    await subRepo.delete({subId: subId});
    return true;
  }

  
}
