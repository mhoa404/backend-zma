import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../schemas/product.schema';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Category, CategorySchema } from 'src/schemas/category.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Product.name, schema: ProductSchema },
    { name: Category.name, schema: CategorySchema }
])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
