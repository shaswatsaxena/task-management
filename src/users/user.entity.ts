import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: "user_account"})
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
