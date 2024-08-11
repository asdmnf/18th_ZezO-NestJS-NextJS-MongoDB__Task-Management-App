import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(3, 20)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(6, 20)
  readonly password: string;

  @IsString()
  readonly linkedin_url: string;
}
