import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewTaskDto } from './dto/NewTaskDto';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private tasks: Repository<Task>) {}

  async addTask(newTask: NewTaskDto, userId: number): Promise<Task> {
    return await this.tasks.save({ ...newTask, userId });
  }
}
