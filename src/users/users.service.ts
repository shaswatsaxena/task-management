import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  async addUser(newUser: {
    email: string;
    password_hash: string;
    name: string;
  }): Promise<void> {
    await this.users.save(newUser);
  }

  async findByEmail(email: string): Promise<User> {
    return this.users.findOne({ email });
  }
}
