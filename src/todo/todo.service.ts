import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepo: Repository<Todo>,
  ) {}

  findAll() {
    return this.todoRepo.find();
  }

  create(title: string) {
    const todo = this.todoRepo.create({ title });

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
