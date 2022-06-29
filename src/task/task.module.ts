import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { taskSchema } from './entities/task.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Task', schema: taskSchema }])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
