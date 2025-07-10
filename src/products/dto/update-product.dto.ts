import { IsOptional, IsString, IsNumber, IsBoolean, IsMongoId } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsMongoId()
  category_id?: string;

  @IsOptional()
  @IsNumber()
  sale_price?: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
