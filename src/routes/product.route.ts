import { Router } from 'express';
import { ProductDto, NewProductDto, SearchDto, UpdateProductDto, NewCommentDto } from '../dtos/product.dto';
import Route from '../interfaces/routes.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import ProductController from '../controllers/product.controller';
import authMiddleware from '../middlewares/auth.middleware';
import checkUserRoleMiddleware from '../middlewares/checkUserRole.middleware';

class ProductRoute implements Route {
  path = '/api/product';
  public router = Router();
  public controller = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/suggestions', this.controller.generalSuggestions);
    this.router.post('/search', validationMiddleware(SearchDto, 'body'), this.controller.search);

    this.router.post('/part', validationMiddleware(ProductDto, 'body'), this.controller.getProductInfo);

    this.router.use('/vendorProducts', authMiddleware, checkUserRoleMiddleware('vendor'));
    this.router.post('/vendorProducts', validationMiddleware(NewProductDto, 'body'), this.controller.addProduct);
    this.router.get('/vendorProducts', this.controller.getVendorProducts);
    this.router.put('/vendorProducts', validationMiddleware(UpdateProductDto, 'body'), this.controller.updateVendorProducts);
    this.router.post('/deleteVendorProducts', validationMiddleware(ProductDto, 'body'), this.controller.deleteVendorProducts);

    this.router.post('/comments', validationMiddleware(ProductDto, 'body'), this.controller.getComments);
    this.router.put('/comments', validationMiddleware(NewCommentDto, 'body'), authMiddleware, this.controller.addComment);
  }
}

export default ProductRoute;
