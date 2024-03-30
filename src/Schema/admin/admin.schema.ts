import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

@Schema()
export class Admin {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;
}

export type AdminDocument = Admin & Document;

export const AdminSchema = SchemaFactory.createForClass(Admin);

export const ADMIN_MODEL = Admin.name;
