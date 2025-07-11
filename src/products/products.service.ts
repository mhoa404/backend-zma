import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { CartItem, CartItemDocument } from '../schemas/cart-item.schema';

import { Model, Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(CartItem.name) private cartModel: Model<CartItemDocument>,
  ) {}

  async create(dto: CreateProductDto) {
    return await this.productModel.create(dto);
  }

  async findAll(isAdmin = false) {
    const products = await this.productModel
      .find(isAdmin ? {} : { available: true })
      .populate('category_id')
      .exec();

    if (!isAdmin) {
      return products.filter((p) => {
        const category = p.category_id as any as Category;
        return category?.is_active !== false;
      });
    }

    return products;
  }

  async findOne(id: string, isAdmin = false) {
    const product = await this.productModel
      .findById(id)
      .populate('category_id', 'name')
      .exec();
    if (!product || (!isAdmin && !product.available)) {
      throw new NotFoundException('Sản phẩm không tồn tại hoặc không khả dụng');
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const updated = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Không tìm thấy sản phẩm');
    return updated;
  }

  async toggleAvailable(id: string, available: boolean) {
    const updated = await this.productModel
      .findByIdAndUpdate(id, { available }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Không tìm thấy sản phẩm');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.productModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Không tìm thấy sản phẩm');
    return { message: 'Đã xoá sản phẩm' };
  }

  async addToCart(userId: string, productId: string) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    const existing = await this.cartModel.findOne({
      user_id: new Types.ObjectId(userId),
      product_id: productId,
    });

    if (existing) {
      existing.quantity += 1;
      return existing.save();
    }

    const created = new this.cartModel({
      user_id: new Types.ObjectId(userId),
      product_id: productId,
      quantity: 1,
    });
    return created.save();
  }
}
