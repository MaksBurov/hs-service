import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { Repository, In } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { CreateProductDto } from './dto/creacteProduct.dto';
import {
  ProductResponseInterface,
  ProductsResponseInterface,
} from './types/productResponse.interface';
import slugify from 'slugify';
import { FindByIdsDto } from './dto/findByIds.dto';
import { CheckouProductsDto } from './dto/checkoutProducts.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly mailerService: MailerService,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find();
  }

  async findByIds(FindByIdsDto: FindByIdsDto): Promise<ProductEntity[]> {
    return await this.productRepository.findBy({
      id: In(FindByIdsDto.ids),
    });
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

  async checkoutProducts(CheckouProductsDto: CheckouProductsDto): Promise<any> {
    await this.mailerService.sendMail({
      to: process.env.MAIL_FROM,
      from: 'Мыло ручной работы <handmade-soap@internet.ru>',
      subject: 'Заказ на мыло',
      text: 'test',
      html: `
        <div>ФИО: ${CheckouProductsDto.name}</div><br />
        <div>Email: ${CheckouProductsDto.email}</div><br />
        <div>Телефон: ${CheckouProductsDto.phone}</div><br />
        <div>Адрес: ${CheckouProductsDto.address}</div><br />
        <div>Комментарий: ${CheckouProductsDto.comment}</div><br />
        <div>Ids: ${CheckouProductsDto.products}</div><br />
      `,
    });
  }
}
