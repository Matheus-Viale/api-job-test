import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';

describe('AvatarController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should delete avatar', async () => {
    const mockUserId = '2';
    const mockAvatarUrl = 'https://reqres.in/img/faces/2-image.jpg';

    // Create and save an avatar in the 'avatars' directory for testing
    const avatarPath = path.join(
      __dirname,
      '..',
      'avatars',
      `${mockUserId}.png`,
    );
    fs.writeFileSync(avatarPath, 'Mock Avatar Data');

    // Prepare the database with an avatar entry
    const avatarModel = app.get('AvatarModel');
    const avatar = new avatarModel({
      userId: mockUserId,
      avatarUrl: mockAvatarUrl,
    });
    await avatar.save();

    const deleteResponse = await request(app.getHttpServer()).delete(
      `/user/${mockUserId}/avatar`,
    );
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({});
    expect(fs.existsSync(avatarPath)).toBeFalsy();
  });
});
