import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { AuthenticatedUserDto } from '../users/dto/authenticated-user.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepo: Repository<Todo>,
  ) {}

  async findAll(user: AuthenticatedUserDto) {
    return this.todoRepo.find({
      where: {
        user: { id: user.id },
      },
    });
  }

  create(title: string, user: AuthenticatedUserDto) {
    const todo = this.todoRepo.create({ title, user });

    return this.todoRepo.save(todo);
  }

  async toggle(id: string) {
    const todo = await this.todoRepo.findOneBy({ id });

    if (!todo) {
      throw new NotFoundException();
    }

    todo.completed = !todo.completed;

    return this.todoRepo.save(todo);
  }

  async delete(id: string) {
    return this.todoRepo.delete({ id });
  }
}
