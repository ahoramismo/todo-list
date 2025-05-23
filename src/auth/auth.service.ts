import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

/**
 * add bcrypt to hash passwords
 * add refresh token
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string) {
    const newUser = await this.usersService.createUser(username, password);

    return { message: 'User registered successfully', id: newUser.id };
  }

  async signIn({ username, password }: { username: string; password: string }) {
    const user = await this.usersService.findOne(username);
    const isMatch = await bcrypt.compare(password, user?.password || '');

    if (!user || !isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.username, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.usersService.findById(payload.sub);

      if (!user || !user.hashedRefreshToken) {
        throw new UnauthorizedException();
      }

      const isMatch = await bcrypt.compare(token, user.hashedRefreshToken);
      if (!isMatch) {
        throw new UnauthorizedException();
      }
      const newToken = await this.jwtService.signAsync(
        { username: user.username, sub: user.id },
        {
          expiresIn: '15m',
        },
      );

      return {
        access_token: newToken,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
