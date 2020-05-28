import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from 'src/users/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    userRepository = moduleFixture.get('UserRepository');

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /auth/register with correct data', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@test.com',
        password: 'Password@123',
        name: 'Test',
      })
      .expect(201);
  });

  it('POST /auth/login with correct data', async () => {
    const user = {
      email: 'test@test.com',
      password: 'Password@123',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        ...user,
        name: 'Test',
      });

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
      .expect(200);
    expect(body).toHaveProperty('access_token');
  });

  it('POST /auth/register with duplicate email', async () => {
    const user = {
      email: 'test@test.com',
      password: 'Password@123',
      name: 'Test',
    };

    await request(app.getHttpServer()).post('/auth/register').send(user);

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(409);
  });

  it('POST /auth/register with weak password', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: '1@test.com',
        password: 'weak_password',
        name: 'Test',
      })
      .expect(400);
  });

  it('POST /auth/register with invalid email', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test.com',
        password: 'Password@123',
        name: 'Test',
      })
      .expect(400);
  });

  it('POST /auth/register with missing name', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: '2@test.com',
        password: 'Password@123',
      })
      .expect(400);
  });

  it('POST /auth/register with long name', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: '3@test.com',
        password: 'Password@123',
        name: '012345678901234567908123456789123',
      })
      .expect(400);
  });

  it('POST /auth/login with incorrect email', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'WRONG EMAIL',
        password: 'Password@123',
      })
      .expect(401);
  });

  it('POST /auth/login with incorrect password', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      email: 'test@test.com',
      password: 'Password@123',
      name: 'Test',
    });

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@test.com',
        password: 'WRONG PASSWORD',
      })
      .expect(401);
  });

  afterEach(async () => {
    await userRepository.query('DELETE FROM user_account;');
  });

  afterAll(async () => {
    await app.close();
  });
});
