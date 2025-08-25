import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = Authenticate & Document;

@Schema()
export class Authenticate {

  @Prop({required: true})
  name: string

  @Prop({ unique: true, required: true })
  email: string;
  
  @Prop({ required: true })
  password: string; 

  @Prop({ type: String, enum: ['user', 'admin'], default: 'user'})
  role: string;

  @Prop({ type: String, default: null })
  fcmToken?: string | null;
}

export const UserSchema = SchemaFactory.createForClass(Authenticate);
