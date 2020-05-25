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
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskDto } from './dto/TaskDto';
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
    @Body() newTaskDto: TaskDto,
    @GetUserId() userId: number,
  ): Promise<Task> {
    return this.tasksService.addTask(newTaskDto, userId);
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  async getTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUserId() userId: number,
  ): Promise<Task> {
    const task = await this.tasksService.getTaskById(id, userId);
    if (!task) {
      throw new NotFoundException(`Task with Id:${id} could not be found`);
    }
    return task;
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUserId() userId: number,
  ): Promise<Task> {
    const task = await this.tasksService.deleteTaskById(id, userId);
    if (!task) {
      throw new NotFoundException(`Task with Id:${id} could not be found`);
    }
    return task;
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() editTaskDto: TaskDto,
    @GetUserId() userId: number,
  ): Promise<Task> {
    const task = await this.tasksService.updateTaskById(
      id,
      editTaskDto,
      userId,
    );
    if (!task) {
      throw new NotFoundException(`Task with Id:${id} could not be found`);
    }
    return task;
  }
}
