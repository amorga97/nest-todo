import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { iTask } from './entities/task.model';

@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private readonly Task: Model<iTask>) {}
  async create(createTaskDto: CreateTaskDto) {
    return this.Task.create(createTaskDto);
  }

  async findAll() {
    return this.Task.find({});
  }

  async findOne(id: string) {
    return this.Task.findById(id);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.Task.findByIdAndUpdate(id, updateTaskDto, { new: true });
  }

  async remove(id: string) {
    return this.Task.findByIdAndDelete(id);
  }
}
