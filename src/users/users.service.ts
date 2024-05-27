import { IJwtPayload } from '@auth/interfaces';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { genSaltSync, hashSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { convertToMilliSecondsUtil } from '@common/utils';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  createUser(user: Partial<User>) {
    const hashedPassword = this.hashPassword(user.password);
    return this.prismaService.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        roles: [Role.USER, Role.ADMIN],
      },
    });
  }

  async findByIdOrEmail(idOrEmail: string, forceClearCache = false) {
    if (forceClearCache) {
      await this.cacheManager.del(idOrEmail);
    }
    const cachedUser = await this.cacheManager.get<User>(idOrEmail);
    if (cachedUser) return cachedUser;

    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
    });
    if (!user) {
      return null;
    }
    await this.cacheManager.set(idOrEmail, user, convertToMilliSecondsUtil(this.configService.get('JWT_EXP')));
    return user;
  }

  async deleteUser(id: string, currentUser: IJwtPayload) {
    // Allow only current user to be deleted
    // if (id !== currentUser.id && !currentUser.roles.includes(Role.ADMIN)) {
    //   throw new ForbiddenException();
    // }

    await Promise.all([this.cacheManager.del(id), this.cacheManager.del(currentUser.email)]);

    return this.prismaService.user.delete({ where: { id }, select: { id: true } });
  }

  getAllUsers() {
    return this.prismaService.user.findMany();
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
