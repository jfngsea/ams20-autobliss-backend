import { IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

export class SearchDto {
  @IsString()
  public query: string;

  @IsOptional()
  @IsString()
  carBrand: string;

  @IsOptional()
  @IsString()
  carModel: string;

  @IsOptional()
  @IsNumberString()
  makerId: number;

  @IsOptional()
  @IsNumberString()
  ean: number;
}

class ProbuctBaseDto {
  @IsString()
  name: string;

  @IsString()
  carBrand: string;

  @IsString()
  carModel: string;

  @IsNumberString()
  price: number;

  @IsNumberString()
  quantity: number;

  @IsOptional()
  @IsString()
  imgUrl: string;

  @IsNumberString()
  makerId: number;

  @IsNumberString()
  ean: number;
}

export class NewProductDto extends ProbuctBaseDto {
  //doesnnt matter what value comes from endpoint, value will be overriden after
  @IsNumber()
  @IsOptional()
  public vendorId: string;
}

export class UpdateProductDto extends ProbuctBaseDto {
  @IsNumber()
  public id: number;
}

export class ProductDto {
  @IsNumberString()
  public id: number;
}
