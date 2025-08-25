import { Module, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TodoModule } from './todo/todo.module';
import { LoggerMiddleware } from './todo/middleware/logger.middleware';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthenticateModule } from './authenticate/authenticate.module';
import { FirebaseAdminModule } from './firebase-admin/firebase-admin.module';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MongooseModule.forRoot(process.env.MONGODB_URI!), TodoModule, AuthenticateModule, FirebaseAdminModule],
  providers: [AppService],
  controllers: [AppController]})

  export class AppModule {
    configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

console.log('second one', process.env.MONGODB_URI); 
const uri: string = process.env.MONGODB_URI!;
console.log('url value', uri);
