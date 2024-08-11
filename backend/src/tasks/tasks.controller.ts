import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { PrivateRoute } from 'src/common/decorators/private-route.decorator';
import { TasksService } from './tasks.service';
import { createTaskDto } from './dto/create-task.dto';
import { Task } from './schema/task.schema';
import { CustomExpressRequest } from 'src/utils/types/custom-express-request.type';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/mongo-id.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @PrivateRoute()
  create(
    @Body() createTaskDto: createTaskDto,
    @Req() req: CustomExpressRequest,
  ): Promise<Task> {
    const userId = req.user._id as string;
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  @PrivateRoute()
  findAll(@Req() req: CustomExpressRequest): Promise<Task[]> {
    const userId = req.user._id as string;
    return this.tasksService.findAll(userId);
  }

  @Get(':id')
  @PrivateRoute()
  findOne(@Param('id', ParseMongoIdPipe) id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  @PrivateRoute()
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @PrivateRoute()
  delete(@Param('id', ParseMongoIdPipe) id: string): Promise<void> {
    return this.tasksService.delete(id);
  }

  @Get('custom/categories')
  @PrivateRoute()
  getUserCategories(@Req() req: CustomExpressRequest): Promise<string[]> {
    const userId = req.user._id as string;
    return this.tasksService.getUserCategories(userId);
  }

  @Get('custom/categories/:category')
  @PrivateRoute()
  getTaskByCategory(
    @Param('category') category: string,
    @Req() req: CustomExpressRequest,
  ): Promise<Task[]> {
    const userId = req.user._id as string;
    return this.tasksService.getTasksByCategory(userId, category);
  }

  @Put('custom/:id/complete')
  @PrivateRoute()
  complete(@Param('id', ParseMongoIdPipe) id: string): Promise<Task> {
    return this.tasksService.complete(id);
  }
}
