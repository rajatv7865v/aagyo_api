import {
  Body,
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateProductDTO } from "./dto/create-product.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import multer from "multer";

@ApiTags("Prodcts")
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: "Add Product" })
  @Post("add")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor("file"))
  addProduct(
    @Body() createProductDTO: CreateProductDTO,
    @UploadedFile()
    file: Express.Multer.File
  ) {
    return this.productService.addProduct(createProductDTO, file);
  }
}
