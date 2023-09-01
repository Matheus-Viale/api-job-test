import {
  Controller,
  Get,
  Param,
  HttpCode,
  Delete,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Avatar } from './avatar.model';

async function saveAvatar(userId: string) {
  const apiRq = await axios.get(`https://reqres.in/api/users/${userId}`);
  const avatarUrl = apiRq.data.data.avatar;
  const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
  const avatarBuffer = Buffer.from(response.data, 'binary');
  const avatarBase64 = avatarBuffer.toString('base64');
  const avatarPath = join(__dirname, '..', 'avatars', `${userId}.png`);
  fs.writeFileSync(avatarPath, avatarBuffer);

  return { avatarBase64, avatarUrl };
}

@Controller('user')
export class AvatarController {
  constructor(
    @InjectModel(Avatar.name) private readonly avatarModel: Model<Avatar>,
  ) {}

  @Get(':userId/avatar')
  @HttpCode(200)
  async getAvatar(@Param('userId') userId: string) {
    const avatar = await this.avatarModel.findOne({ userId }).exec();

    if (avatar) {
      const avatarPath = join(__dirname, '..', 'avatars', `${userId}.png`);
      if (fs.existsSync(avatarPath)) {
        // If the avatar file exists, return it from the filesystem
        const avatarBuffer = fs.readFileSync(avatarPath);
        const avatarBase64 = avatarBuffer.toString('base64');
        return { avatar: avatarBase64 };
      } else {
        // If the avatar file doesnt exists, but the avatar was at the db
        try {
          const { avatarBase64 } = await saveAvatar(userId);
          return { avatar: avatarBase64 };
        } catch (error) {
          console.error('Error downloading avatar:', error);
          return { message: 'Failed to download avatar.' };
        }
      }
    }

    // If the avatar is not found in the database and file system, download and save it
    try {
      const { avatarBase64, avatarUrl } = await saveAvatar(userId);

      const newAvatar = new this.avatarModel({
        userId: userId,
        avatarUrl: avatarUrl,
      });

      await newAvatar.save();

      return { avatar: avatarBase64 };
    } catch (error) {
      console.error('Error downloading avatar:', error);
      return { message: 'Failed to download avatar.' };
    }
  }

  @Delete(':userId/avatar')
  async deleteAvatar(@Param('userId') userId: string) {
    const avatar = await this.avatarModel.findOneAndDelete({ userId }).exec();

    if (!avatar) {
      throw new NotFoundException('Avatar not found in the database.');
    }

    const avatarPath = join(__dirname, '..', 'avatars', `${userId}.png`);

    try {
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
      return { message: 'Avatar Deleted from DB and Storage!' };
    } catch (error) {
      console.error('Error deleting avatar from FileSystem:', error);
      throw new InternalServerErrorException(
        'Failed to delete avatar from FileSystem.',
      );
    }
  }
}
