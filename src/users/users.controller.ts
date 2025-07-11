// src/users/users.controller.ts
import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthRequest } from '../common/interfaces/auth-request.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // ADMIN

  @Get('users')
  getAll(@Req() req: AuthRequest) {
    if (req.user!.role !== 'admin') throw new ForbiddenException();
    return this.usersService.findAll();
  }

  @Get('users/:id')
  getOne(@Param('id') id: string, @Req() req: AuthRequest) {
    if (req.user!.role !== 'admin') throw new ForbiddenException();
    return this.usersService.findById(id);
  }

  @Put('users/:id')
  updateOne(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: AuthRequest,
  ) {
    if (req.user!.role !== 'admin') throw new ForbiddenException();
    return this.usersService.updateUser(id, dto);
  }

  @Delete('users/:id')
  remove(@Param('id') id: string, @Req() req: AuthRequest) {
    if (req.user!.role !== 'admin') throw new ForbiddenException();
    return this.usersService.deleteUser(id);
  }

  //Customer API
  @Get('profile')
  getProfile(@Req() req: AuthRequest) {
    return this.usersService.findById(req.user!.sub);
  }

  @Put('profile/edit')
  updateProfile(@Req() req: AuthRequest, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(req.user!.sub, dto);
  }
}
