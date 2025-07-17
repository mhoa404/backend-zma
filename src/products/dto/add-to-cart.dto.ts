import { IsMongoId } from 'class-validator';

export class AddToCartDto {
  @IsMongoId()
  productId: string;
}
