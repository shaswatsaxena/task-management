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

/**
 * Controller for /tasks routes. Protected with JWT Bearer Auth
 * @export
 * @class TasksController
 */
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
  /**
   * Creates an instance of TasksController.
   * @param {TasksService} tasksService
   * @memberof TasksController
   */
  constructor(private tasksService: TasksService) {}

  /**
   * Adds a new Task
   * @param {TaskDto} newTaskDto
   * @param {number} userId
   * @returns {Promise<Task>}
   * @memberof TasksController
   */
  @Post()
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ type: Task })
  async addTask(
    @Body() newTaskDto: TaskDto,
    @GetUserId() userId: number,
  ): Promise<Task> {
    return this.tasksService.addTask(newTaskDto, userId);
  }

  /**
   * Returns tasks sorted with provided filters
   * @param {TaskFilterDto} filters
   * @param {number} userId
   * @returns {Promise<TasksDto>}
   * @memberof TasksController
   */
  @Get()
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ type: TasksDto })
  async getTasks(
    @Query() filters: TaskFilterDto,
    @GetUserId() userId: number,
  ): Promise<TasksDto> {
    return this.tasksService.getTasks(filters, userId);
  }

  /**
   * Gets a single task for provided ID otherwise return a 404 error
   * @param {number} id
   * @param {number} userId
   * @returns {Promise<Task>}
   * @memberof TasksController
   */
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

  /**
   * Updates a single task with provided data otherwise return a 404 error
   * @param {number} id
   * @param {TaskDto} editTaskDto
   * @param {number} userId
   * @returns {Promise<Task>}
   * @memberof TasksController
   */
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

  /**
   * Deletes a single task for provided ID otherwise return a 404 error
   * @param {number} id
   * @param {number} userId
   * @returns {Promise<Task>}
   * @memberof TasksController
   */
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
}
