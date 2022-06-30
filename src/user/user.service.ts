import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { BcryptService } from 'src/auth/bcrypt.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { iUser } from './entities/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly User: Model<iUser>,
    private readonly auth: AuthService,
    private readonly bcrypt: BcryptService
  ) {}
  async create(createUserDto: CreateUserDto) {
    const newUser = await this.User.create({
      ...createUserDto,
      password: this.bcrypt.encrypt(createUserDto.password),
    });
    const token = this.auth.createToken(newUser.id);
    return {
      user: newUser,
      token,
    };
  }

  async login(loginData: { email: string; password: string }) {
    const user = await this.User.findOne({
      email: loginData.email,
    });
    if (user === null) throw new NotFoundException('User does not exist.');
    if (!this.bcrypt.compare(loginData.password, user.password))
      throw new UnauthorizedException('Password or email iconrrect.');
    const token = this.auth.createToken(user.id);
    return {
      user,
      token,
    };
  }

  async loginWithToken(token: string) {
    const tokenData = this.auth.validateToken(token.substring(7)) as JwtPayload;
    const user = await this.User.findById(tokenData.id);
    if (user === null) throw new NotFoundException('User does not exist.');
    const newToken = this.auth.createToken(user.id);
    console.log(user);
    return {
      user,
      token: newToken,
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
