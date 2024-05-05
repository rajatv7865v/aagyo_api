import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guards";
import { UpdateOrderStatusDTO } from "./dto/update-status.dto";

@UseGuards(AuthGuard)
@ApiTags("Orders")
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
  @ApiOperation({ summary: "Get Analytics Report of Top  Orders" })
  @HttpCode(HttpStatus.OK)
  getTopRatedOrders(@Req() { sub }: any) {
    return this.ordersService.getTopRatedOrders(sub);
  }

  @Get("/currentOrders")
  @ApiOperation({ summary: "Get Current Orders by user" })
  @HttpCode(HttpStatus.OK)
  getCurrentOrders(@Req() { sub }: any) {
    return this.ordersService.getCurrentOrders(sub);
  }

  @Post("/updateStatus")
  @ApiOperation({ summary: "Update Order Status" })
  @ApiBody({ type: UpdateOrderStatusDTO })
  @HttpCode(HttpStatus.OK)
  updateStatus(
    @Req() { sub }: any,
    @Body() updateOrderStatusDTO: UpdateOrderStatusDTO
  ) {
    return this.ordersService.updateStatus(sub, updateOrderStatusDTO);
  }
}
