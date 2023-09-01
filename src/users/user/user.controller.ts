import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';

@Controller('user')
export class UserController {
  @Get(':userId')
  async getUser(@Param('userId') userId: number) {
    try {
      const response = await axios.get(`https://reqres.in/api/users/${userId}`);
      return response.data.data;
    } catch (error) {
      // Handle Axios error or non-successful response status
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
