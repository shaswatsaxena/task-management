import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { TaskStatus } from './enums/TaskStatus.enum';
import { TaskLabel } from './enums/TaskLabel.enum';
import { TaskPriority } from './enums/TaskPriority.enum';

/**
 * TypeORM Task Entity that maps to the 'task' database table
 * @export
 * @class Task
 */
@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ManyToOne((type) => User, (user) => user.id)
  user: User;

  @Column({ select: false })
  userId: number;

  @Column({ length: 32 })
  @ApiProperty({ maxLength: 32 })
  title: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ required: false })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @Column({ type: 'enum', enum: TaskLabel, default: TaskLabel.OTHER })
  @ApiProperty({ enum: TaskLabel })
  label: TaskLabel;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.NORMAL,
  })
  @ApiProperty({ enum: TaskPriority })
  priority: TaskPriority;

  @Column({ type: 'timestamp without time zone', nullable: true })
  @ApiProperty({ required: false })
  due_date: Date;

  @CreateDateColumn()
  @ApiProperty()
  created_at: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updated_at: Date;
}
