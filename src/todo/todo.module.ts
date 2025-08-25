import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { Authenticate, UserSchema } from 'src/authenticate/Schemas/authenticate.schema';
import { FirebaseAdminModule } from 'src/firebase-admin/firebase-admin.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }, { name: Authenticate.name, schema: UserSchema },]), FirebaseAdminModule],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}