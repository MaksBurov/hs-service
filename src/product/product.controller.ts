import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { CreateProductDto } from './dto/creacteProduct.dto';
import { User } from 'src/user/decorators/user.decorator';
import {
  ProductResponseInterface,
  ProductsResponseInterface,
} from './types/productResponse.interface';

@Controller('products')
export class ProductController {
  constructor(private readonly productSercive: ProductService) {}

  @Get()
  async findAll(): Promise<ProductsResponseInterface> {
    const products = await this.productSercive.findAll();

    return this.productSercive.buildProductsResponse(products);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @User() currentUser: UserEntity,
    @Body('product') createProductDto: CreateProductDto,
  ): Promise<ProductResponseInterface> {
    const product = await this.productSercive.createProduct(
      currentUser,
      createProductDto,
    );

    return this.productSercive.buildProductResponse(product);
  }
}