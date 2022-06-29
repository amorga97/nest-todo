import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { iUser } from './entities/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly User: Model<iUser>,
    private readonly auth: AuthService
  ) {}
  async create(createUserDto: CreateUserDto) {
    const newUser = await this.User.create(createUserDto);
    const token = this.auth.createToken(newUser.id);
    return {
      user: newUser,
      token,
    };
  }

  async login(loginData: { email: string; password: string }) {
    const user = await this.User.findOne({
      email: loginData.email,
      password: loginData.password,
    });
    if (user === null) throw new NotFoundException('User does not exist.');
    const token = this.auth.createToken(user.id);
    return {
      user,
      token,
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
