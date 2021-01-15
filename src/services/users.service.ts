import { getRepository } from "typeorm";
import { NewAddressDto, NewCardDto } from "../dtos/user.dto";
import { Address } from "../entity/address.entity";
import { Card } from "../entity/card.entity";
import { User } from "../interfaces/users.interface";

class UserService {
  public async getCards(user: User) {
    return getRepository(Card).find({userId: user.id});
  } 
  
  public async addCard(user: User, card: NewCardDto) {
    return getRepository(Card).save({...card, userId:user.id});
  }

  public async remCard(cardId: string): Promise<boolean> {
    await getRepository(Card).delete({cardId: cardId});
    return true;
  }

  public async getAddresses(user: User) {
    return getRepository(Address).find({userId: user.id});
  } 
  
  public async addAddress(user: User, adr: NewAddressDto) {
    return getRepository(Address).save({...adr, userId:user.id});
  }

  public async remAddress(addressId: string): Promise<boolean> {
    await getRepository(Address).delete({id: addressId});
    return true;
  }
}

export default UserService;
