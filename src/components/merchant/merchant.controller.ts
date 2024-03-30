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
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

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
    schema: {
        
      }
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
}
