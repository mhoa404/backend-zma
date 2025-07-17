// src/orders/schemas/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Address', required: true })
  address_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Voucher', default: null })
  voucher_id: Types.ObjectId;

  @Prop({ required: true })
  total_price: number;

  @Prop({ required: true })
  payment_method: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ default: false })
  is_reviewed: boolean;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
