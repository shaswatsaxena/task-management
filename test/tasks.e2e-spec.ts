import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from 'src/users/user.entity';
import { Task } from 'src/tasks/task.entity';
import { seedData } from './seed';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let taskRepository: Repository<Task>;
  let accessTokenX: string, accessTokenY: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    userRepository = moduleFixture.get('UserRepository');
    taskRepository = moduleFixture.get('TaskRepository');

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    //Register 2 user accounts :
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(seedData.users[0]);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(seedData.users[1]);

    //Get access tokens for both users
    const user0 = await request(app.getHttpServer())
      .post('/auth/login')
      .send(seedData.users[0]);
    accessTokenX = user0.body.access_token;

    const user1 = await request(app.getHttpServer())
      .post('/auth/login')
      .send(seedData.users[1]);
    accessTokenY = user1.body.access_token;
  });

  it('POST /tasks with correct data', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', 'Bearer ' + accessTokenX)
      .send(seedData.tasks[0])
      .expect(201);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('created_at');
    expect(body).toHaveProperty('updated_at');
    expect(body).toMatchObject(seedData.tasks[0]);
  });

  it('POST /tasks with incorrect data', async () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', 'Bearer ' + accessTokenX)
      .send({
        title: '11.272802100804125 Task',
        description: 'Lorem Ipsum dolor sit ',
        status: 'PENDING',
        priority: 'HIGH',
        // label: 'PERSONAL',
        due_date: '2020-05-27T11:44:35.801Z',
      })
      .expect(400);
  });

  it('POST /tasks without accessToken', async () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send(seedData.tasks[0])
      .expect(401);
  });

  it('GET /tasks', async () => {
    const { body: createdTask } = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', 'Bearer ' + accessTokenX)
      .send(seedData.tasks[0])
      .expect(201);

    const fetchedTasks = await request(app.getHttpServer())
      .get(`/tasks`)
      .set('Authorization', 'Bearer ' + accessTokenX)
      .expect(200);

    const { userId, ...createdTaskWithoutUserId } = createdTask;

    expect(fetchedTasks.body.count).toBe(1);
    expect(fetchedTasks.body.tasks[0]).toMatchObject(createdTaskWithoutUserId);
  });

  it('GET /tasks with more tasks', async () => {
    const { body: createdTask } = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', 'Bearer ' + accessTokenX)
      .send(seedData.tasks[0])
      .expect(201);

    await taskRepository.save(
      seedData.tasks.map((task) => ({ ...task, userId: createdTask.userId })),
    );

    const fetchedTasks = await request(app.getHttpServer())
      .get(`/tasks`)
      .set('Authorization', 'Bearer ' + accessTokenX)
      .expect(200);

    expect(fetchedTasks.body.count).toBe(seedData.tasks.length + 1);
    fetchedTasks.body.tasks.forEach(
      (fetchedTask: Task, index: number): void => {
        const key = index === 0 ? 0 : index - 1;
        expect(fetchedTask).toMatchObject(seedData.tasks[index]);
      },
    );
  });

  it('GET /tasks/:id', async () => {
    const { body: createdTask } = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', 'Bearer ' + accessTokenX)
      .send(seedData.tasks[0])
      .expect(201);

    const fetchedTask = await request(app.getHttpServer())
      .get(`/tasks/${createdTask.id}`)
      .set('Authorization', 'Bearer ' + accessTokenX)
      .expect(200);

    const { userId, ...createdTaskWithoutUserId } = createdTask;

    expect(fetchedTask.body).toMatchObject(createdTaskWithoutUserId);
  });

  it('PUT /tasks/:id', async () => {
    const { body: createdTask } = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', 'Bearer ' + accessTokenX)
      .send(seedData.tasks[0])
      .expect(201);

    const updatedResponse = await request(app.getHttpServer())
      .put(`/tasks/${createdTask.id}`)
      .set('Authorization', 'Bearer ' + accessTokenX)
      .send(seedData.tasks[1])
      .expect(200);

    const updatedTask = { id: createdTask.id, ...seedData.tasks[1] };

    expect(updatedResponse.body).toMatchObject(updatedTask);
  });

  it('DELETE /tasks/:id', async () => {
    const { body: createdTask } = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', 'Bearer ' + accessTokenX)
      .send(seedData.tasks[0])
      .expect(201);

    const deletedTask = await request(app.getHttpServer())
      .delete(`/tasks/${createdTask.id}`)
      .set('Authorization', 'Bearer ' + accessTokenX)
      .expect(200);

    const { userId, ...createdTaskWithoutUserId } = createdTask;

    expect(deletedTask.body).toMatchObject(createdTaskWithoutUserId);
  });

  afterEach(async () => {
    await taskRepository.query('DELETE FROM task;');
    await userRepository.query('DELETE FROM user_account;');
  });

  afterAll(async () => {
    await app.close();
  });
});
