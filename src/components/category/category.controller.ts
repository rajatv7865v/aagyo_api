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
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CategoryStatusDTO } from "./dto/update-status.dto";

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
    @UploadedFile() // new ParseFilePipe({
    //   validators: [
    file //     new MaxFileSizeValidator({ maxSize: 10000000 }),
    //     new FileTypeValidator({
    //       fileType: /(image\/jpeg|image\/png|application\/pdf)/,
    //     }),
    //   ],
    // })
    : Express.Multer.File
  ) {
    return this.categoryService.createCategory(createCategoryDTO, file);
  }

  @Get("getAll")
  @HttpCode(HttpStatus.OK)
  getAllCategory() {
    return this.categoryService.getAllCategory();
  }

  @ApiOperation({ summary: "Get All Category with status and banner" })
  @Get("getAllWithStatus")
  @HttpCode(HttpStatus.OK)
  getAllCategoryWithStatus() {
    return this.categoryService.getAllCategoryWithStatus();
  }

  @ApiOperation({ summary: "Update Category Status" })
  @ApiParam({ name: "id", description: "Category Id" })
  @ApiBody({ type: CategoryStatusDTO })
  @Patch("updateStatus/:id")
  @HttpCode(HttpStatus.OK)
  updateCategoryStatus(
    @Param("id") id: any,
    @Body() categoryStatusDTO: CategoryStatusDTO
  ) {
    return this.categoryService.updateCategoryStatus(id, categoryStatusDTO);
  }
}
