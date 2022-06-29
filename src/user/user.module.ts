import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './entities/user.model';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {}
