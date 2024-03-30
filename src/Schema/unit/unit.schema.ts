import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Date, Document } from "mongoose";

@Schema({ timestamps: true })
export class Unit {
  @Prop({ required: true })
  name: string;
}

export type UnitDocument = Unit & Document;

export const UnitSchema = SchemaFactory.createForClass(Unit);

export const UNIT_MODEL = Unit.name;
