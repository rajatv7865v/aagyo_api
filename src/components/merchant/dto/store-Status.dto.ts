import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsString } from "class-validator";

export class StoreStatus {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isOpen: boolean = true;

  @ApiProperty()
  autoOpenTime: Date = null;
}
