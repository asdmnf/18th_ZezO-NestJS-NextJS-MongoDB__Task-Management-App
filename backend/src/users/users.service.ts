import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { EnvironmentVariables } from 'src/utils/types/environment-variables.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password } = registerDto;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await this.userModel.create({
      ...registerDto,
      password: hashedPassword,
    });

    return { ...createdUser.toJSON(), password: undefined };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user._id },
      this.configService.get('JWT_SECRET'),
      {
        expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      },
    );

    return { token };
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(
        token,
        this.configService.get('JWT_SECRET'),
      ) as { userId: string };
      const user = await this.userModel.findById(decoded.userId).select('-password');
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
