import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class CreateProductDTO {
  @ApiProperty()
  @IsNotEmpty()
  id: ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  productName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  tags: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  keywords: string[];

  @ApiProperty({
    type: "object",
    format: "binary",
    description: "The file to upload",
    required: true,
  })
  file: File;
}
