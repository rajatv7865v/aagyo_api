import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateProductDTO } from "./dto/create-product.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("Products")
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: "Add Product" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Store Detail",
    type: CreateProductDTO,
  })
  @Post("add")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor("productImage"))
  addProduct(
    @Req() { sub }: any,
    @Body() createProductDTO: CreateProductDTO,
    @UploadedFile()
    productImage: Express.Multer.File
  ) {
    return this.productService.addProduct(sub, createProductDTO, productImage);
  }
}
