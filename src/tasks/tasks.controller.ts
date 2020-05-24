import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
export class TasksController {
  @UseGuards(JwtAuthGuard)
  @Get('')
  getHello(): string {
    return 'Hello World!';
  }
}
