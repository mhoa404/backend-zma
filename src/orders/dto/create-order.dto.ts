import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

// create-order.dto.ts
export class CreateOrderDto {
  @IsMongoId()
  address_id: string;

  @IsOptional()
  @IsMongoId()
  voucher_id?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  cart_item_ids: string[];

  @IsNotEmpty()
  @IsString()
  payment_method: 'cod' | 'zalopay' | 'vnpay' | 'momo';
}
