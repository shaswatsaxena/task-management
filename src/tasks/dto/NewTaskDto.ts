import {
  IsString,
  MaxLength,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { TaskPriority } from '../enums/TaskPriority.enum';
import { TaskLabel } from '../enums/TaskLabel.enum';
import { TaskStatus } from '../enums/TaskStatus.enum';

export class NewTaskDto {
  @IsString()
  @MaxLength(32)
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsEnum(TaskLabel)
  @IsOptional()
  label: TaskLabel;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsDateString()
  @IsOptional()
  due_date: Date;
}
