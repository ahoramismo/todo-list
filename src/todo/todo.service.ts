import { Injectable } from '@nestjs/common';
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

  async toggle(id: number) {
    const todo = await this.todoRepo.findOneBy({ id });

    if (!todo) return null;

    todo.completed = !todo.completed;

    return this.todoRepo.save(todo);
  }

  delete(id: number) {
    return this.todoRepo.delete(id);
  }
}
