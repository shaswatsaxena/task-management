import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../task.entity';

/**
 * Data Transfer Object representing the response on fetching Tasks
 * @export
 * @class TasksDto
 */
export class TasksDto {
  @ApiProperty({ type: Task, isArray: true })
  tasks: Task[];

  @ApiProperty()
  count: number;
}
