// src/orders/orders.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthRequest } from '../common/interfaces/auth-request.interface';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create')
  create(@Req() req: AuthRequest, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user!.sub, dto);
  }

  @Get()
  getMyOrders(@Req() req: AuthRequest) {
    return this.ordersService.getOrdersByUser(req.user!.sub);
  }

  @Get(':id')
  getOrder(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.ordersService.getOrderDetail(id, req.user!.sub);
  }
}
