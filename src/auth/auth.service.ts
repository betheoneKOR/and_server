import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/users/dto/users.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }
  private readonly logger = new Logger(AuthService.name);

  /**
   * UsersService의 findOne함수를 이용해 유저 정보를 찾은 후 password가 일치하면 result, 일치하지 않으면 null을 리턴
   * @param username : string
   * @param pass : string
   * @returns result: UserDto(without password) | null
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * 로그인 인증(JWT토큰)을 받기 위한 함수
   * LocalAuthGuard에서 유저인증 후 접근 가능함
   * JWT 데이터는 password같은 중요한 데이터가 들어가면 안됨
   * @param user : any
   * @returns access_token
   */
  async login(user: UserDto) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}
