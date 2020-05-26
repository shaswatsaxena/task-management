import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsInt,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TaskPriority } from '../enums/TaskPriority.enum';
import { TaskLabel } from '../enums/TaskLabel.enum';
import { TaskStatus } from '../enums/TaskStatus.enum';
import { TaskSortKey } from '../enums/TaskSortKey.enum';

export class TaskFilterDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsInt()
  @Min(1)
  @Max(100)
  @Transform((value) => Number(value))
  @IsOptional()
  limit: number;

  @IsInt()
  @Min(0)
  @Transform((value) => Number(value))
  @IsOptional()
  offset: number;

  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;

  @IsEnum(TaskLabel, { each: true })
  @IsOptional()
  labels: TaskLabel[];

  @IsEnum(TaskPriority)
  @IsOptional()
  priority: TaskPriority;

  @IsDateString()
  @IsOptional()
  before_due_date: Date;

  @IsDateString()
  @IsOptional()
  after_due_date: Date;

  @IsDateString()
  @IsOptional()
  before_created_at: Date;

  @IsEnum(TaskSortKey)
  @IsOptional()
  sortKey: TaskSortKey;

  @IsDateString()
  @IsOptional()
  after_created_at: Date;
}
