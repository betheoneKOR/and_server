import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto, UserDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { Controller, Post, Get, Delete, Param, Body, NotFoundException, BadRequestException, Patch, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/role.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() user: UserDto): Promise<{ message: string }> {
    try {
      await this.usersService.createUser(user);
      return { message: 'User created successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':username')
  async getUser(@Param('username') username: string): Promise<any> {
    try {
      const user = await this.usersService.getUser(username);
      return user;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Patch(':username')
  async updateUser(
    @Param('username') username: string,
    @Body() updates: UpdateUserDto,
  ): Promise<{ message: string }> {
    try {
      await this.usersService.updateUser(username, updates);
      return { message: 'User updated successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':username')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MASTER', 'ADMIN')
  async deleteUser(@Param('username') username: string): Promise<{ message: string }> {
    try {
      await this.usersService.deleteUser(username);
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }
}
