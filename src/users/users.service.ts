import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './entites/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll() {
    return await this.userRepo.find();
  }

  async findOne(username: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { username } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { id } });
  }

  async createUser(username: string, password: string): Promise<User> {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ username, password: hashed });

    return this.userRepo.save(user);
  }

  async updateRefreshToken(userId: string, token: string) {
    await this.userRepo.update(userId, { hashedRefreshToken: token });
  }
}
