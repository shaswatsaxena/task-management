import {
  Controller,
  Post,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
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
  addTask(
    @Body() newTaskDto: NewTaskDto,
    @GetUserId() userId: number,
  ): Promise<Task> {
    return this.tasksService.addTask(newTaskDto, userId);
  }
}
