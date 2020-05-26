import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * TypeORM User Entity that maps to the 'user_account' database table
 * @export
 * @class User
 */
@Entity({ name: 'user_account' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;
}
