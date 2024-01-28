import { ProductEntity } from '../product.entity';

export interface ProductResponseInterface {
  product: ProductEntity;
}

export interface ProductsResponseInterface {
  products: ProductEntity[];
}
