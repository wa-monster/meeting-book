import { Body, Controller, Inject, Post, Query, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registerUserDto';
import { UserLoginDto } from './dto/UserLoginDto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    console.log('registerUser', registerUser);
    return this.userService.register(registerUser);
  }

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 60 * 5);
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是：${code}</p>`,
    });
    return '发送成功';
  }
  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return 'done';
  }

  @Post('user-login')
  async userLogin(@Body() userLoginData: UserLoginDto) {
    // const user = await this.userService.userLogin(userLoginData);
    console.log('userLoginData', userLoginData);

    return 'success';
  }

  @Post('admin-login')
  async adminLogin(@Body() userLoginData: UserLoginDto) {
    // const user = await this.userService.userLogin(userLoginData);
    console.log('userLoginData', userLoginData);

    return 'success';
  }
}
