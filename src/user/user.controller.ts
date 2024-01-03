import { Controller, Post, Body, Inject, Res, ValidationPipe, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login-user.todo';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Get('init')
  async init() {
    // 初始化用户数据
    return await this.userService.initData();
  }

  @Post('login')
  async login(@Body(ValidationPipe) user: LoginDto, @Res({ passthrough: true }) res: Response) {
    console.log(user);
    const foundUser = await this.userService.login(user);
    if (foundUser) {
      const token = await this.jwtService.signAsync({
        user: {
          id: foundUser.id,
          username: foundUser.username,
        },
      });
      res.setHeader('token', token);
      return 'login success';
    } else {
      return '登录失败';
    }
  }

  @Post('register')
  async register(@Body(ValidationPipe) user: RegisterDto) {
    return await this.userService.register(user);
  }
}
