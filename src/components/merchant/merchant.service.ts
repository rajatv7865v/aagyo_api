import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateMerchantDTO } from "./dto/createMerchant.dto";
import { CrudService } from "src/base/crud.service";
import { InjectModel } from "@nestjs/mongoose";
import { MERCHANT_MODEL, MerchantDocument } from "src/Schema/merchant";
import { Model } from "mongoose";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { MerchantSortFilterDTO } from "./dto/merchantSortFilterDTO";

@Injectable()
export class MerchantService extends CrudService {
  constructor(
    @InjectModel(MERCHANT_MODEL)
    private readonly merchantModel: Model<MerchantDocument>
  ) {
    super(merchantModel);
  }
  async getAllMerchants(
    merchantSortFilterDTO: MerchantSortFilterDTO
  ): Promise<{ result: any }> {
    try {
      const { limit, page, search, zone, city } = merchantSortFilterDTO;

      const aggregationPipeline: any = [
        {
          $match: {
            "storeDetails.fullName": {
              $regex: `${search}`,
              $options: "i",
            },
            "storeDetails.operatingZone": {
              $regex: `${zone}`,
              $options: "i",
            },
            "storeDetails.city": {
              $regex: `${city}`,
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
          $project: {
            _id: 1,
            createdAt: 1,
            storeDetails: 1,
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                { _id: "$_id", createdAt: "$createdAt" },
                "$storeDetails",
              ],
            },
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

      const result = await this.merchantModel.aggregate(aggregationPipeline);
      return {
        result,
      };
    } catch (err) {
      throw new ExceptionsHandler(err);
    }
  }

  async getMerchantById(id: Object): Promise<any> {
    try {
      const result = await this.merchantModel.findById(id);
      return result;
    } catch (err) {
      throw new ExceptionsHandler(err);
    }
  }

  async createMerchant(
    createMerchantDTO: CreateMerchantDTO
  ): Promise<{ message: string }> {
    try {
      console.log(createMerchantDTO);
      const result = await this.merchantModel.create(createMerchantDTO);
      console.log(result);
      return {
        message: "Merchent Create Sucessfully!",
      };
    } catch (err) {
      console.log(err);
      throw new ExceptionsHandler(err);
    }
  }

  async updateMerchant(
    id: Object,
    createMerchantDTO: CreateMerchantDTO
  ): Promise<{ message: string }> {
    try {
      const filter = { _id: id };
      const update = {
        $set: {
          ...createMerchantDTO,
        },
      };
      const result = await this.merchantModel.updateOne(filter, update);
      if (!result) {
        throw new BadRequestException();
      }
      return {
        message: "Merchant Update Sucessfully!",
      };
    } catch (err) {}
  }

  async getAllStoresName(): Promise<{ result: any }> {
    try {
      const aggregationPipeline: any = [
        {
          $match: {},
        },
        {
          $addFields: {
            storeName: "$storeDetails.storeName",
          },
        },
        {
          $project: {
            _id: 1,
            storeName: 1,
          },
        },
      ];

      const result = await this.merchantModel.aggregate(aggregationPipeline);

      return {
        result,
      };
    } catch (err) {
      throw new ExceptionsHandler(err);
    }
  }
}
