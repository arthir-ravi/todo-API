import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Authenticate, UserSchema } from './Schemas/authenticate.schema';
import { AuthenticateService } from './authenticate.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthenticateController } from './authenticate.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Authenticate.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'SECRET_KEY'
    }),
  ],
  providers: [AuthenticateService, JwtStrategy],
  controllers: [AuthenticateController],
})
export class AuthenticateModule {}
