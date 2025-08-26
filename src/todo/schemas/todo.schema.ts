import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {
  @Prop({required: true})
  description: string;

  @Prop({ default: false})
  complete: boolean;

  @Prop({required: true})
  userId: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
