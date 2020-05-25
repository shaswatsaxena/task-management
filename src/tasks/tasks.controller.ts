import {
  Controller,
  Post,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NewTaskDto } from './dto/NewTaskDto';
import { GetUserId } from './getUserId.decorator';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async addTask(
    @Body() newTaskDto: NewTaskDto,
    @GetUserId() userId: number,
  ): Promise<Task> {
    return this.tasksService.addTask(newTaskDto, userId);
  }

  @Get(':id')
  async getTask(@Param('id') id: number, @GetUserId() userId: number): Promise<Task> {
    const task = await this.tasksService.getTaskById(id, userId);
    if (!task) {
      throw new NotFoundException(`Task with Id:${id} could not be found`);
    }
    return task;
  }
}
