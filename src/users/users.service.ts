import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

/**
 * Consists of Services for related to Users
 * @export
 * @class UsersService
 */
@Injectable()
export class UsersService {
  /**
   * Creates an instance of UsersService.
   * @param {Repository<User>} users
   * @memberof UsersService
   */
  constructor(
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  /**
   * Inserts a new user to database
   * @param {{
   *     email: string;
   *     password_hash: string;
   *     name: string;
   *   }} newUser
   * @returns {Promise<void>}
   * @memberof UsersService
   */
  async addUser(newUser: {
    email: string;
    password_hash: string;
    name: string;
  }): Promise<void> {
    await this.users.save(newUser);
  }

  /**
   * Returns a user from database by email
   * @param {string} email
   * @returns {Promise<User>}
   * @memberof UsersService
   */
  async findByEmail(email: string): Promise<User> {
    return this.users.findOne({ email });
  }
}
