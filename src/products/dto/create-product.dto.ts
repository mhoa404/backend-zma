import {
  IsNotEmpty,
  IsNumber,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsMongoId()
  category_id: string;

  @IsOptional()
  @IsNumber()
  sale_price?: number;
}
