import { User } from 'src/users/entites/users.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  // Will be removed in the future
  @Column({ default: 'todo' })
  state: 'todo' | 'in-progress' | 'done';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: false })
  archived: boolean;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => User, (user) => user.todos, { eager: false })
  user: User;
}
