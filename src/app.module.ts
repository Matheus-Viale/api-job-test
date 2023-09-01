import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQConsumer } from './rabbitmq/rabbitmq.consumer';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { User, UserSchema } from './users/user.model';
import { EmailService } from './email/email.service';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';
import { UserController } from './users/user/user.controller';
import { AvatarController } from './users/avatar/avatar.controller';
import { Avatar, AvatarSchema } from './users/avatar/avatar.model';
import { mongoURL } from './utils/configVariables';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_CONNECTION',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'nestjs_queue',
        },
      },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Avatar.name, schema: AvatarSchema }]),
    MongooseModule.forRoot(
      mongoURL,
    ),
  ],
  controllers: [UsersController, UserController, AvatarController],
  providers: [RabbitMQConsumer, UsersService, EmailService, RabbitMQService],
})
export class AppModule {}
