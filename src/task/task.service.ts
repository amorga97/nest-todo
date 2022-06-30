import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { iUser } from 'src/user/entities/user.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { iTask } from './entities/task.model';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task') private readonly Task: Model<iTask>,
    @InjectModel('User') private readonly User: Model<iUser>
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    const user = await this.User.findById(createTaskDto.responsible);
    if (user === null)
      throw new NotFoundException('Responsible does not exist');
    const newTask = await this.Task.create(createTaskDto);
    user.tasks.push(newTask.id);
    user.save();
    return newTask;
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
    const task = await this.Task.findById(id);
    const updatedUser = await this.User.findByIdAndUpdate(task.responsible, {
      $pull: { tasks: task.id },
    });
    const deletedTask = await task.delete();
    if (updatedUser === null)
      throw new NotFoundException('User not found. Task deleted');
    return deletedTask;
  }
}
