import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../task.entity';

export class TasksDto {
  @ApiProperty({ type: Task, isArray: true })
  tasks: Task[];

  @ApiProperty()
  count: number;
}
