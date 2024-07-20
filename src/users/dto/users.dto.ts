import { IsString } from "class-validator";

export class UserDto {
    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsString()
    roles: string;
}

export class UpdateUserDto {
    @IsString()
    password: string;

    @IsString()
    roles?: string;
}