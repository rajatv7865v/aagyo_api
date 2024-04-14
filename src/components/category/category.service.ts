import { BadRequestException, Injectable } from "@nestjs/common";
import { CrudService } from "src/base/crud.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model, mongo } from "mongoose";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { CATEGORY_MODEL, CategoryDocument } from "src/Schema/category";
import { CreateCategoryDTO } from "./dto/create-category.dto";
import { S3Service } from "../s3/s3.service";
import { CategoryStatusDTO } from "./dto/update-status.dto";
import { stat } from "fs";

@Injectable()
export class CategoryService extends CrudService {
  constructor(
    @InjectModel(CATEGORY_MODEL)
    private readonly categoryModel: Model<CategoryDocument>,
    private readonly s3Service: S3Service
  ) {
    super(categoryModel);
  }
  async createCategory(
    createCategoryDTO: CreateCategoryDTO,
    file: Express.Multer.File
  ): Promise<any> {
    try {
      const { categoryName } = createCategoryDTO;
      const uploadedFile = await this.s3Service.uploadFile(file);
      const result = await this.categoryModel.create({
        name: categoryName,
        banner: uploadedFile,
      });
      return {
        message: "Category Created Sucessfully!",
        status: "SUCCESS",
      };
    } catch (err) {
      throw err;
    }
  }

  async getAllCategory(): Promise<{ result: string[] }> {
    try {
      const aggregatePipeline: any = [
        {
          $match: {},
        },
        {
          $group: {
            _id: null,
            category: { $push: "$name" },
          },
        },
        {
          $project: {
            _id: 0,
            category: 1,
          },
        },
      ];
      const result = await this.categoryModel.aggregate(aggregatePipeline);
      return {
        result: result[0].category,
      };
    } catch (err) {
      console.log(err);
      throw new ExceptionsHandler(err);
    }
  }

  async getAllCategoryWithStatus(): Promise<any> {
    try {
      const aggregatePipeline: any = [
        {
          $match: {},
        },
        {
          $project: {
            banner: 1,
            name: 1,
            status: 1,
          },
        },
      ];
      const result = await this.categoryModel.aggregate(aggregatePipeline);
      return {
        result: result,
      };
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }

  async updateCategoryStatus(
    id: any,
    categoryStatusDTO: CategoryStatusDTO
  ): Promise<any> {
    try {
      const { status } = categoryStatusDTO;
      const result = await this.categoryModel.findOneAndUpdate(
        { _id: new mongo.ObjectId(id) },
        {
          $set: {
            status: status,
          },
        }
      );
      return {
        status: "SUCCESS",
        message: "Category Status Updated Successfully",
      };
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }
}
