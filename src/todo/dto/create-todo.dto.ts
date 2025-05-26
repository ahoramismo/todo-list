import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  state: 'todo' | 'in-progress' | 'done';

  completed?: boolean;
  archived?: boolean;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
