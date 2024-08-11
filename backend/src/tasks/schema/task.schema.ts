import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Task extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
