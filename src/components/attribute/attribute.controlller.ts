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
import { AttributeService } from "./attribute.service";
import { CreateAttributeDTO } from "./dto/create-attribute.dto";

@Controller("attribute")
export class AtrributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post("create")
  @HttpCode(HttpStatus.OK)
  createAttribute(@Body() createAttributeDTO: CreateAttributeDTO) {
    return this.attributeService.createAttribute(createAttributeDTO);
  }

  @Get("getAll")
  @HttpCode(HttpStatus.OK)
  getAllAttribute() {
    return this.attributeService.getAllAttribute();
  }
  
  @Get("get/:id")
  @HttpCode(HttpStatus.OK)
  getAttributeById(@Param('id')id:string) {
    return this.attributeService.getAttributeById(id);
  }

  @Delete("delete/:id")
  @HttpCode(HttpStatus.OK)
  deleteAttributeById(@Param("id") id: string) {
    return this.attributeService.deleteAttributeById(id);
  }

  @Patch("update/:id")
  @HttpCode(HttpStatus.OK)
  updateAtttributeById(@Param("id") id: string, @Body() value: any) {
    return this.attributeService.updateAtttributeById(id, value);
  }
}
