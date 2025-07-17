import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { AuthRequest } from 'src/common/interfaces/auth-request.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  findAll(@Request() req: AuthRequest) {
    const isAdmin = req.user?.role === 'admin';
    return this.productsService.findAll(isAdmin);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    const isAdmin = req.user?.role === 'admin';
    return this.productsService.findOne(id, isAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Request() req: AuthRequest, @Body() dto: CreateProductDto) {
    if (req.user?.role !== 'admin') throw new UnauthorizedException();
    return this.productsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    if (req.user?.role !== 'admin') throw new UnauthorizedException();
    return this.productsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  toggleAvailable(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body('available') available: boolean,
  ) {
    if (req.user?.role !== 'admin') throw new UnauthorizedException();
    return this.productsService.toggleAvailable(id, available);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: AuthRequest, @Param('id') id: string) {
    if (req.user?.role !== 'admin') throw new UnauthorizedException();
    return this.productsService.remove(id);
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  async addToCart(@Request() req: AuthRequest, @Body() dto: AddToCartDto) {
    return this.productsService.addToCart(req.user!.sub, dto.productId);
  }
}
