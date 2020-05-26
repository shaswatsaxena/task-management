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

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private tasks: Repository<Task>) {}

  async addTask(newTask: TaskDto, userId: number): Promise<Task> {
    return this.tasks.save({ ...newTask, userId });
  }

  async getTaskById(taskId: number, userId: number): Promise<Task> {
    return this.tasks.findOne({ id: taskId, userId });
  }

  async deleteTaskById(taskId: number, userId: number): Promise<Task> {
    const task = await this.tasks.findOne({ id: taskId, userId });
    if (!task) return null;
    await this.tasks.delete(taskId);
    return task;
  }

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

  async getTasks(
    filters: TaskFilterDto,
    userId: number,
  ): Promise<[Task[], number]> {
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
      const query = `%${filters.search}%`;
      where['title'] = Like(query);
    }
    if (filters.labels?.length > 0) {
      where['label'] = In(filters.labels);
    }
    if (filters.priority) {
      where['priority'] = filters.priority;
    }
    if (filters.status) {
      where['status'] = filters.status;
    }
    if (filters.after_created_at && filters.before_created_at) {
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
      where['created_at'] = Between(
        filters.after_due_date,
        filters.before_due_date,
      );
    } else if (filters.after_due_date) {
      where['created_at'] = MoreThanOrEqual(filters.after_due_date);
    } else if (filters.before_due_date) {
      where['created_at'] = LessThanOrEqual(filters.before_due_date);
    }

    const sortKey = 
      filters.sortKey?.split('__')[0].toLowerCase() || 'created_at';
    const sortOrder = filters.sortKey?.split('__')[1] || 'DESC';

    const tasks = await this.tasks.findAndCount({
      where,
      skip,
      take,
      order: {
        [sortKey]: sortOrder,
      },
    });
    return tasks;
  }
}
