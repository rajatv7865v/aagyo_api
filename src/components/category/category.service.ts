import { BadRequestException, Injectable } from "@nestjs/common";
import { CrudService } from "src/base/crud.service";
import { InjectModel } from "@nestjs/mongoose";
import { MERCHANT_MODEL, MerchantDocument } from "src/Schema/merchant";
import { Model } from "mongoose";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { AREAMANAGER_MODEL, AreaManagerDocument } from "src/Schema/areaManager";
import { CategoryDocument } from "src/Schema/category";

@Injectable()
export class CategoryService extends CrudService {
  constructor(
    @InjectModel(AREAMANAGER_MODEL)
    private readonly categoryModel: Model<CategoryDocument>
  ) {
    super(categoryModel);
  }
  async getAllCategory(): Promise<{ result: string[] }> {
    try {
      const result = [
        "Foods",
        "Fast Food",
        "Fruits",
        "Sweets",
        "Medicine",
        "Shoes Shop",
      ];
      return {
        result: result,
      };
    } catch (err) {
      console.log(err);
      throw new ExceptionsHandler(err);
    }
  }
}
