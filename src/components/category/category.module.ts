import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { S3Service } from "../s3/s3.service";

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [CategoryService,S3Service],
})
export class CategoryModule {}
