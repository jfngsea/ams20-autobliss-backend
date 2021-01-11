import { getRepository } from 'typeorm';
import { NewProductDto, SearchDto } from '../dtos/product.dto';
import { Part } from '../entity/product.entity';
import { Subscription } from '../entity/subscription.entity';
import HttpException from '../exceptions/HttpException';
import { User } from '../interfaces/users.interface';
import { isEmpty } from '../utils/util';

export default class ProductService {
  public async getSugestedGeneral(): Promise<Part[]> {
    try {
      const data: Part[] = await getRepository(Part).createQueryBuilder().select().orderBy().limit(6).getMany();
      return data;
    } catch (error) {
      throw new HttpException(500, 'DB error');
    }
  }

  public async getSugestedUser(user: User): Promise<void> {}

  public async search(searchData: SearchDto): Promise<Part[]> {
    const partRepo = getRepository(Part);
    const result = partRepo.findAndCount({});

    return result[0];
  }

  public async addPart(partData: NewProductDto): Promise<void> {
    if (isEmpty(partData)) throw new HttpException(400, 'Bad Request');

    const partRepo = getRepository(Part);
    partRepo.save({ ...partData });
  }

  public async getVendorParts(vendor: User): Promise<Part[]> {
    if (isEmpty(vendor)) throw new HttpException(400, 'Bad Request');

    const partRepo = getRepository(Part);

    const data: Part[] = await partRepo.find({ vendorId: vendor.id });
    return data;
  }

  public async updateVendorParts(vendor: User, part: Part): Promise<boolean> {
    if (isEmpty(vendor)) throw new HttpException(400, 'Bad Request');

    const partRepo = getRepository(Part);
    part.imgUrl = '';

    //await partRepo.update({ id: part.id }, part);
    await partRepo.save(part, {data: {price:part.price, quantity: part.quantity}});

    return true;
  }

  public async deleteVendorPart(id: number): Promise<void> {
    const partRepo = getRepository(Part);
    await partRepo.delete({ id: id });
  }

  public async createSubscription(user: User, prodId: number): Promise<boolean> {
    const subRepo = getRepository(Subscription);
    //const sub: Subscription = {subId: -1,partId:prodId, userEmail:user.email, userId: user.id}
    //{partId:prodId, userEmail:user.email, userId: user.id}
    const result = await subRepo.save({partId:prodId, userEmail:user.email, userId:user.id.toString()});
    if(!result){throw new HttpException(500, "Sub Db error")}
    return true;
  }
}
