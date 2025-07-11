// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll() {
    return this.userModel.find().select('-password').exec();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const updated = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .select('-password');
    if (!updated) throw new NotFoundException('Không tìm thấy người dùng');
    return updated;
  }

  async deleteUser(id: string) {
    const deleted = await this.userModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Không tìm thấy người dùng');
    return { message: 'Đã xoá người dùng' };
  }
}
