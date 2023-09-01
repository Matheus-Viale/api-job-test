import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { emailLogin } from '../utils/configVariables';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: emailLogin.service,
      auth: {
        user: emailLogin.user,
        pass: emailLogin.password,
      },
    });
  }

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: emailLogin.user,
        to,
        subject,
        text: content,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }
}
