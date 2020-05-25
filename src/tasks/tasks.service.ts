import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewTaskDto } from './dto/NewTaskDto';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private tasks: Repository<Task>) {}

  async addTask(newTask: NewTaskDto, userId: number): Promise<Task> {
    return this.tasks.save({ ...newTask, userId });
  }

  async getTaskById(taskId: number, userId: number): Promise<Task> {
    return this.tasks.findOne({ id: taskId, userId });
  }

  async deleteTaskById(taskId: number, userId: number): Promise<Task> {
    const task = this.tasks.findOne({ id: taskId, userId });
    if (!task) return null;
    await this.tasks.delete(taskId);
    return task;
  }
}
