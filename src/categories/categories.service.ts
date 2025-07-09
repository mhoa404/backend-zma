// src/categories/categories.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(dto: CreateCategoryDto) {
    return await this.categoryModel.create(dto);
  }

  async findAll(isAdmin = false) {
    return this.categoryModel.find(isAdmin ? {} : { is_active: true }).exec();
  }

  async findOne(id: string, isAdmin = false) {
    const category = await this.categoryModel.findById(id).exec();
    if (!category || (!isAdmin && !category.is_active)) {
      throw new NotFoundException('Danh mục không tồn tại');
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Không tìm thấy danh mục');
    return updated;
  }

  async patchStatus(id: string, is_active: boolean) {
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, { is_active }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Không tìm thấy danh mục');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Không tìm thấy danh mục');
    return { message: 'Đã xoá danh mục' };
  }
}
