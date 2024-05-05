import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PRODUCTMODEL, ProductDocument } from "src/Schema/product";
import { CrudService } from "src/base/crud.service";
import { CreateProductDTO } from "./dto/create-product.dto";
import { ObjectId } from "mongodb";
import { S3Service } from "../s3/s3.service";
import { GetProductDTO } from "./dto/get-product.dto";

@Injectable()
export class ProductService extends CrudService {
  constructor(
    @InjectModel(PRODUCTMODEL)
    private readonly productModel: Model<ProductDocument>,
    private readonly s3Service: S3Service
  ) {
    super(productModel);
  }

  async addProduct(
    sub: ObjectId,
    createProductDTO: CreateProductDTO,
    productImage: Express.Multer.File
  ): Promise<any> {
    try {
      const { categoryId, description, keywords, productName, tags, varients } =
        createProductDTO;
      const uploadFile = await this.s3Service.uploadFile(productImage);
      const result = await this.productModel.create({
        productOwner: new ObjectId(sub),
        productName,
        categoryId: categoryId,
        description,
        keywords,
        tags,
        varients,
        productImage: uploadFile,
      });
      return {
        message: "Add Product Sucessfully!",
        status: "SUCCESS",
      };
    } catch (err) {
      throw err;
    }
  }

  async getAllProcucts(
    sub: ObjectId,
    getProductDTO: GetProductDTO
  ): Promise<any> {
    try {
      const { limit, page, search } = getProductDTO;

      const aggregationPipeline: any = [
        {
          $match: {
            productName: {
              $regex: `${search || ""}`,
              $options: "i",
            },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $facet: {
            metadata: [
              { $count: "total" },
              {
                $addFields: {
                  page: +page,
                  maxPage: {
                    $ceil: {
                      $divide: ["$total", +limit],
                    },
                  },
                },
              },
            ],
            data: [{ $skip: (+page - 1) * +limit }, { $limit: +limit }],
          },
        },
      ];

      const result = await this.productModel.aggregate(aggregationPipeline);
      return {
        message: "Product List!",
        status: "SUCCESS",
        data: result,
      };
    } catch (err) {
      throw err;
    }
  }
}
