import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import { DeleteSubDto, NewSubDto } from '../dtos/subscription.dto';
import SubscriptionController from '../controllers/subscription.controller';

class SubscriptionRoute implements Route {
  path = '/api/subscription';
  public router = Router();
  public controller = new SubscriptionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use('/', authMiddleware);

    this.router.get('/', this.controller.getSubs);
    this.router.post('/', authMiddleware, validationMiddleware(NewSubDto, 'body'), this.controller.addSub);
    this.router.delete('/', authMiddleware, validationMiddleware(DeleteSubDto, 'body'), this.controller.deleteSub);
  }
}

export default SubscriptionRoute;
