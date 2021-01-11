import { NextFunction, Request, Response } from 'express';
import path from 'path';

class IndexController {
  public index = (_: Request, res: Response, next: NextFunction): void => {
    try {
      res.sendFile(path.resolve('./public/index.html'));
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
