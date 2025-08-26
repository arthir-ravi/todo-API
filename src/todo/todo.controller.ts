import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, Req, Query } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './schemas/todo.schema';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Roles } from 'src/authenticate/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodoController {
  authService: any;
  constructor(private readonly todoService: TodoService) {}

  //Admin
  @Roles('admin')
  @Get('all-todos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getTodos( @Req() req, @Query('page') page: string = '1', @Query('limit') limit: string = '10', @Query('userId') userId?: string,) {
    return this.todoService.getTodosForUser(req.user, Number(page), Number(limit), userId);
  }


  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @Delete('all-todos/:id')
  deleteTodo(@Param('id') id: string) {
    return this.todoService.deleteTodoById(id);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @Put('all-todos/:id')
  updateTodo(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.updateTodoById(id, updateTodoDto);
  }

  @Post()
  create(@Request() req, @Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todoService.create(createTodoDto, req.user.userId);
  }

  //User
  @Get()
  findAll(@Request() req, @Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    return this.todoService.findAllForUser(req.user.userId, Number(page), Number(limit)
    );
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string): Promise<Todo | null> {
    return this.todoService.findOneForUser(id, req.user.userId);
  }

  @Put(':id')
  update(@Request() req,@Param('id') id: string,@Body() updateTodoDto: UpdateTodoDto): Promise<Todo | null> {
    return this.todoService.updateForUser(id, req.user.userId, updateTodoDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string): Promise<Todo | null> {
    return this.todoService.removeForUser(id, req.user.userId);
  } 
}
