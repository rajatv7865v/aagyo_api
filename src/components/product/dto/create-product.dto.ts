import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class CreateProductDTO {
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

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  attributes: any[];

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  varients: any[];

  @ApiProperty({ type: "string", format: "binary" })
  productImage: File;
}
