import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

/**
 * Data Transfer Object representing a Task
 * @export
 * @class TaskDto
 */
export class TaskDto {
  @IsString()
  @MaxLength(32)
  @ApiProperty({ maxLength: 32 })
  title: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description: string;

  @IsEnum(TaskStatus)
  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @IsEnum(TaskLabel)
  @ApiProperty({ enum: TaskLabel })
  label: TaskLabel;

  @IsEnum(TaskPriority)
  @ApiProperty({ enum: TaskPriority })
  priority: TaskPriority;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  due_date: Date;
}
