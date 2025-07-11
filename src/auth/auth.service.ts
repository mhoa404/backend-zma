import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const userExists = await this.userModel.findOne({ email: dto.email });
    if (userExists) {
      throw new UnauthorizedException('Email đã tồn tại');
    }
    const hash = await bcrypt.hash(dto.password, 10);
    const createdUser = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password: hash,
    });
    return {
      message: 'Đăng ký thành công',
      user: {
        _id: createdUser._id,
        email: createdUser.email,
        name: createdUser.name,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }
    const payload = {
      sub: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    console.log('Đăng nhập user:', user);
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new UnauthorizedException('Không tìm thấy người dùng');
    return user;
  }
}
