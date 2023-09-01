import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Injectable()
export class RabbitMQConsumer {
  @MessagePattern('nestjs_queue')
  async handleMessage(data: any): Promise<void> {
    console.log('Received message:', data);
  }
}
