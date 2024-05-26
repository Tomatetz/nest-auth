import { Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  createUser(user: Partial<User>) {
    const hashedPassword = this.hashPassword(user.password);
    return this.prismaService.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        roles: [Role.USER],
      },
    });
  }

  findByIdOrEmail(idOrEmail: string) {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
    });
  }

  deleteUser(id: string) {
    return this.prismaService.user.delete({ where: { id }, select: { id: true } });
  }

  getAllUsers() {
    return this.prismaService.user.findMany();
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
