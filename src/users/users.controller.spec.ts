import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, HttpException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { EmailService } from '../email/email.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    createUser: jest
      .fn()
      .mockImplementation((createUserDto) =>
        Promise.resolve({ ...createUserDto, _id: '123456' }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        EmailService,
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Matheus',
      last_name: 'Viale',
      email: 'test@example.com',
    };
    const createdUser = await usersController.createUser(createUserDto);

    expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
    expect(createdUser).toEqual({
      message: 'User created successfully',
      data: { ...createUserDto, _id: '123456' },
    });
  });

  it('should handle errors when creating a user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Matheus',
      last_name: 'Viale',
      email: 'test@example.com',
    };
    // Set the mock implementation to reject the promise (simulate an error)
    mockUsersService.createUser.mockRejectedValueOnce(
      new Error('Failed to create user'),
    );

    // Expect the controller to throw an HttpException
    await expect(
      usersController.createUser(createUserDto),
    ).rejects.toThrowError(
      new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});
