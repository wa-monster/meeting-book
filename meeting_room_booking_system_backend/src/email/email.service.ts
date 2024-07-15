import { Injectable } from '@nestjs/common';
import { createTransport, Transporter as Trn } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Trn;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: '203748506@qq.com',
        pass: '',
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统',
        address: '203748506@qq.com',
      },
      to,
      subject,
      html,
    });
  }
}
