import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Date, Document } from "mongoose";

@Schema({ timestamps: true })
export class Attribute {
  @Prop({ required: true })
  name: string;
}

export type AttributeDocument = Attribute & Document;

export const AttributeSchema = SchemaFactory.createForClass(Attribute);

export const ATTRIBUTE_MODEL = Attribute.name;
