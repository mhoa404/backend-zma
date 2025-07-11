import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../schemas/product.schema';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Category, CategorySchema } from 'src/schemas/category.schema';
import { CartItem, CartItemSchema } from '../schemas/cart-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: CartItem.name, schema: CartItemSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
