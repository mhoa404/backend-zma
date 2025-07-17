// src/orders/orders.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartItem, CartItemDocument } from '../schemas/cart-item.schema';
import { Product } from '../schemas/product.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(CartItem.name) private cartModel: Model<CartItemDocument>,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const cartItems = await this.cartModel
      .find({
        _id: { $in: dto.cart_item_ids },
        user_id: userId,
      })
      .populate('product_id');

    if (cartItems.length === 0) {
      throw new BadRequestException('Không có sản phẩm hợp lệ');
    }

    const total_price = cartItems.reduce((total, item) => {
      const product = item.product_id as any as Product;
      const price = product.sale_price ?? product.price;
      return total + item.quantity * price;
    }, 0);

    const order = await this.orderModel.create({
      user_id: userId,
      address_id: dto.address_id,
      voucher_id: dto.voucher_id ?? null,
      total_price,
      payment_method: dto.payment_method,
      status: dto.payment_method === 'cod' ? 'pending' : 'unpaid',
    });

    await this.cartModel.deleteMany({
      _id: { $in: dto.cart_item_ids },
      user_id: userId,
    });

    return order;
  }

  async getOrdersByUser(userId: string) {
    return this.orderModel
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .exec();
  }

  async getOrderDetail(id: string, userId: string) {
    return this.orderModel.findOne({ _id: id, user_id: userId }).exec();
  }
}
