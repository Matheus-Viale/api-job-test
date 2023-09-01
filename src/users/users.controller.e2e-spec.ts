import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import * as request from 'supertest';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new user', async () => {
    const createUserDto = {
      name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.message).toEqual('User created successfully');
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.name).toEqual(createUserDto.name);
    expect(response.body.data.email).toEqual(createUserDto.email);
  });

  it('should handle errors when creating a user', async () => {
    const createUserDto = {
      name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
    };

    const invalidCreateUserDto = { ...createUserDto, email: 'invalid-email' };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(invalidCreateUserDto);

    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body.message).toEqual('Failed to create user');
  });
});
