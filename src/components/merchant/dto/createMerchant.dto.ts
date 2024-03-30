import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
  IsObject,
  IsStrongPassword,
  ValidateNested,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
  IsDefined,
  ArrayMinSize,
} from "class-validator";
import { Type as ValidationTypes } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

class storeDetails {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: "Name could not be empty" })
  readonly fullName: string;

  @ApiProperty()
  @IsString()
  @IsPhoneNumber()
  readonly phoneNumber: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsStrongPassword()
  @Min(8)
  @Max(16)
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly storeName: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly contactEmail: string;

  @ApiProperty()
  @IsString()
  @IsPhoneNumber()
  readonly contactNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly contactPerson: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly loyality: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly country: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly state: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly timeZone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly zipCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly operatingZone: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly prepareTime: number;

  @ApiProperty()
  @IsString()
  readonly operationType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly aboutUs: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  readonly banner: Object;
}

class storeTime {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly isFullTimeOpen: boolean;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  readonly time: Object;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  readonly openDays: [];

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly storeOffMessage: string;
}

class commission {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly payoutType: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly value: 0;
}

class storeTags {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1, { message: "Array must have at least one element" })
  readonly tags: [];
}

export class storeCategory {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1, { message: "Array must have at least one element" })
  readonly category: [];
}

export class CreateMerchantDTO {
  @ApiProperty()
  @ValidateNested()
  @IsDefined()
  @IsNotEmpty()
  // @ValidationTypes(() => storeDetails)
  storeDetails?: storeDetails;

  @ApiProperty()
  @IsObject()
  @IsDefined()
  @ValidateNested()
  @IsNotEmpty()
  @ValidationTypes(() => storeTime)
  storeTime?: storeTime;

  @ApiProperty()
  @IsObject()
  @IsDefined()
  @ValidateNested()
  @ValidationTypes(() => commission)
  commission: commission;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @ValidationTypes(() => storeTags)
  storeTags: storeTags;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @ValidationTypes(() => storeCategory)
  storeCategory: storeCategory;
}
