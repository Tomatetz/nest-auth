import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse } from './responses';
import { CurrentUser } from '@common/decorators';
import { IJwtPayload } from '@auth/interfaces';

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
  async deleteUser(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() currentUser: IJwtPayload) {
    return this.userService.deleteUser(id, currentUser);
  }
}
