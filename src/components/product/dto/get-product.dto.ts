import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetProductDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly search?: string = "";

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  readonly limit?: number = 10;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  readonly page?: number = 1;
}
