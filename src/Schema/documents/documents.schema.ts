import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export class DocumentDetail {
  @Prop()
  documentName: string;

  @Prop()
  link: string;
}
@Schema({ timestamps: true })
export class Documents {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Merchant" })
  merchant_id: mongoose.Schema.Types.ObjectId;

  @Prop({})
  documents: DocumentDetail[];
}

export type DocumentDetailDocument = DocumentDetail & Document;
export const DocumentDetailSchema =
  SchemaFactory.createForClass(DocumentDetail);
export const DOCUMENTDETAIL_MODEL = DocumentDetail.name;
