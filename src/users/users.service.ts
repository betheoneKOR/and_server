import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateUserDto, UserDto } from './dto/users.dto';
import { Redis } from 'ioredis';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  /**
   * Redis Hash의 key값을 user:${username}으로 설정
   * @param username: string
   * @returns Redis key user:${username}
   */
  private getKey(username: string): string {
    return `user:${username}`;
  }

  /**
   * user가 DB에 저장되어 있는지 확인
   * @param username : stringg
   * @returns boolean
   */
  async userExists(username: string): Promise<boolean> {
    const key = this.getKey(username);
    return (await this.redisClient.exists(key)) === 1;
  }

  /**
   * CREATE
   * @param user : UserDto
   */
  async createUser(user: UserDto): Promise<void> {
    const key = this.getKey(user.username);
    const existingUser = await this.redisClient.exists(key);
    if (existingUser) {
      throw new Error('User already exists');
    }

    try {
      await this.redisClient.hmset(
        key,
        'username',
        user.username,
        'password',
        user.password,
        'roles',
        user.roles,
      );
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }

  /**
   * READ
   * @param username : string
   * @returns 
   */
  async getUser(username: string): Promise<UserDto> {
    const key = this.getKey(username);
    const user = await this.redisClient.hgetall(key);
    if (!user || Object.keys(user).length === 0) {
      throw new NotFoundException('User not found');
    }
    return {
      username: user.username,
      password: user.password,
      roles: user.roles,
    };
  }

  /**
   * UPDATE
   * @param username : string
   * @param updates : userDto
   */
  async updateUser(username: string, updates: UpdateUserDto): Promise<void> {
    const key = this.getKey(username);
    const userExists = await this.redisClient.exists(key);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    // Merge updates with existing user data
    const user = await this.redisClient.hgetall(key);
    const updatedUser = {
      ...user,
      ...updates,
      roles: updates.roles ? updates.roles : user.roles,
    };

    await this.redisClient.hmset(key, updatedUser);
  }

  /**
   * DELETE
   * @param username : string
   */
  async deleteUser(username: string): Promise<void> {
    const key = this.getKey(username);
    const userExists = await this.redisClient.exists(key);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }
    await this.redisClient.del(key);
  }

  /**
   * Redis DB에서 일치하는 username의 데이터를 리턴함
   * @param username : string
   * @returns user
   */
  async findOne(username: string): Promise<UserDto | undefined> {
    const user = this.getUser(username);
    return user;
  }
}
