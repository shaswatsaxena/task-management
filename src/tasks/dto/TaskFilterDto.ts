import { ApiPropertyOptional } from '@nestjs/swagger';
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

/**
 * Data Transfer Object representing possible filter values that can be
 * provided when fetching tasks
 * @export
 * @class TaskFilterDto
 */
export class TaskFilterDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  search: string;

  @IsInt()
  @Min(1)
  @Max(100)
  @Transform((value) => Number(value))
  @IsOptional()
  @ApiPropertyOptional({ maximum: 100, minimum: 1 })
  limit: number;

  @IsInt()
  @Min(0)
  @Transform((value) => Number(value))
  @IsOptional()
  @ApiPropertyOptional({ minimum: 0 })
  offset: number;

  @IsEnum(TaskStatus)
  @IsOptional()
  @ApiPropertyOptional({ enum: TaskStatus })
  status: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  @ApiPropertyOptional({ enum: TaskPriority })
  priority: TaskPriority;

  @IsEnum(TaskLabel, { each: true })
  @IsOptional()
  @ApiPropertyOptional({ isArray: true, enum: TaskLabel })
  labels: TaskLabel[];

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  before_due_date: Date;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  after_due_date: Date;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  before_created_at: Date;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  after_created_at: Date;

  @IsEnum(TaskSortKey)
  @IsOptional()
  @ApiPropertyOptional({ enum: TaskSortKey })
  sortKey: TaskSortKey;
}
