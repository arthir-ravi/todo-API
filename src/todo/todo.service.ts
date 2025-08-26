import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';
import { Authenticate, UserDocument } from 'src/authenticate/Schemas/authenticate.schema';
import { FirebaseAdminService } from 'src/firebase-admin/firebase-admin.service';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
  @InjectModel(Authenticate.name) private userModel: Model<UserDocument>,
  private firebaseService: FirebaseAdminService) {}

  async create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
    const newTodo = new this.todoModel({ ...createTodoDto, userId });
    return newTodo.save();
  }

  //Admin
  async getTodosForUser(user: any, page = 1, limit = 10, userId?: string): Promise<any> {
    if (user.role === 'admin') {
      const skip = (page - 1) * limit;
      const filter = userId ? { userId } : {};
  
      const todos = await this.todoModel.find(filter).skip(skip).limit(limit).exec();
      const total = await this.todoModel.countDocuments(filter);
  
      return {data: todos,meta: {total,page,limit,totalPages: Math.ceil(total / limit)}};
    }
  }
  
  async deleteTodoById(id: string): Promise<{ message: string }> {
    const todo = await this.todoModel.findByIdAndDelete(id);
    if (!todo) throw new NotFoundException('Todo not found');
  
    const user = await this.userModel.findById(todo.userId);
    if (user?.fcmToken) {
      await this.firebaseService.sendPushNotification(
        user.fcmToken,
        'Todo Deleted',
        `Your todo "${todo.description}" has been deleted by an admin`,
        {action: 'reloadTodos'}
      );
    }
    return { message: 'Todo deleted successfully' };
  }
  
  async updateTodoById(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const updatedTodo = await this.todoModel.findByIdAndUpdate(id, updateTodoDto, { new: true });
    if (!updatedTodo) throw new NotFoundException('Todo not found');
  
    const user = await this.userModel.findById(updatedTodo.userId);
    if (user?.fcmToken) {
      await this.firebaseService.sendPushNotification(
        user.fcmToken,
        'Todo Updated',
        `Your todo "${updatedTodo.description}" has been updated by an admin`,
        {action: 'reloadTodos'}
      );
    }
    return updatedTodo;
  }
  
  //User
  async findAllForUser(userId: string, page = 1, limit = 10): Promise<{ data: Todo[]; meta: any }> {
    const skip = (page - 1) * limit;

    const todos = await this.todoModel.find({ userId }).skip(skip).limit(limit).exec();
    const total = await this.todoModel.countDocuments({ userId }); 
     
    return {data: todos,meta: {total,page,limit,totalPages: Math.ceil(total / limit)}};
  }
  
 
  async findOneForUser(id: string, userId: string): Promise<Todo | null> {
    const todo = await this.todoModel.findOne({ _id: id, userId }).exec();
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async updateForUser(id: string, userId: string, updateTodoDto: UpdateTodoDto): Promise<Todo | null> {
    const todo = await this.todoModel.findOneAndUpdate({ _id: id, userId }, updateTodoDto, { new: true }).exec();
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async removeForUser(id: string, userId: string): Promise<Todo | null> {
    const todo = await this.todoModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }
}
