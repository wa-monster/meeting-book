import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码不能少于6位' })
  password: string;
}
