import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private readonly redisClient: RedisClientType;

  async listGet(key: string) {
    return await this.redisClient.lRange(key, 0, -1); // 查询所有数据
  }

  async listSet(key: string, list: string[], ttl?: number) {
    for (const item of list) {
      await this.redisClient.lPush(key, item);
    }
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }
}
