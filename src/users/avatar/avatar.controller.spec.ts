import { Test, TestingModule } from '@nestjs/testing';
import { AvatarController } from './avatar.controller';
import { getModelToken } from '@nestjs/mongoose';
import { Avatar } from './avatar.model';
import * as fs from 'fs';

describe('AvatarController', () => {
  let avatarController: AvatarController;

  const mockAvatarModel = {
    findOne: jest.fn().mockResolvedValue(null),
    findOneAndDelete: jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue({}),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvatarController],
      providers: [
        { provide: getModelToken(Avatar.name), useValue: mockAvatarModel },
      ],
    }).compile();

    avatarController = module.get<AvatarController>(AvatarController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(avatarController).toBeDefined();
  });

  it('should delete avatar', async () => {
    const mockUserId = '2';

    const result = await avatarController.deleteAvatar(mockUserId);

    expect(mockAvatarModel.findOneAndDelete).toHaveBeenCalledWith({
      userId: mockUserId,
    });
    expect(fs.existsSync(`avatars/${mockUserId}.png`)).toBeFalsy();
    expect(result).toEqual({ message: 'Avatar Deleted from DB and Storage!' }); // Update the expectation
  });
});
