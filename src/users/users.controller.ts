import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse } from './responses';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:idOrEmail')
  async getUserData(@Param('idOrEmail') idOrEmail: string) {
    const user = await this.userService.findByIdOrEmail(idOrEmail);
    return new UserResponse(user);
  }

  @Get('/')
  async getUsers() {
    const users = await this.userService.getAllUsers();
    return users;
  }

  @Delete('/:id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteUser(id);
  }
}
