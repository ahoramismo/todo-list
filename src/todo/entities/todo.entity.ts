import { User } from 'src/users/entites/users.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({default: 'todo'})
  state: 'todo' | 'in-progress' | 'done';

  @ManyToOne(() => User, (user) => user.todos, {eager: false})
  user: User;
}
