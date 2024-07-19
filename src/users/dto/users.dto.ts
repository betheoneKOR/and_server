import { IsArray, IsString } from "class-validator";

export class UserDto {
    @IsString()
    id: number;

    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsArray()
    roles: string[];
}