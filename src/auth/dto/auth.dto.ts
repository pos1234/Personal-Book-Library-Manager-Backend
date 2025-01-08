import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiPropertyOptional({
    title: 'User email',
    example: 'joe@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    title: 'User password',
    example: '1234jkjdkjf@#',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
