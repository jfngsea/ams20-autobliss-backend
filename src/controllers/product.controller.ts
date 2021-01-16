import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/HttpException';
import { ProductDto, NewProductDto, SearchDto, UpdateProductDto } from '../dtos/product.dto';
import { Part } from '../entity/product.entity';
import { RequestWithUser } from '../interfaces/auth.interface';
import ProductService from '../services/product.service';

class ProductController {
  public service = new ProductService();

  public search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const searchData: SearchDto = req.body;
      const results = await this.service.search(searchData);
      res.status(200).json({ results: results });
    } catch (error) {
      next(error);
    }
  };

  public generalSuggestions = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parts: Part[] = await this.service.getSugestedGeneral();
      res.status(200).json({ parts: parts });
    } catch (error) {
      next(error);
    }
  };

  public getProductInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const partId: ProductDto = req.body;
      const part: Part = await this.service.getPartData(partId);
      res.status(200).json({part:part});
    } catch (error) {
      next(error);
    }
  }

  public addProduct = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newProduct: NewProductDto = req.body;
      //vendor id override
      newProduct.vendorId = req.user.id;
      newProduct.imgUrl = '';
      await this.service.addPart(newProduct);
      res.status(201).json({ message: 'Creates with success' });
    } catch (error) {
      next(error);
    }
  };

  public getVendorProducts = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parts: Part[] = await this.service.getVendorParts(req.user);
      res.status(200).json({ parts: parts });
    } catch (error) {
      next(error);
    }
  };

  public updateVendorProducts = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updatedProduct: UpdateProductDto = req.body;
      const updatedPart: Part = { ...updatedProduct, vendorId: req.user.id };
      const done: boolean = await this.service.updateVendorParts(req.user, updatedPart);
      if (!done) {
        throw new HttpException(500, 'Server Error');
      }
      res.status(200).json({message:`Part ${updatedPart.id} has been updated`});
    } catch (error) {
      next(error);
    }
  };

  public deleteVendorProducts = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deleteProduct: ProductDto = req.body;
      await this.service.deleteVendorPart(deleteProduct.id);

      res.status(200).json({message:`Part ${deleteProduct.id} has been deleted`});
    } catch (error) {
      next(error);
    }
  };
}

export default ProductController;
