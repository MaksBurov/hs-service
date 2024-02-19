import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { CreateProductDto } from './dto/creacteProduct.dto';
import { FindByIdsDto } from './dto/findByIds.dto';
import { User } from 'src/user/decorators/user.decorator';
import {
  ProductResponseInterface,
  ProductsResponseInterface,
} from './types/productResponse.interface';
import { CheckouProductsDto } from './dto/checkoutProducts.dto';

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

  @Post('/by-ids')
  async findByIds(
    @Body() findByIdsDto: FindByIdsDto,
  ): Promise<ProductsResponseInterface> {
    const products = await this.productSercive.findByIds(findByIdsDto);

    return this.productSercive.buildProductsResponse(products);
  }

  @Post('/checkout')
  async checkoutProducts(
    @Body() checkoutProductsDto: CheckouProductsDto,
  ): Promise<any> {
    await this.productSercive.checkoutProducts(checkoutProductsDto);

    return 'ok';
  }
}
