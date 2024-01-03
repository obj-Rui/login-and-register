import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(RedisService)
  private redisService: RedisService;

  // 这里可以进行权限验证等操作
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.header('authorization') || '';
    const bearer = authorization.split(' ');

    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('登录 token 错误');
    }
    const token = bearer[1];

    const info = this.jwtService.verify(token);
    const { username } = info.user;
    const foundUser = await this.userService.findByUsername(username);

    let permissions = await this.redisService.listGet(`user_${username}_permission`);
    console.log('-=------', permissions);

    if (!permissions.length) {
      const foundUser = await this.userService.findByUsername(username);
      console.log('-=22------', foundUser);
      permissions = foundUser.permissions.map((p) => p.name);
      this.redisService.listSet(`user_${username}_permission`, permissions);
    }

    const permission = this.reflector.get('permission', context.getHandler());
    console.log(permissions);
    if (permissions.some((p) => p === permission)) {
      return true;
    } else {
      throw new UnauthorizedException('您没有权限访问该页面');
    }

    console.log(foundUser);
    return true; // 这里可以添加一些权限判断的逻辑
  }
}
