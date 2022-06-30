import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { taskSchema } from './entities/task.model';
import { userSchema } from 'src/user/entities/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Task', schema: taskSchema },
      { name: 'User', schema: userSchema },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
