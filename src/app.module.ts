import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { BcryptService } from './auth/bcrypt/bcrypt.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USER}:${
        process.env.PASSWORD
      }@cluster0.pauk1.mongodb.net/${
        process.env.NODE_ENV === 'test'
          ? process.env.TEST_DBNAME
          : process.env.DBNAME
      }?retryWrites=true&w=majority`
    ),
    TaskModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, BcryptService],
})
export class AppModule {}
