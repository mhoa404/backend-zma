import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { AuthRequest } from 'src/common/interfaces/auth-request.interface';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  getAll(@Request() req: AuthRequest) {
    const isAdmin = req.user?.role === 'admin';
    return this.categoriesService.findAll(isAdmin);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string, @Request() req: AuthRequest) {
    const isAdmin = req.user?.role === 'admin';
    return this.categoriesService.findOne(id, isAdmin);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Request() req: AuthRequest, @Body() dto: CreateCategoryDto) {
    if (req.user?.role !== 'admin') throw new UnauthorizedException();
    return this.categoriesService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    if (req.user?.role !== 'admin') throw new UnauthorizedException();
    return this.categoriesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  patch(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body('is_active') is_active: boolean,
  ) {
    if (req.user?.role !== 'admin') throw new UnauthorizedException();
    return this.categoriesService.patchStatus(id, is_active);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req: AuthRequest, @Param('id') id: string) {
    if (req.user?.role !== 'admin') throw new UnauthorizedException();
    return this.categoriesService.remove(id);
  }
}
