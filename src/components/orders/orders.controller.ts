import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guards";

@UseGuards(AuthGuard)
@Controller("orders")
export class OrdersController {
  constructor(readonly ordersService: OrdersService) {}

  @Post()
  createOrder() {
    return this.ordersService.createOrder();
  }

  @Get("/delivered")
  @ApiOperation({ summary: "Get Analytics Report of Delivered Order" })
  @HttpCode(HttpStatus.OK)
  getDeliveredOrderDetails(@Req() { sub }: any) {
    return this.ordersService.getDeliveredOrderDetails(sub);
  }

  @Get("/rejected")
  @ApiOperation({ summary: "Get Analytics Report of Rejected Order" })
  @HttpCode(HttpStatus.OK)
  getRejectedOrderDetails(@Req() { sub }: any) {
    return this.ordersService.getRejectedOrderDetails(sub);
  }

  @Get("/topRatedOrders")
  @ApiOperation({ summary: "Get Analytics Report of Rejected Order" })
  @HttpCode(HttpStatus.OK)
  getTopRatedOrders(@Req() { sub }: any) {
    return this.ordersService.getTopRatedOrders(sub);
  }
}
