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
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskDto } from './dto/TaskDto';
import { TaskFilterDto } from './dto/TaskFilterDto';
import { GetUserId } from './getUserId.decorator';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { TasksDto } from './dto/TasksDto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiTags('tasks')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
})
@ApiInternalServerErrorResponse({
  description: 'Internal Server Error',
})
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ type: Task })
  async addTask(
    @Body() newTaskDto: TaskDto,
    @GetUserId() userId: number,
  ): Promise<Task> {
    return this.tasksService.addTask(newTaskDto, userId);
  }

  @Get()
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: TasksDto })
  async getTasks(
    @Query() filters: TaskFilterDto,
    @GetUserId() userId: number,
  ): Promise<TasksDto> {
    return this.tasksService.getTasks(filters, userId);
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: Task })
  @ApiNotFoundResponse({ description: `Task could not be found` })
  async getTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUserId() userId: number,
  ): Promise<Task> {
    const task = await this.tasksService.getTaskById(id, userId);
    if (!task) {
      throw new NotFoundException(`Task could not be found`);
    }
    return task;
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: Task })
  @ApiNotFoundResponse({ description: `Task could not be found` })
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUserId() userId: number,
  ): Promise<Task> {
    const task = await this.tasksService.deleteTaskById(id, userId);
    if (!task) {
      throw new NotFoundException(`Task could not be found`);
    }
    return task;
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: Task })
  @ApiNotFoundResponse({ description: `Task could not be found` })
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
      throw new NotFoundException(`Task could not be found`);
    }
    return task;
  }
}
