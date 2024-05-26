import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/')
  async createUser(@Body() dto) {
    return this.userService.createUser(dto);
  }

  @Get('/:idOrEmail')
  async getUserData(@Param('idOrEmail') idOrEmail: string) {
    return this.userService.findByIdOrEmail(idOrEmail);
  }

  @Get('/')
  async getUsers() {
    return this.userService.getAllUsers();
  }

  @Delete('/:id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteUser(id);
  }
}
