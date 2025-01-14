import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

@Controller('auth')
export class AuthoController {
  constructor(private authService: AuthService) {}

  @ApiPropertyOptional({
    title: 'SignUp',
    example: {
      email: 'joe@gmail.com',
      password: '123sjdkjfl@#',
    },
  })
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @ApiPropertyOptional({
    title: 'SignIn',
    example: {
      email: 'joe@gmail.com',
      password: '123sjdkjfl@#',
    },
  })
  @Post('signin')
  singin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
