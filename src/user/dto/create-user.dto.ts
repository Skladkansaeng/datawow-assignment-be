import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  image?: string;
}

export class AuthUserDto {
  @IsString()
  username: string;
}
