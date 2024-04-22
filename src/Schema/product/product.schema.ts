import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import mongoose, { Document } from "mongoose";

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  productOwner: ObjectId;

  @Prop({ required: true, ref: "categories" })
  categoryId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ type: [String], required: true })
  keywords: string[];

  @Prop({ type: [], required: true })
  varients: any[];

  @Prop({ type: Object, required: true })
  productImage: Object;
}

export type ProductDocument = Product & Document;

export const ProductSchema = SchemaFactory.createForClass(Product);

export const PRODUCTMODEL = Product.name;
