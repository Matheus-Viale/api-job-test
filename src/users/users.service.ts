import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.model';
import { EmailService } from '../email/email.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { dummyEmail } from '../utils/configVariables';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    private readonly emailService: EmailService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    const user = await newUser.save();

    this.emailService.sendEmail(
      dummyEmail,
      'Welcome to our app!',
      'Thank you for signing up!',
    );

    this.rabbitMQService.sendEvent({ eventType: 'user_created', data: user });

    return user;
  }
}
