import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExpressRequestInterface } from 'src/types/expressRequest.interface';
import { verify } from 'jsonwebtoken';
import { UserService } from '../service/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userServise: UserService) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];
    console.log(token);

    try {
      const decode = verify(token, process.env.JWT_SECRET);
      const user = await this.userServise.findById(decode.id);
      req.user = user;
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
