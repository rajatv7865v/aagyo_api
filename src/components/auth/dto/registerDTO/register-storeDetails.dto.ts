import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { ObjectId } from "mongodb";

export class RegisterStoreDetailDTO {
  @ApiProperty()
  @IsNotEmpty()
  id: ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  storeName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;
}
