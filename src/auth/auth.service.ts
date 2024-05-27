import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { LoginDto, RegisterDto } from './dto';
import { ITokens } from './interfaces';
import { compareSync } from 'bcrypt';
import { Token, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}
  async register(dto: RegisterDto) {
    const user: User = await this.usersService.findByIdOrEmail(dto.email).catch((err) => {
      this.logger.error(err);
      return null;
    });
    if (user) {
      return null;
    }
    const createdUser = await this.usersService.createUser(dto).catch((err) => {
      this.logger.error(err);
      return null;
    });
    return createdUser;
  }

  async login(dto: LoginDto, agent: string): Promise<ITokens> {
    const user: User = await this.usersService.findByIdOrEmail(dto.email, true).catch((err) => {
      this.logger.error(err);
      return null;
    });
    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Wrong login or password');
    }
    return this.generateTokens(user, agent);
  }

  private async generateTokens(user: User, agent: string): Promise<ITokens> {
    const accessToken =
      'Bearer ' +
      this.jwtService.sign({
        id: user.id,
        email: user.email,
        roles: user.roles,
      });
    const refreshToken = await this.getRefreshToken(user.id, agent);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string, agent: string): Promise<ITokens> {
    const token = await this.prismaService.token.findUnique({
      where: {
        token: refreshToken,
      },
    });
    if (!token) {
      throw new UnauthorizedException();
    }
    await this.prismaService.token.delete({
      where: {
        token: refreshToken,
      },
    });
    if (new Date(token.expired).getTime() < new Date().getTime()) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findByIdOrEmail(token.userId);
    return this.generateTokens(user, agent);
  }

  private async getRefreshToken(userId: string, agent: string): Promise<Token> {
    const _token = await this.prismaService.token.findFirst({
      where: {
        userId,
        userAgent: agent,
      },
    });
    const token = _token?.token ?? '';
    return this.prismaService.token.upsert({
      where: { token },
      update: {
        token: v4(),
        expired: add(new Date(), { months: 1 }),
      },
      create: {
        token: v4(),
        expired: add(new Date(), { months: 1 }),
        userId,
        userAgent: agent,
      },
    });
  }

  async deleteRefreshToken(token: string, userAgent: string) {
    return this.prismaService.token.delete({
      where: {
        token,
        userAgent,
      },
    });
  }
}
