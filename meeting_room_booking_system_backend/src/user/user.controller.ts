import {
  Body,
  Controller,
  Inject,
  Post,
  Query,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registerUserDto';
import { UserLoginDto } from './dto/UserLoginDto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() registerUser: RegisterUserDto) {
    console.log('registerUser', registerUser);
    return this.userService.register(registerUser);
  }
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

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
    const vo = await this.userService.userLogin(userLoginData, false);
    console.log('userLoginData', userLoginData);
    // 生成token
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        userName: vo.userInfo.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );

    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expires_time') || '7d',
      },
    );
    return vo;
  }
  @Post('user-refresh')
  async userRefresh(@Body() RefreshObj: { refreshToken: string }) {
    try {
      const data = this.jwtService.verify(RefreshObj.refreshToken);
      const user = await this.userService.findUserById(data.userId, false);

      const accessToken = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      );
      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expres_time') || '7d',
        },
      );
      return {
        access_token: accessToken,
        refresh_token,
      };
    } catch (error) {
      throw new UnauthorizedException('token已失效,请重新登录');
    }
  }

  @Post('admin-login')
  async adminLogin(@Body() userLoginData: UserLoginDto) {
    const vo = await this.userService.userLogin(userLoginData, true);
    // 生成token
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        userName: vo.userInfo.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );

    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expires_time') || '7d',
      },
    );
    return vo;
  }

  @Post('admin-refresh')
  async adminRefresh(@Body() RefreshObj: { refreshToken: string }) {
    try {
      const data = this.jwtService.verify(RefreshObj.refreshToken);
      const user = await this.userService.findUserById(data.userId, true);

      const resData = this.getJwtToken(user);
      return resData;
    } catch (error) {
      throw new UnauthorizedException('token已失效,请重新登录');
    }
  }

  async getJwtToken(user) {
    const accessToken = this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );
    const refresh_token = this.jwtService.sign(
      {
        userId: user.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expres_time') || '7d',
      },
    );
    return {
      access_token: accessToken,
      refresh_token,
    };
  }
}
