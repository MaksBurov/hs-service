import { IsNotEmpty } from 'class-validator';

export class FindByIdsDto {
  @IsNotEmpty()
  readonly ids: number[];
}
