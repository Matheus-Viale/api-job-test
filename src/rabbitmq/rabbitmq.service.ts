import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private rabbitMQConnection: amqp.Connection;
  private channel: amqp.Channel;

  constructor() {
    // Establish a connection to RabbitMQ
    amqp
      .connect('amqp://localhost')
      .then((connection) => {
        this.rabbitMQConnection = connection;
        return connection.createChannel();
      })
      .then((channel) => {
        this.channel = channel;
        // Assert a queue for your event
        return channel.assertQueue('nestjs_queue', { durable: false });
      })
      .catch((error) => {
        console.error('Failed to establish RabbitMQ connection:', error);
      });
  }

  async sendEvent(eventData: any): Promise<void> {
    const eventQueue = 'nestjs_queue';
    const eventMessage = JSON.stringify(eventData);

    // Send the event to the queue
    this.channel.sendToQueue(eventQueue, Buffer.from(eventMessage));
  }
}
