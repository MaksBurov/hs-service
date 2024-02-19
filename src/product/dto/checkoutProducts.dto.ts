import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

interface ProductToOrder {
  id: number;
  quantity: number;
}
export class CheckouProductsDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsPhoneNumber('RU')
  readonly phone: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly address: string;

  readonly comment?: string;

  @IsNotEmpty()
  readonly products?: ProductToOrder[];
}
