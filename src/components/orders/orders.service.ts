import { Injectable } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { ORDERMODEL, OrderDocument } from "src/Schema/order";
import { CrudService } from "src/base/crud.service";

@Injectable()
export class OrdersService extends CrudService {
  constructor(
    @InjectModel(ORDERMODEL)
    private readonly orderModel: Model<OrderDocument>
  ) {
    super(orderModel);
  }
  async createOrder(): Promise<any> {
    try {
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }

  async getDeliveredOrderDetails(id: ObjectId): Promise<any> {
    try {
      const data = {
        today: {
          totalPrice: 30000,
          totalOrders: 16,
        },
        week: {
          totalPrice: 30000,
          totalOrders: 16,
        },
        month: {
          totalPrice: 30000,
          totalOrders: 16,
        },
      };
      return {
        message: "Report Generate Successfully!",
        status: "SUCCESS",
        data: data,
      };
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }

  async getRejectedOrderDetails(id: ObjectId): Promise<any> {
    try {
      const data = {
        today: {
          totalPrice: 30000,
          totalOrders: 16,
        },
        week: {
          totalPrice: 30000,
          totalOrders: 16,
        },
        month: {
          totalPrice: 30000,
          totalOrders: 16,
        },
      };
      return {
        message: "Report Generate Successfully!",
        status: "SUCCESS",
        data: data,
      };
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }
  async getTopRatedOrders(id: ObjectId): Promise<any> {
    try {
      const data = [
        {
          product: "Dosa",
          revenue: "17%",
          menuItems: 160,
        },
        {
          product: "Bada Paav",
          revenue: "17%",
          menuItems: 160,
        },
        {
          product: "Imli",
          revenue: "17%",
          menuItems: 160,
        },
        {
          product: "Paneer",
          revenue: "15%",
          menuItems: 160,
        },
        {
          product: "Chola Chaat",
          revenue: "17%",
          menuItems: 160,
        },
      ];
      return {
        message: "Report Generate Successfully!",
        status: "SUCCESS",
        data: data,
      };
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }
}
