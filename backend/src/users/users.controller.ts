import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schema/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrivateRoute } from 'src/common/decorators/private-route.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.usersService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.usersService.login(loginDto);
  }

  @Get('profile')
  @PrivateRoute()
  getProfile(@Headers('Authorization') authHeader: string): Promise<User> {
    const token = authHeader?.replace('Bearer ', '');
    return this.usersService.verifyToken(token);
  }
}
