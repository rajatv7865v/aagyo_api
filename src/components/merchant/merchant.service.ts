import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { CreateMerchantDTO } from "./dto/createMerchant.dto";
import { CrudService } from "src/base/crud.service";
import { InjectModel } from "@nestjs/mongoose";
import { MERCHANT_MODEL, MerchantDocument } from "src/Schema/merchant";
import mongoose, { Model } from "mongoose";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { MerchantSortFilterDTO } from "./dto/merchantSortFilterDTO";
import { StoreStatus } from "./dto/store-Status.dto";
import { STORE_MODEL, StoreDocument } from "src/Schema/store";
import { ObjectId } from "mongodb";
import { addDays, addHours, format, parse } from "date-fns";

@Injectable()
export class MerchantService extends CrudService {
  constructor(
    @InjectModel(MERCHANT_MODEL)
    private readonly merchantModel: Model<MerchantDocument>,
    @InjectModel(STORE_MODEL)
    private readonly storeModel: Model<StoreDocument>
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

  async isStoreOpenStatus(
    merchantId: Object,
    storeStatus: StoreStatus
  ): Promise<any> {
    try {
      const { isOpen, autoOpenTime } = storeStatus;
      const curerentDateAndTime = new Date();
      let time: Date;
      switch (autoOpenTime) {
        case "TWOHOUR":
          time = addHours(curerentDateAndTime, 2);
          break;
        case "FOURHOUR":
          time = addHours(curerentDateAndTime, 4);
          break;
        case "TOMMAROW":
          let storeTime: any = await this.storeModel.findOne({
            merchant_id: new Object(merchantId),
          });
          if (storeTime.slots) {
            storeTime = storeTime?.slots[0]?.openTime;
            storeTime = parse(storeTime, "hh:mm a", new Date());
            let nextDate = addDays(storeTime, 1);
            if (nextDate) {
              time = nextDate;
            }
          } else {
            time = addDays(curerentDateAndTime, 1);
          }
          break;
        case "CUSTOM":
          time = new Date();
          break;
      }

      const result = await this.storeModel.findOneAndUpdate(
        { merchant_id: new Object(merchantId) },
        {
          $set: {
            openStatus: {
              openStatus: isOpen,
              autoOpenTime: time,
            },
          },
        }
      );
      return {
        message: isOpen
          ? "Store Open Successfully!"
          : "Store Close Successfully",
      };
    } catch (error) {
      console.log(error);
      throw new ExceptionsHandler(error);
    }
  }

  async getProfileDetail(merchantId: ObjectId): Promise<any> {
    try {
      const aggregatePipeline: any = [
        {
          $match: {
            _id: new ObjectId(merchantId),
          },
        },
        {
          $lookup: {
            from: "stores",
            localField: "_id",
            foreignField: "merchant_id",
            as: "storeDetail",
          },
        },
        {
          $unwind: "$storeDetail",
        },
        {
          $project: {
            banner: "$storeDetail.banner",
            ownerDetail: {
              name: "$name",
              email: "$email",
              phone: "$contact",
            },
            managerDetail: {
              name: "$name",
              email: "$email",
              phone: "$contact",
            },
            outletContact: {
              primaryNumber: "$contact",
              secondaryNumber: "$contact",
            },
          },
        },
      ];
      const result = await this.merchantModel.aggregate(aggregatePipeline);
      return {
        result: result[0],
      };
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }
}
