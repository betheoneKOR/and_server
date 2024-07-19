import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
    private readonly users = [
        {
            id: 1,
            username: 'test',
            password: 'test123',
            roles: ['ADMIN']
        },
    ];
    private readonly logger = new Logger(UsersService.name);

    /**
     * 하드코딩 된 users에서 일치하는 username의 데이터를 리턴함
     * @param username : string
     * @returns user
     */
    async findOne(username: string): Promise<UserDto | undefined> {
        const user = this.users.find(user => user.username === username);
        return user;
    }

}
