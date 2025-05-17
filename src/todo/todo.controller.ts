import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { TodoService } from './todo.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUserDto } from '../users/dto/authenticated-user.dto';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findUserTodos(
    @Request() req: ExpressRequest & { user: AuthenticatedUserDto },
  ) {
    return this.todoService.findAll(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createTodoDto: CreateTodoDto,
    @Request() req: ExpressRequest & { user: AuthenticatedUserDto },
  ) {
    return this.todoService.create(createTodoDto, req.user);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.todoService.delete(id);
  }
}
