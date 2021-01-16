import { getRepository } from 'typeorm';
import { NewCommentDto, NewProductDto, ProductDto, SearchDto } from '../dtos/product.dto';
import { Comment } from '../entity/comment.enity';
import { Part } from '../entity/product.entity';
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

    console.log(searchData);

    const qb = partRepo.createQueryBuilder('parts');
    qb.where("parts.name like :name", { name:`%${searchData.query}%` });

    if(searchData.carBrand){
      qb.andWhere("parts.carBrand like :name", { name:`%${searchData.carBrand}%` });
    }

    if(searchData.carModel){
      qb.andWhere("parts.carModel like :name", { name:`%${searchData.carModel}%` });
    }

    if(searchData.makerId){
      qb.andWhere("parts.makerId like :name", { name:`%${searchData.makerId}%` });
    }

    if(searchData.ean){
      qb.andWhere("parts.ean like :name", { name:`%${searchData.ean}%` });
    }

    return qb.getMany();
  }

  public async getPartData(partId: ProductDto): Promise<Part> {
    const part = await getRepository(Part).find({id:partId.id});
    return part[0];
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

  public async getComments(part: ProductDto): Promise<Comment[]> {
    return getRepository(Comment).find({ partId: part.id});
  }

  public async addComent(user: User, comment: NewCommentDto): Promise<boolean>{
    getRepository(Comment).save({
      userId:user.id,
      userName:user.name,
      partId:comment.partId,
      content: comment.value
    })
    return true;
  }
}
