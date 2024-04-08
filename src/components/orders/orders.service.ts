import { Injectable } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ORDERMODEL, OrderDocument } from "src/Schema/order";
import { CrudService } from "src/base/crud.service";

@Injectable()
export class OrdersService extends CrudService {
  constructor(
    @InjectModel(ORDERMODEL)
    private readonly orderDcument: Model<OrderDocument>
  ) {
    super(orderDcument);
  }
  async createOrder(): Promise<any> {
    try {
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }
}
