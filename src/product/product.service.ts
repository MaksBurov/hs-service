import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { CreateProductDto } from './dto/creacteProduct.dto';
import {
  ProductResponseInterface,
  ProductsResponseInterface,
} from './types/productResponse.interface';
import slugify from 'slugify';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find();
  }

  async createProduct(
    currentUser: UserEntity,
    CreateProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const product = new ProductEntity();
    Object.assign(product, CreateProductDto);

    if (!product.tagList) {
      product.tagList = [];
    }

    product.slug = this.getSlug(CreateProductDto.title);
    product.author = currentUser;

    return await this.productRepository.save(product);
  }

  buildProductsResponse(products: ProductEntity[]): ProductsResponseInterface {
    return { products };
  }

  buildProductResponse(product: ProductEntity): ProductResponseInterface {
    return { product };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
