import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { AuthenticatedUserDto } from '../users/dto/authenticated-user.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

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

  create(todoItem: CreateTodoDto, user: AuthenticatedUserDto) {
    const todo = this.todoRepo.create({ ...todoItem, user });

    return this.todoRepo.save(todo);
  }

  update(id: string, todoItem: UpdateTodoDto) {
    if (!todoItem) {
      throw new BadRequestException('Todo item is required');
    }
    
    return this.todoRepo.update({ id }, todoItem);
  }

  async delete(id: string) {
    return this.todoRepo.delete({ id });
  }
}
