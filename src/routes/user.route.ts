import { Router } from "express";
import UsersController from "../controllers/users.controller";
import { DelUserDataDto, NewAddressDto, NewCardDto } from "../dtos/user.dto";
import Route from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";
import validationMiddleware from "../middlewares/validation.middleware";

class UserRoute implements Route {
    path = '/api/user';
    public router = Router();
    public controller = new UsersController();
  
    constructor() {
      this.initializeRoutes();
    }
  
    private initializeRoutes() {
      this.router.use('/', authMiddleware);
  
      this.router.get('/address', this.controller.getAddress);
      this.router.post('/address', validationMiddleware(NewAddressDto, 'body'), this.controller.addAdr);
      this.router.delete('/address', validationMiddleware(DelUserDataDto, 'body'), this.controller.delAdr);

      this.router.get('/card', this.controller.getCards);
      this.router.post('/card', validationMiddleware(NewCardDto, 'body'), this.controller.addCard);
      this.router.delete('/card', validationMiddleware(DelUserDataDto, 'body'), this.controller.delCards);
    }
  }
  
  export default UserRoute;
  