import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';
import * as request from 'supertest';
import axios from 'axios';

jest.mock('axios');

describe('UserController (e2e)', () => {
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

  it('should get user by userId', async () => {
    const mockUserId = 1;
    const mockUserData = {
      id: 1,
      email: 'george.bluth@reqres.in',
      first_name: 'George',
      last_name: 'Bluth',
      avatar: 'https://reqres.in/img/faces/1-image.jpg',
    };
    const mockResponse = { data: { data: mockUserData } };

    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(app.getHttpServer()).get(
      `/user/${mockUserId}`,
    );

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual(mockUserData);
  });

  it('should handle not found when getting user by invalid userId', async () => {
    const invalidUserId = 1000;
    const mockResponse = {
      response: { status: 404, data: { error: 'User not found' } },
    }; // Create a mock response with status 404

    (axios.get as jest.Mock).mockRejectedValue(mockResponse);

    const response = await request(app.getHttpServer()).get(
      `/user/${invalidUserId}`,
    );

    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(response.body.message).toEqual('User not found');
  });
});
