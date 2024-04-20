import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDTO } from "./dto/create-category.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CategoryStatusDTO } from "./dto/update-status.dto";
import { AuthGuard } from "src/guards/auth.guards";
import { Public } from "src/decorators/public.decorator";

@ApiTags("Category")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Add Category" })
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor("file"))
  createCategory(
    @Req() { user }: any,
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
    return this.categoryService.createCategory(user, createCategoryDTO, file);
  }

  @Get("getAll")
  @HttpCode(HttpStatus.OK)
  getAllCategory(@Req() { user }: any) {
    return this.categoryService.getAllCategory(user);
  }
  @UseGuards(AuthGuard)
  @Public()
  @ApiOperation({ summary: "Get All Category with status and banner" })
  @Get("getAllWithStatus")
  @HttpCode(HttpStatus.OK)
  getAllCategoryWithStatus(@Req() { user }: any) {
    return this.categoryService.getAllCategoryWithStatus(user);
  }
  @UseGuards(AuthGuard)
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
