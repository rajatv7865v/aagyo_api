import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { MerchantService } from "./merchant.service";
import { CreateMerchantDTO } from "./dto/createMerchant.dto";
import { MerchantSortFilterDTO } from "./dto/merchantSortFilterDTO";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { StoreStatus } from "./dto/store-Status.dto";

@ApiTags("Merchant")
@Controller("/merchant")
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get("/")
  @HttpCode(HttpStatus.OK)
  getAllMerchants(@Query() merchantSortFilterDTO: MerchantSortFilterDTO) {
    return this.merchantService.getAllMerchants(merchantSortFilterDTO);
  }

  @Get("/get/:id")
  @HttpCode(HttpStatus.OK)
  getMerchantById(@Param("id") id: string) {
    return this.merchantService.getMerchantById(id);
  }

  @Post("/create")
  @ApiOperation({ summary: "Register Merchant" })
  @ApiBody({
    schema: {},
  })
  @HttpCode(HttpStatus.CREATED)
  createMerchant(@Body() createMerchantDTO: CreateMerchantDTO) {
    return this.merchantService.createMerchant(createMerchantDTO);
  }

  @Patch("/update/:id")
  @ApiOperation({ summary: "Update Merchant Details using id" })
  @HttpCode(HttpStatus.CREATED)
  updateMerchant(
    @Body() createMerchantDTO: CreateMerchantDTO,
    @Param("id") id: Object
  ) {
    return this.merchantService.updateMerchant(id, createMerchantDTO);
  }

  @Get("/getAllStoresName")
  @HttpCode(HttpStatus.OK)
  getAllStoresName() {
    return this.merchantService.getAllStoresName();
  }

  @Patch("/storeStatus/:merchantId")
  @ApiOperation({ summary: "Update Store is open or Close" })
  @ApiParam({
    name: "merchantId",
    description: "ID of the Merchnat",
    type: String,
  })
  @HttpCode(HttpStatus.OK)
  isStoreOpenStatus(
    @Param("merchantId") merchantId: any,
    @Body() storeStatus: StoreStatus
  ) {
    return this.merchantService.isStoreOpenStatus(merchantId, storeStatus);
  }

  @Get("profileDetail/:merchantId")
  @ApiParam({
    name: "merchantId",
    description: "ID of the Merchnat",
    type: String,
  })
  @ApiOperation({ summary: "Get  Merchant's Profile Detail" })
  @HttpCode(HttpStatus.OK)
  getProfileDetail(@Param("merchantId") merchantId: any) {
    return this.merchantService.getProfileDetail(merchantId);
  }
}
