import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Like,
  In,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  ObjectLiteral,
  FindConditions,
} from 'typeorm';
import { TaskDto } from './dto/TaskDto';
import { TaskFilterDto } from './dto/TaskFilterDto';
import { Task } from './task.entity';
import { TasksDto } from './dto/TasksDto';

/**
 * Consists of Services for Tasks
 * @export
 * @class TasksService
 */
@Injectable()
export class TasksService {
  /**
   *Creates an instance of TasksService.
   * @param {Repository<Task>} tasks
   * @memberof TasksService
   */
  constructor(@InjectRepository(Task) private tasks: Repository<Task>) {}

  /**
   * Inserts a new task in the database
   * @param {TaskDto} newTask
   * @param {number} userId
   * @returns {Promise<Task>}
   * @memberof TasksService
   */
  async addTask(newTask: TaskDto, userId: number): Promise<Task> {
    return this.tasks.save({ ...newTask, userId });
  }

  /**
   * Fetches a Task from database for provided Id and User
   * @param {number} taskId
   * @param {number} userId
   * @returns {Promise<Task>}
   * @memberof TasksService
   */
  async getTaskById(taskId: number, userId: number): Promise<Task> {
    return this.tasks.findOne({ id: taskId, userId });
  }

  /**
   * Permanently deletes a Task from database for provided Id and User
   * @param {number} taskId
   * @param {number} userId
   * @returns {Promise<Task>}
   * @memberof TasksService
   */
  async deleteTaskById(taskId: number, userId: number): Promise<Task> {
    const task = await this.tasks.findOne({ id: taskId, userId });
    if (!task) return null;
    await this.tasks.delete(taskId);
    return task;
  }

  /**
   * Updates a Task in database for provided Id and User
   * @param {number} taskId
   * @param {TaskDto} updatedTask
   * @param {number} userId
   * @returns {Promise<Task>}
   * @memberof TasksService
   */
  async updateTaskById(
    taskId: number,
    updatedTask: TaskDto,
    userId: number,
  ): Promise<Task> {
    const task = await this.tasks.findOne({ id: taskId, userId });
    if (!task) return null;
    this.tasks.merge(task, updatedTask);
    return this.tasks.save(task);
  }

  /**
   * Fetches Tasks from database for provided Id, User and filters
   * @param {TaskFilterDto} filters
   * @param {number} userId
   * @returns {Promise<TasksDto>}
   * @memberof TasksService
   */
  async getTasks(filters: TaskFilterDto, userId: number): Promise<TasksDto> {
    const skip = filters.offset ?? 0;
    const take = filters.limit ?? 10;

    const where:
      | string
      | ObjectLiteral
      | FindConditions<Task>
      | FindConditions<Task>[] = {
      userId,
    };
    if (filters.search) {
      // Construct LIKE query from search term
      const query = `%${filters.search}%`;
      where['title'] = Like(query);
    }
    if (filters.labels?.length > 0) {
      // Tasks can be filtered on multiple labels
      where['label'] = In(filters.labels);
    }
    if (filters.priority) {
      where['priority'] = filters.priority;
    }
    if (filters.status) {
      where['status'] = filters.status;
    }
    if (filters.after_created_at && filters.before_created_at) {
      // Use SQL BETWEEN keyword
      where['created_at'] = Between(
        filters.after_created_at,
        filters.before_created_at,
      );
    } else if (filters.after_created_at) {
      where['created_at'] = MoreThanOrEqual(filters.after_created_at);
    } else if (filters.before_created_at) {
      where['created_at'] = LessThanOrEqual(filters.before_created_at);
    }
    if (filters.after_due_date && filters.before_due_date) {
      // Use SQL BETWEEN keyword
      where['created_at'] = Between(
        filters.after_due_date,
        filters.before_due_date,
      );
    } else if (filters.after_due_date) {
      where['created_at'] = MoreThanOrEqual(filters.after_due_date);
    } else if (filters.before_due_date) {
      where['created_at'] = LessThanOrEqual(filters.before_due_date);
    }

    // Find property & order to sort by from provided enum else use default
    const sortKey =
      filters.sortKey?.split('__')[0].toLowerCase() || 'created_at';
    const sortOrder = filters.sortKey?.split('__')[1] || 'DESC';

    // We also count the number of tasks found for provided filters
    const result = await this.tasks.findAndCount({
      where,
      skip,
      take,
      order: {
        [sortKey]: sortOrder,
      },
    });
    return { tasks: result[0], count: result[1] };
  }
}
