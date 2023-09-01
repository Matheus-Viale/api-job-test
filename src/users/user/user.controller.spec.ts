import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import axios from 'axios';

jest.mock('axios');

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
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

    (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const user = await userController.getUser(mockUserId);

    expect(axios.get).toHaveBeenCalledWith(
      `https://reqres.in/api/users/${mockUserId}`,
    );
    expect(user).toEqual(mockUserData);
  });
});
