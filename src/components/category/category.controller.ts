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
} from "@nestjs/common";

import { CategoryService } from "./category.service";
import { SortFilterDTO } from "src/common/DTO/sortFilter.dto";

@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get("getAll")
  @HttpCode(HttpStatus.OK)
  getAllCategory(@Query() sortFilterDTO: SortFilterDTO) {
    return this.categoryService.getAllCategory();
  }
}

