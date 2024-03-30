import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { UnitService } from "./unit.services";
import { CreateUnitDTO } from "./dto/create-unit.dto";

@Controller("unit")
export class UnitController {
  constructor(private readonly unitService: UnitService) {}
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  createUnit(@Body() createUnitDTO: CreateUnitDTO) {
    return this.unitService.createUnit(createUnitDTO);
  }

  @Get("getAll")
  @HttpCode(HttpStatus.OK)
  getAllAttribute() {
    return this.unitService.getAllUnit();
  }

  @Delete("delete/:id")
  @HttpCode(HttpStatus.OK)
  deleteUnitById(@Param("id") id: string) {
    return this.unitService.deleteUnitById(id);
  }

  @Get("get/:id")
  @HttpCode(HttpStatus.OK)
  getUnitById(@Param("id") id: string) {
    return this.unitService.getUnitById(id);
  }

  

  @Patch("update/:id")
  @HttpCode(HttpStatus.OK)
  updateUnitById(@Param("id") id: string, @Body() value: any) {
    return this.unitService.updateUnitById(id, value);
  }
}
