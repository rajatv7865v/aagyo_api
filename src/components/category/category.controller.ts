import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  Query,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from "@nestjs/common";

import { CategoryService } from "./category.service";
import { SortFilterDTO } from "src/common/DTO/sortFilter.dto";
import { CreateCategoryDTO } from "./dto/create-category.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Category")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: "Add Category" })
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor("file"))
  createCategory(
    @Body() createCategoryDTO: CreateCategoryDTO,
    @UploadedFile(
      // new ParseFilePipe({
      //   validators: [
      //     new MaxFileSizeValidator({ maxSize: 10000000 }),
      //     new FileTypeValidator({
      //       fileType: /(image\/jpeg|image\/png|application\/pdf)/,
      //     }),
      //   ],
      // })
    )
    file: Express.Multer.File
  ) {
    return this.categoryService.createCategory(createCategoryDTO, file);
  }

  @Get("getAll")
  @HttpCode(HttpStatus.OK)
  getAllCategory(@Query() sortFilterDTO: SortFilterDTO) {
    return this.categoryService.getAllCategory();
  }
}
