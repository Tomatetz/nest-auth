import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponse } from './responses';
import { CurrentUser, Roles } from '@common/decorators';
import { IJwtPayload } from '@auth/interfaces';
import { RolesGuard } from '@auth/guards/role.guard';
import { Role } from '@prisma/client';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/me')
  me(@CurrentUser() user: IJwtPayload) {
    return { user };
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/')
  async getUsers() {
    const users = await this.userService.getAllUsers();
    return users;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/:idOrEmail')
  async getUserData(@Param('idOrEmail') idOrEmail: string) {
    const user = await this.userService.findByIdOrEmail(idOrEmail);
    return new UserResponse(user);
  }

  @Delete('/:id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() currentUser: IJwtPayload) {
    return this.userService.deleteUser(id, currentUser);
  }
}
