import { Injectable } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ATTRIBUTE_MODEL, AttributeDocument } from "src/Schema/attribute";
import { CrudService } from "src/base/crud.service";
import { CreateAttributeDTO } from "./dto/create-attribute.dto";

@Injectable()
export class AttributeService extends CrudService {
  constructor(
    @InjectModel(ATTRIBUTE_MODEL)
    private readonly attributeModel: Model<AttributeDocument>
  ) {
    super(attributeModel);
  }

  async createAttribute(
    createAttributeDTO: CreateAttributeDTO
  ): Promise<{ message: string }> {
    const { name } = createAttributeDTO;
    try {
      const result = await this.attributeModel.create({ name: name });
      return {
        message: "Attribute Create Sucessfully!",
      };
    } catch (err) {
      console.log(err);
      throw new ExceptionsHandler(err);
    }
  }

  async getAllAttribute(): Promise<{ result: any }> {
    try {
      const result = await this.attributeModel.find();

      return {
        result: result,
      };
    } catch (err) {
      console.log(err);
      throw new ExceptionsHandler(err);
    }
  }

  async deleteAttributeById(id: String): Promise<{ message: string }> {
    try {
      const result = await this.attributeModel.findByIdAndDelete(id);

      return {
        message: "Attribute Deleted Sucessfullly!",
      };
    } catch (err) {
      console.log(err);
      throw new ExceptionsHandler(err);
    }
  }

  async updateAtttributeById(
    id: String,
    value: any
  ): Promise<{ message: string }> {
    try {
      console.log(value)
      const result = await this.attributeModel.findByIdAndUpdate(
        { _id: id },
        { $set: { name: value.name } }
      );
      console.log(result)

      return {
        message: "Attribute Updated Sucessfullly!",
      };
    } catch (err) {
      console.log(err);
      throw new ExceptionsHandler(err);
    }
  }
  async getAttributeById(id: String): Promise<{ result: any }> {
    try {
      const result = await this.attributeModel.findById(id);

      return {
        result: result,
      };
    } catch (err) {
      console.log(err);
      throw new ExceptionsHandler(err);
    }
  }
}
