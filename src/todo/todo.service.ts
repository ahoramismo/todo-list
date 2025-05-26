import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository, DataSource } from 'typeorm';
import { AuthenticatedUserDto } from '../users/dto/authenticated-user.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepo: Repository<Todo>,
    private dataSource: DataSource,
  ) {}

  async findAll(user: AuthenticatedUserDto) {
    return this.todoRepo.find({
      where: {
        user: { id: user.id },
      },
    });
  }

  async create(todoItem: CreateTodoDto, user: AuthenticatedUserDto) {
    const todo = this.todoRepo.create({ ...todoItem, user });
    const maxOrder = await this.todoRepo
      .createQueryBuilder('todo')
      .select('MAX(todo.order)', 'max')
      .getRawOne();

    const order = (maxOrder?.max ?? 0) + 1;

    return this.todoRepo.save({ ...todo, order });
  }

  async delete(id: string) {
    return this.todoRepo.delete({ id });
  }

  async reorderTodos(ids: string[]) {
    try {
      return this.dataSource.transaction(async (manager) => {
        for (let index = 0; index < ids.length; index++) {
          const id = ids[index];
          const todo = await manager.findOne(Todo, { where: { id } });
          if (!todo) {
            console.error(`No todo found with id ${id}`);
            continue;
          }

          todo.order = index;
          await manager.save(todo);
        }
      });
    } catch (error) {
      console.error('Error in reorderTodos:', error);
      throw error;
    }
  }

  async toggleCompleted(id: string) {
    const todo = await this.todoRepo.findOneBy({ id });
    if (!todo) throw new Error('Todo not found');

    todo.completed = !todo.completed;
    return this.todoRepo.save(todo);
  }

  async toggleArchived(id: string) {
    const todo = await this.todoRepo.findOneBy({ id });
    if (!todo) throw new Error('Todo not found');

    todo.archived = !todo.archived;
    return this.todoRepo.save(todo);
  }
}
