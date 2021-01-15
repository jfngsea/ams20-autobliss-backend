import { NextFunction, Request, Response } from "express";
import { DelUserDataDto, NewAddressDto, NewCardDto } from "../dtos/user.dto";
import HttpException from "../exceptions/HttpException";
import { RequestWithUser } from "../interfaces/auth.interface";
import UserService from "../services/users.service";

class UsersController {

  public service = new UserService();

  public getCards = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const cards = await this.service.getCards(req.user);
      res.status(200).json({cards: cards});
    } catch (error) {
      next(error);
    }
  }

  public addCard = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const newCard: NewCardDto = req.body;
      const card = await this.service.addCard(req.user, newCard);
      res.status(200).json({card: card, message:"Card added with success!"});
    } catch (error) {
      next(error);
    }
  }

  public delCards = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const delCard: DelUserDataDto = req.body;
      const done = await this.service.remCard(delCard.id);
      if(!done) {next(new HttpException(500, "Card db error on delete"))}
      res.status(200).json({message:"Card deleted with success!"});
    } catch (error) {
      next(error);
    }
  }

  public getAddress = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const adrs = await this.service.getAddresses(req.user);
      res.status(200).json({adrs: adrs});
    } catch (error) {
      next(error);
    }
  }

  public addAdr = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const newAdr: NewAddressDto = req.body;
      const adr = await this.service.addAddress(req.user, newAdr);
      res.status(200).json({adr: adr, message:"Address added with success!"});
    } catch (error) {
      next(error);
    }
  }

  public delAdr = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const delAdr: DelUserDataDto = req.body;
      const done = await this.service.remAddress(delAdr.id);
      if(!done) {next(new HttpException(500, "Address db error on delete"))}
      res.status(200).json({message:"Address deleted with success!"});
    } catch (error) {
      next(error);
    }
  }
}

export default UsersController;
