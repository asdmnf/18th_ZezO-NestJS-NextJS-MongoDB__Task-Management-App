import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schema/task.schema';
import { Model } from 'mongoose';
import { createTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(createTaskDto: createTaskDto, userId: string): Promise<Task> {
    const task = await this.taskModel.create({
      userId,
      ...createTaskDto,
    });
    return task;
  }

  async findAll(userId: string): Promise<Task[]> {
    const tasks = await this.taskModel
      .find({ userId })
      .sort({ dueDate: -1 })
      .exec();
    return tasks;
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {
      new: true,
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async delete(id: string): Promise<void> {
    const result = await this.taskModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  async getUserCategories(userId: string): Promise<string[]> {
    const categories = await this.taskModel
      .find({ userId })
      .distinct('category');
    return categories;
  }

  async getTasksByCategory(userId: string, category: string): Promise<Task[]> {
    const categories = await this.taskModel
      .find({ userId })
      .distinct('category');
    if (!categories.includes(category)) {
      throw new NotFoundException('Category not found');
    }

    const tasks = await this.taskModel.find({ userId, category }).exec();
    return tasks;
  }

  async complete(id: string): Promise<Task> {
    const task = await this.taskModel.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true },
    );
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
}
